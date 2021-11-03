const path = require('path')

const express = require('express')

const rootDir = require('../utils/path')

const routes = express.Router()

const usersData = []

routes.get('/users', (req, res, next) => {
    console.log(req.path, '-', req.method)
    console.log(usersData)
    res.render('users', {users: usersData ,pageTitle: 'List Users', path: 'list-users'})
})

routes.get('/', (req, res, next) => {
    console.log(req.path, '-', req.method)
    res.render('main', {pageTitle: 'Add New User', path: 'new-user'})   
})

routes.post('/input-data', (req, res) => {
    console.log(req.path, '-', req.method)
    usersData.push(req.body.user)
    res.redirect('/users')
})

module.exports = routes