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
const multer =  require('multer')
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

// CSRF Instantiation
const csrfProtection = csrf()

// Multer File Storage Configuration
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'_'+Date.now()+'_'+file.originalname)
    }
})
// Multer File Filter Configuration
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// EJS Template Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Body Parser Configurtion
app.use(bodyParser.urlencoded({extended: false}))
// Multer Configuration
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
// Exposes Static Folder (Public)
app.use(express.static(path.join(__dirname, 'public')))
// Exposes Static Folder (Images)
app.use(express.static(path.join(__dirname, 'images')))
// app.use(express.static('images',path.join(__dirname, 'images')))
// Session Configuration
app.use(
    session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store})
)
// CSRF Condiguration
app.use(csrfProtection)
// Flash Configuration
app.use(flash())

// Middleware for define login state and csrf token 
app.use((req, res, next) => {
    console.log(req.path, '-', req.method)
    res.locals.isAuthenticated = req.session.isLogin
    res.locals.csrfToken = req.csrfToken()
    next()
})

// Routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

// Error Handling
app.get('/500', errorController.get500)
app.use(errorController.get404)
app.use((error, req, res, next) => {
    // res.redirect('/500')
    console.log(error)
    res.status(error.httpStatusCode).render('500', { 
        pageTitle: 'Error Occurred!', 
        path: '500'
    })
})

mongoose.connect(MONGODB_URI)
.then( connect => {
        console.log("Start Apps....")
        console.log('Connected to MongoDB!')
        app.listen(process.env.PORT || 3000)
    })
    .catch( err => console.log(err))