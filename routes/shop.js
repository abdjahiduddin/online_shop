const path = require('path')

const express = require('express')

const rootDir = require('../utils/path')

const routes = express.Router()

routes.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'shop.html'))
})

module.exports = routes