const path = require('path')

const express = require('express')

const rootDir = require('../utils/path')

const routes = express.Router()

const products = []

routes.get('/add-product', (req, res) => {
    // Handlebars
    // res.render('add-product', { 
    //     pageTitle: 'Add Product', 
    //     path: 'product',
    //     activeProduct: true,
    //     shop: true,
    //     product: true
    // })
    
    // EJS
    res.render('add-product', { pageTitle: 'Add Product', path: 'product' })
    
    // Pug and Default 
    // res.render('add-product', { pageTitle: 'Add Product', path: 'product' })
})

routes.post('/add-product', (req, res) => {
    products.push({ title: req.body.title })
    res.redirect('/')
})

exports.routes = routes
exports.products = products
