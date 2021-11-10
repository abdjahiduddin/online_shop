// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')
const { body } = require('express-validator')

// Import Controllers
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const routes = express.Router()

routes.route('/add-product')
    .get(isAuth, adminController.getAddProducts)
    .post(isAuth,[
        body('title').trim().isString().isLength({ min: 3 }),
        body('price').isFloat().trim(),
        body('description').isLength({ min: 5 }).trim()
    ], adminController.postAddProducts)

routes.get('/products', isAuth, adminController.getProducts)

routes.get('/edit-product/:productId', isAuth, adminController.getEditProducts)

routes.post('/edit-product', 
    isAuth,[
        body('title').trim().isString().isLength({ min: 3 }),
        body('price').isFloat().trim(),
        body('description').isLength({ min: 5 }).trim()
    ], adminController.postEditProducts)

routes.delete('/product/:productId', isAuth, adminController.deleteProduct)

module.exports = routes