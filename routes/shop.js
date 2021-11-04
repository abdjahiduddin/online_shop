// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')

// Import Controllers
const shopController = require('../controllers/shop')

const routes = express.Router()

routes.get('/', shopController.getIndex)

routes.get('/products', shopController.getProducts)

routes.get('/product/:id', shopController.getProductDetails)

routes.route('/cart').get(shopController.getCart).post(shopController.postCart)

routes.post('/cart-delete-item', shopController.postCartDeleteItem)

routes.get('/orders', shopController.getOrders)

routes.post('/create-orders', shopController.postOrders)

// // routes.get('/checkout', shopController.getCheckout)

module.exports = routes