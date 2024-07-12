const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    }
})

module.exports = Tought