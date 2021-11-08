const Products = require('../models/product')
const Orders = require('../models/order')
const Users = require('../models/users')

exports.getIndex = (req, res, next) => {
    Products.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: 'shop'
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProducts = (req, res, next) => {
    Products.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Your Products',
                path: 'user-products'
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.id
    Products.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: 'user-products',
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

}

exports.getCart = (req, res, next) => {
    const id = req.session.user._id
    Users.findById(id).populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            return res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                products: products
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}


exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    const id = req.session.user._id

    Users.findById(id)
        .then(user => {
            return user.addToCart(productId)
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId
    const id = req.session.user._id

    Users.findById(id)
        .then(user => {
            return user.removeItemFromCart(productId)
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

}

exports.getOrders = (req, res, next) => {
    Orders.find({ 'user.userId': req.session.user._id })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: 'orders',
                orders: orders
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postOrders = (req, res, next) => {
    const id = req.session.user._id
    let userObj

    Users.findById(id).populate('cart.items.productId')
        .then(user => {
            userObj = user
            const userData = {
                email: req.session.user.email,
                userId: req.session.user
            }
            const products = user.cart.items.map(item => {
                return {
                    qty: item.qty,
                    product: {
                        _id: item.productId._id,
                        title: item.productId.title,
                        price: item.productId.price,
                        imageUrl: item.productId.imageUrl,
                        description: item.productId.description
                    }
                }
            })
            const order = new Orders({
                user: userData,
                products: products
            })
            return order.save()
        })
        .then(result => {
            return userObj.clearCart()
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

// exports.getCheckout = (req, res) => {
//     res.render('shop/checkout', {
//         pageTitle: 'Checkout',
//         path: 'checkout'
//     })
// }
