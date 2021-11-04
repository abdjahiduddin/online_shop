// Import Database User Model
const Users = require('../models/users')

exports.getLogin = (req, res) => {
    let isLogin = false
    if (req.session.isLogin) {
        isLogin = true
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        isAuthenticated: req.session.isLogin
    })
}

exports.postLogin = (req, res) => {
    Users.findById('6182a604704e37d4b9e68505')
    .then(user => {
        req.session.user = user
        req.session.isLogin = true
        res.session.save(err => {
            res.redirect('/')
        })
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
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