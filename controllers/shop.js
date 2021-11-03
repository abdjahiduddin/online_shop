const Product = require('../models/product')

exports.getIndex = (req, res) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: 'shop'
        })
    })
}

exports.getCart = (req, res) => {
    console.log(req.path, '-', req.method)
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: 'cart'
    })
}

exports.getOrders = (req, res) => {
    console.log(req.path, '-', req.method)
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: 'orders'
    })
}

exports.getCheckout = (req, res) => {
    console.log(req.path, '-', req.method)
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout'
    })
}

exports.getShop = (req, res) => {
    console.log(req.path, '-', req.method)
    Product.fetchAll((products) => {
        res.render('shop/products-list', {
            prods: products,
            pageTitle: 'Your Products',
            path: 'user-products'
        })
    })
}