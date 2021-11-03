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

module.exports = routes