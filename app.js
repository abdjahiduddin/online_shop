// Built-in Library
const path = require('path')

// Third-Party Library
const express = require('express')
const bodyParser = require('body-parser')

// Import Controller
const errorController = require('./controllers/error')

// Import Database Connection
const sequelize = require('./utils/database-connection')

// Import Database Models
const Products = require('./models/product')
const Users = require('./models/users')
const Carts = require('./models/cart')
const CartItems = require('./models/cart-items')
const Orders = require('./models/order')
const OrderItems = require('./models/order-items')

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
    Users.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

// Table Associations
Products.belongsTo(Users, { constraints: true, onDelete: 'CASCADE' })
Users.hasMany(Products)

Carts.belongsTo(Users)
Users.hasOne(Carts)

Products.belongsToMany(Carts, { through: CartItems })
Carts.belongsToMany(Products, { through: CartItems })

Orders.belongsTo(Users)
Users.hasMany(Orders)

Products.belongsToMany(Orders, { through: OrderItems })
Orders.belongsToMany(Products, { through: OrderItems })

sequelize.sync()
    // .sync({ force: true }) // drop and create new tables
    .then(result => {
        return Users.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return Users.create({ name: 'jay', email: 'test@email.com' })
        }
        // Secara default user hasil query sequelize (user) merupakan promise,
        // Sehingga tidak perlu mengubah user menjadi promis (Promise.resolve(user)).
        // Jika ingin melakukan return promise kemudian menggunakan then dan catch,
        // Pastikan selalu mengubah menjadi promise yaitu Promise.resolve(data)
        return user
    })
    .then(user => {
        return user.createCart()
    })
    .then(cart => {
        app.listen(3000)
    })
    .catch(err => console.log(err))
