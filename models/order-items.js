const Sequelize = require('sequelize')

const sequelize = require('../utils/database-connection')

const OrderItems = sequelize.define('orderItems', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: Sequelize.INTEGER
})

module.exports = OrderItems