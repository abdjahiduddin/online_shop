// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')
const bodyParser = require('body-parser')

// Import Controller
const errorController = require('./controllers/error')

// Import Database Connection
const db = require('./utils/database-connection')

// Import Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

console.log("Start Apps....")

// db.execute('SELECT * FROM products')
//     .then(result => {
//         console.log(result)
//     })
//     .catch(err => {
//         console.log(err)
//     })

// EJS Template Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    console.log(req.path, '-', req.method)
    next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

app.listen(3000)