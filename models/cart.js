const Sequelize = require('sequelize')

const sequelize = require('../utils/database-connection')

const Carts = sequelize.define('carts', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = Carts