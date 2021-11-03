// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Import Controller
const errorController = require('./controllers/error')

const uri = 'mongodb+srv://node_user:toor@freecodecamp.yulo9.mongodb.net/node_db?retryWrites=true&w=majority'

// Import Database User Model
const Users = require('./models/users')

// Import Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

console.log("Start Apps....")

// EJS Template Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    console.log(req.path, '-', req.method)
    Users.findById('6182a604704e37d4b9e68505')
        .then( user => {
            req.user = user
            next()
        })
        .catch( err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect(uri)
    .then( connect => {
        // const user = new Users({
        //     name: 'jay', 
        //     email:'jay@test.com',
        //     cart: {
        //         items: []
        //     }
        // })
        // user.save()
        console.log('Connected to MongoDB!')
        app.listen(3000)
    })
    .catch( err => console.log(err))