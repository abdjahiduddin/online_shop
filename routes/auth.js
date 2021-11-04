const express = require('express')

const authController = require('../controllers/auth')

const routes = express.Router()

routes.route('/login').get(authController.getLogin).post(authController.postLogin)

routes.post('/logout', authController.postLogout)

module.exports = routes