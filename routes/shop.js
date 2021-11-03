// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')

// Import Controllers
const shopController = require('../controllers/shop')

const routes = express.Router()

routes.get('/', shopController.getIndex)

routes.get('/cart', shopController.getCart)

routes.get('/orders', shopController.getOrders)

routes.get('/checkout', shopController.getCheckout)

routes.get('/products', shopController.getShop)

module.exports = routes