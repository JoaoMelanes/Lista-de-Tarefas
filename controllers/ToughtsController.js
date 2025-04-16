const e = require('connect-flash')
const Tought = require('../models/Tought')
const User = require('../models/User')
const { where } = require('sequelize')
const { raw } = require('mysql2')
const {Op} = require('sequelize')

module.exports = class ToughtsController{
    static async showTougths(req, res){ 

        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const toughtsData = await Tought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            order: [['createdAt', order]]
        })
        
        const toughts = toughtsData.map((result) => result.get({plain:true}))

        let toughtsqty = toughts.length

        if(toughtsqty === 0){
            toughtsqty = false
        }

        res.render('toughts/home', {toughts, search, toughtsqty})
    }

    static async dashboard(req, res) {
        const UserId = req.session.userid

        const user = await User.findOne({
            where: {id: UserId},
            include: Tought,
            plain: true
        })

        if(!user){
            res.redirect('/login')
        }

        //filtra o array sujo
        const toughts = user.Toughts.map((result) => result.dataValues)

        let empytToughts = false

        if(toughts.length === 0){
            empytToughts = true
        }

        res.render('toughts/dashboard', {toughts, empytToughts})

    }

    static createTought(req, res){
        res.render('toughts/add')
    }

    static async createToughtSave(req, res) {
        const toughts = {
            title: req.body.titulo,
            UserId: req.session.userid
        }

        await Tought.create(toughts)
        req.flash('message', "Pensamento criado!")

        req.session.save(() => {
            res.redirect('/toughts/dashboard')
        })
        
    }

    static async deleteTought(req, res) {
        const id = req.body.id
        const UserId = req.session.userid

        await Tought.destroy({
            where: {id: id, UserId: UserId}
        })

        req.flash('message', 'Pensamento removido!')
        req.session.save(() => {
            res.redirect("/toughts/dashboard")
        })
        
    }

    static async editTought(req, res) {
        const id = req.params.id

        const toughts = await Tought.findOne({where: {id: id}, raw: true})

        res.render('toughts/edit', {toughts})
    }

    static async updateTought(req, res) {
        const id = req.body.id
        const tought = { 
            title: req.body.pensamento
        }

        await Tought.update(tought, {where: {id:id}})

        req.flash('message', 'Pensamento atualizado!')
        req.session.save(() =>{
            res.redirect('/toughts/dashboard')
        })
         
    }
}