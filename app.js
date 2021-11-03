const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//     console.log("In The Middleware")
//     next()
// })

// app.use((req, res, next) => {
//     console.log("In the Another Middleware")
//     res.send('<h1>Hello from Express.js</h1>')
// })

app.use('/admin',adminRoutes)
app.use(shopRoutes)

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(3000)