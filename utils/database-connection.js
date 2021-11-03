const mysql = require('mysql2')

const pool = mysql.createPool({
    host: '172.25.64.1',
    user: 'node-user',
    database: 'node_complete',
    password: 'toor'
})

module.exports = pool.promise()