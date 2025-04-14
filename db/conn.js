const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try{
    sequelize.authenticate()
    console.log('conectado')
}catch(err){
    console.log(err)
}

module.exports = sequelize