// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')
const bodyParser = require('body-parser')

// Import Controller
const errorController = require('./controllers/error')

// Import Database Connection
const mongoConnection = require('./utils/database-connection').mongoConnection

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
    Users.findById('618119795f67c759a91aa825')
    .then( user => {
        const userObj = new Users(user.user, user.email, user._id, user.cart)
        req.user = userObj
        next()
    }).catch( err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoConnection( db => {
    app.listen(3000)
    // const user = new Users('jay', 'jay@email.com')
    // user.save()
    // .then( result => {
        
    //     app.listen(3000)
    // })
    // .catch( err => console.log(err))
})