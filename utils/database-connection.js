const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('node_complete', 'node-user', 'toor', {
    dialect: 'mysql',
    host: '172.25.64.1'
})

module.exports = sequelize