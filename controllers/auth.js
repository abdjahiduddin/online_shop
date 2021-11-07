// Import Database User Model
const Users = require('../models/users')

const Transporter = require('../utils/nodemailer')

const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const { validationResult } = require('express-validator')

dotenv.config()

exports.getLogin = (req, res) => {
    const flashErrorMessage = req.flash('error')
    const flashSuccessMessage = req.flash('success')
    let errorMessage = null
    let successMessage = null
    if (flashErrorMessage.length > 0) {
        errorMessage = flashErrorMessage[0]
    } else if (flashSuccessMessage.length > 0) {
        successMessage = flashSuccessMessage[0]
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        errorMessage: errorMessage,
        successMessage: successMessage,
        oldInput: {
            email: '',
            password: ''
        },
        errorValidation: []
    })
}

exports.postLogin = (req, res) => {
    const errorValidation = validationResult(req)
    const email = req.body.email
    const password = req.body.password

    if (!errorValidation.isEmpty()) {
        const errorMsg = errorValidation.array()[0].msg
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: 'login',
            errorMessage: errorMsg,
            successMessage: null,
            oldInput: {
                email: email,
                password: password
            },
            errorValidation: errorValidation.array()
        }) 
    }

    Users.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(isMatched => {
                        if (isMatched) {
                            const editedUser = {
                                cart: user.cart,
                                _id: user._id,
                                email: user.email,
                                __v: user.__v
                            }
                            req.session.user = editedUser
                            req.session.isLogin = true
                            return req.session.save(err => {
                                return res.redirect('/')
                            })
                        }
                        res.status(422).render('auth/login', {
                            pageTitle: 'Login',
                            path: 'login',
                            errorMessage: 'Invalid Email or Password',
                            successMessage: null,
                            oldInput: {
                                email: email,
                                password: password
                            },
                            errorValidation: []
                        }) 
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: 'login',
                    errorMessage: 'Invalid Email or Password',
                    successMessage: null,
                    oldInput: {
                        email: email,
                        password: password
                    },
                    errorValidation: []
                }) 
            }
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login')
    })
}

exports.getSignUp = (req, res) => {
    const flashMessage = req.flash('error')
    let message = null
    if (flashMessage.length > 0) {
        message = flashMessage[0]
    }
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: 'signup',
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        errorValidation: []
    })
}

exports.postSignUp = (req, res) => {
    const errorValidation = validationResult(req)

    const email = req.body.email
    const password = req.body.password
    const confirmPass = req.body.confirmPassword

    if (!errorValidation.isEmpty()) {
        const error = errorValidation.array()[0].msg
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign Up',
            path: 'signup',
            errorMessage: error,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPass
            },
            errorValidation: errorValidation.array()
        })
    }

    bcrypt.hash(password, 12)
        .then(hashPassword => {
            const newUser = new Users({
                email: email,
                password: hashPassword,
                cart: { items: [] }
            })
            return newUser.save()
        })
        .then(result => {
            res.render('auth/signup-succeed', {
                pageTitle: 'Signup Succeed',
                path: 'signup-succeed'
            })
            const mailOptions = {
                from: `"Our Online Shop" <${process.env.EMAIL_USER}>`, // sender address (who sends)
                to: `${email}`, // list of receivers (who receives)
                subject: 'SignUp Succeed', // Subject line
                text: 'Thanks for joining us ', // plaintext body
                html: `<b>Hello ${email} </b><br> This is the first email sent with Nodemailer in Node.js` // html body
            }
            return Transporter.sendMail(mailOptions)
        })
        .then(result => {
            console.log('Message Sent: ', result.response)
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getReset = (req, res) => {
    const flashMessage = req.flash('error')
    let message = null
    if (flashMessage.length > 0) {
        message = flashMessage[0]
    }
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: 'reset',
        errorMessage: message
    })
}

exports.postReset = (req, res) => {
    const email = req.body.email
    let token

    Users.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Email not found!')
                return res.redirect('/reset')
            }
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    console.log(err)
                    req.flash('error', 'Token generated failed!')
                    return res.redirect('/reset')
                }
                token = buffer.toString('hex')
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                user.save()
                    .then(result => {
                        res.render('auth/check-email',{
                            pageTitle: 'Reset Password',
                            path: 'reset-notification'
                        })
                        const mailOptions = {
                            from: `"Our Online Shop" <${process.env.EMAIL_USER}>`, // sender address (who sends)
                            to: `${email}`, // list of receivers (who receives)
                            subject: 'Reset Password', // Subject line
                            html: `
                                <h1>You requested a reset password</h1>
                                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                                <p>If you don't request a reset password. Please ignore this email!!!</p>
                            ` // html body
                        }
                        return Transporter.sendMail(mailOptions)
                    })
                    .then(info => {
                        console.log('Message Sent: ', info.response)
                    })
                    .catch(err => console.log(err))
            })
        })
        .catch(err => console.log(err))
}

exports.getNewPassword = (req, res) => {
    const token = req.params.token
    const flashMessage = req.flash('error')
    let message = null
    if (flashMessage.length > 0) {
        message = flashMessage[0]
    }

    Users.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    })
        .then(user => {
            if (!user) {
                return res.render('auth/wrong-token', {
                    pageTitle: 'Invalid Token',
                    path: 'wrong-password',
                    errorMessage: null
                })
            }
            res.render('auth/new-password', {
                pageTitle: 'Enter New Password',
                path: 'new-password',
                errorMessage: message,
                userId: user._id,
                token: token
            })
        })
        .catch(err => console.log(err))
}

exports.postNewPassword = (req, res) => {
    const userId = req.body.userId
    const token = req.body.token
    const newPassword = req.body.password
    let updateUser

    Users.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            updateUser = user
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashPassword => {
            updateUser.password = hashPassword
            updateUser.resetToken = undefined
            updateUser.resetTokenExpiration = undefined
            return updateUser.save()
        })
        .then(result => {
            res.render('auth/reset-succeed',{
                pageTitle: 'Reset Password Succeed',
                path: 'reset-succeed'
            })
        })
        .catch(err => console.log(err))
}
// Contoh
// exports.postLogin = (req, res) => {
//     // res.setHeader('Set-Cookie', 'isLogin=true; Secure') HTTPS
//     // res.setHeader('Set-Cookie', 'isLogin=true; HttpOnly')
//     // res.setHeader('Set-Cookie', 'isLogin=true; Max-Age=10')
//     req.session.isLogin = true
//     res.redirect('/')
// }