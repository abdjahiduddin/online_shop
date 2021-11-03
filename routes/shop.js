const path = require('path')

const express = require('express')

const rootDir = require('../utils/path')
const adminData = require('../routes/admin')

const routes = express.Router()

routes.get('/', (req, res) => {
    const products = adminData.products
    console.log(products)
    // Handlebars
    // res.render('shop', { 
    //     prods: products, 
    //     pageTitle: 'Shop', 
    //     path: 'shop', 
    //     hasProducts: products.length > 0,
    //     shop: true,
    //     product: true,
    //     activeShop: true
    // })

    // EJS
    res.render('shop', { prods: products, pageTitle: 'Shop', path: 'shop'})

    // Pug, EJS and default
    // res.render('shop', { prods: products, pageTitle: 'Shop', path: 'shop'})
})

module.exports = routes