const Sequelize = require('sequelize')

const sequelize = require('../utils/database-connection')

const CartItems = sequelize.define('cartItems', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: Sequelize.INTEGER
})

module.exports = CartItems