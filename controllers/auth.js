// Import Database User Model
const Users = require('../models/users')

const bcrypt = require('bcryptjs')

exports.getLogin = (req, res) => {
    const flashMessage = req.flash('error')
    let message = null
    if (flashMessage.length > 0) {
        message = flashMessage[0]
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        errorMessage: message
    })
}

exports.postLogin = (req, res) => {
    const email = req.body.email
    const password = req.body.password
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
                    req.flash('error', 'Invalid Email or Password')
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                })
        } else {
            req.flash('error', 'Invalid Email or Password')
            res.redirect('/login')
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
    res.render('auth/signup',{
        pageTitle: 'Sign Up',
        path: 'signup',
        errorMessage: message
    })
}

exports.postSignUp = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPass = req.body.confirmPassword
    Users.findOne({ email: email })
    .then(user => {
        if (user) {
            req.flash('error', 'Email exists already!!')
            return res.redirect('/signup')
        }

        return bcrypt.hash(password, 12)
                .then(hashPassword => {
                    const newUser = new Users({
                        email: email,
                        password: hashPassword,
                        cart: { items: [] }
                    })
                    return newUser.save()
                })
                .then(result => {
                    res.redirect('/login')
                })
    })
    .catch(err => {
        console.log(err)
    })
}

// Contoh
// exports.postLogin = (req, res) => {
//     // res.setHeader('Set-Cookie', 'isLogin=true; Secure') HTTPS
//     // res.setHeader('Set-Cookie', 'isLogin=true; HttpOnly')
//     // res.setHeader('Set-Cookie', 'isLogin=true; Max-Age=10')
//     req.session.isLogin = true
//     res.redirect('/')
// }