
const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthsController{
    static login(req, res) {
        res.render('auth/login')
    }
    
    static async loginPost(req, res){
        const {email, senha} = req.body

        const user = await User.findOne({where: {email: email}})

        if(!user){
            res.render('auth/login')
            req.flash('message', 'Usuario não encontrado!')
            return
        }

        const senhaMatch = bcrypt.compareSync(senha, user.senha)

        if(!senhaMatch){
            req.flash('message', 'Senha invalida!')
            res.render('auth/login')
            
            return
        }
        // inicializar session
        req.session.userid = user.id
        req.flash('message', `Seja bem-vindo ${user.name} !`)
        req.session.save(() => {
            res.redirect('/')
        })

    }
    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost( req, res) {
        const {name, email, senha, confirmarsenha} = req.body
        //validação da senha
        if(senha !== confirmarsenha){
            req.flash('message', 'As senhas não são iguais, tente novamente')
            res.render('auth/register')
            
            return
        }

        //usuario existente
        const checkIfUsersExist = await User.findOne({where: {email: email}})

        if(checkIfUsersExist){
            req.flash('message', 'O e-mail já está em uso!')
            res.render('auth/register')
            return
        }

        //create senha
        const salt = bcrypt.genSaltSync(10)
        const hashedSenha = bcrypt.hashSync(senha, salt)

        const user = {
            name,
            email,
            senha: hashedSenha
        }

        try{
            const createUser = await User.create(user) 

            req.flash('message', 'Cadastro realizado com sucesso!')

            // INICIALIZAR SESSION
            req.session.userid = createUser.id
            req.session.save(() => {
                res.redirect('/')
            })
            
        }catch(err){
            console.log(err)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

}
