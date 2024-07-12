const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate();
    console.log('Conectamos ao Sequelize')
    
} catch (error) {
    console.log(`Não foi possível conectar devido ao erro ${error}`)
    
}

module.exports = sequelize