// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')

// Import Controllers
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const routes = express.Router()

routes.route('/add-product').get(isAuth, adminController.getAddProducts).post(isAuth, adminController.postAddProducts)

routes.get('/products', isAuth, adminController.getProducts)

routes.get('/edit-product/:productId', isAuth, adminController.getEditProducts)

routes.post('/edit-product', isAuth, adminController.postEditProducts)

routes.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = routes