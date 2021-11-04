// Import Database User Model
const Users = require('../models/users')

const bcrypt = require('bcryptjs')

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        isAuthenticated: req.session.isLogin
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
                        req.session.user = user
                        req.session.isLogin = true
                        return res.session.save(err => {
                            res.redirect('/')
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                })
        }
        res.redirect('/login')
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
}

exports.getSignUp = (req, res) => {
    res.render('auth/signup',{
        pageTitle: 'Sign Up',
        path: 'signup',
        isAuthenticated: false
    })
}

exports.postSignUp = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPass = req.body.confirmPassword
    Users.findOne({ email: email })
    .then(user => {
        if (user) {
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