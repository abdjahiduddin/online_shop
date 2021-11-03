const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars')

const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

// EJS Template Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Handlebars Template Engine
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}))
// app.set('view engine', 'hbs')
// app.set('views', 'views')

// Pug Template Engine
// app.set('view engine', 'pug')
// app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes)
app.use(shopRoutes)

app.use((req, res) => {
    res.render('404', { pageTitle: '404 Page not found', path: '404' })
    
})

app.listen(3000)