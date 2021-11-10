// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')

// Import Controllers
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const routes = express.Router()

routes.get('/', shopController.getIndex)

routes.get('/products', shopController.getProducts)

routes.get('/product/:id', shopController.getProductDetails)

routes.route('/cart').get(isAuth, shopController.getCart).post(isAuth, shopController.postCart)

routes.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem)

routes.get('/orders', isAuth, shopController.getOrders)

// routes.post('/create-orders', isAuth, shopController.postOrders) Old Checkout Flow

routes.get('/invoices/:orderId', isAuth, shopController.getInvoice)

routes.get('/checkout', shopController.getCheckout)

routes.get('/checkout/success', shopController.getCheckoutSuccess)
routes.get('/checkout/cancel', shopController.getCheckout)

module.exports = routes