const express = require('express')
const { body } = require('express-validator')

const authController = require('../controllers/auth')
const Users = require('../models/users')

const routes = express.Router()

routes.route('/login')
    .get(authController.getLogin)
    .post([
        body('email').isEmail().withMessage('Invalid Email or Password').normalizeEmail(),
        body('password', 'Invalid Email or Password').isLength({ min: 6 }).trim()
    ],
    authController.postLogin)

routes.route('/logout').post(authController.postLogout)

routes.route('/signup')
    .get(authController.getSignUp)
    .post([
        body('email').isEmail().withMessage('Please enter valid email').normalizeEmail().custom(value => {
            return Users.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('E-mail already in use. Try another one!')
                }
            })
        }),
        body('password', 'Please enter password with at least 6 character').isLength({ min: 6 }).trim(),
        body('confirmPassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password have to match')
            }
            return true
        })
    ],
    authController.postSignUp)

routes.route('/reset').get(authController.getReset).post(authController.postReset)

routes.route('/reset/:token').get(authController.getNewPassword)

routes.route('/new-password').post(authController.postNewPassword)

module.exports = routes