// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')

// Import Controllers
const productController = require('../controllers/products')

const routes = express.Router()

routes.get('/add-product', productController.getAddProducts)

routes.post('/add-product', productController.postAddProducts)

module.exports = routes