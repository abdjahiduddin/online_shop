const path = require('path')

const express = require('express')

const rootDir = require('../utils/path')

const routes = express.Router()

routes.get('/users', (req, res, next) => {
    console.log("Request Path - /users")
    res.sendFile(path.join(rootDir, 'views', 'users.html'))
})

routes.get('/', (req, res, next) => {
    console.log("Request Path - /")
    res.sendFile(path.join(rootDir, 'views', 'main.html'))    
})

module.exports = routes