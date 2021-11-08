// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBSessionStore =  require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const dotenv = require('dotenv')

dotenv.config()

// Import Controller
const errorController = require('./controllers/error')

const MONGODB_URI = process.env.MONGODB_URI

// Import Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const app = express()

const store = new MongoDBSessionStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf()

console.log("Start Apps....")

// EJS Template Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store})
)

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    console.log(req.path, '-', req.method)
    res.locals.isAuthenticated = req.session.isLogin
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

// Error Handling
app.get('/500', errorController.get500)
app.use(errorController.get404)
app.use((error, req, res, next) => {
    // res.redirect('/500')
    res.status(error.httpStatusCode).render('500', { 
        pageTitle: 'Error Occurred!', 
        path: '500'
    })
})
mongoose.connect(MONGODB_URI)
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