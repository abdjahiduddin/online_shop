const express = require('express')

const authController = require('../controllers/auth')

const routes = express.Router()

routes.route('/login').get(authController.getLogin).post(authController.postLogin)

routes.route('/logout').post(authController.postLogout)

routes.route('/signup').get(authController.getSignUp).post(authController.postSignUp)

routes.route('/reset').get(authController.getReset).post(authController.postReset)

routes.route('/reset/:token').get(authController.getNewPassword)

routes.route('/new-password').post(authController.postNewPassword)

module.exports = routes