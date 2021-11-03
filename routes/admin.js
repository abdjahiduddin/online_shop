const path = require('path')

const express = require('express')

const rootDir = require('../utils/path')

const routes = express.Router()

routes.get('/add-product', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

routes.post('/add-product', (req, res) => {
    console.log(req.body)
    res.redirect('/')
})

module.exports = routes