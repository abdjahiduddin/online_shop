// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')

// Import Controllers
const shopController = require('../controllers/shop')

const routes = express.Router()

routes.get('/', shopController.getIndex)

routes.route('/cart').get(shopController.getCart).post(shopController.postCart)

routes.post('/cart-delete-item', shopController.postCartDeleteItem)

routes.get('/orders', shopController.getOrders)

routes.get('/product/:id', shopController.getProductDetails)

routes.get('/checkout', shopController.getCheckout)

routes.get('/products', shopController.getShop)

module.exports = routes