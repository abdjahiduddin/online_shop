// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')

// Import Controllers
const adminController = require('../controllers/admin')

const routes = express.Router()

routes.get('/add-product', adminController.getAddProducts)

routes.post('/add-product', adminController.postAddProducts)

routes.get('/products', adminController.getProducts)

routes.get('/edit-product/:productId', adminController.getEditProducts)

routes.post('/edit-product', adminController.postEditProducts)

routes.post('/delete-product', adminController.postDeleteProduct)

module.exports = routes