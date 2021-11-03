const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: 'shop'
        })
    })
}

exports.getProductDetails = (req, res) => {
    const prodId = req.params.id
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: 'user-products'
        })
    })
}

exports.getCart = (req, res) => {
    Cart.getCart(cart => {
        if (!cart) {
            return res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                products: {
                    items: [],
                    totalPrice: 0
                }
            })
        }
        Product.fetchAll(products => {
            const cartProduct = {
                items: [],
                totalPrice: 0
            }
            let tmpPrice = 0
            for (const product of products) {
                const cartData = cart.products.find(prod => prod.id === product.id)
                if (cartData) {
                    product.qty = cartData.qty
                    cartProduct.items.push(product)
                    tmpPrice = tmpPrice + (product.qty * product.price)
                }
            }
            cartProduct.totalPrice = tmpPrice
            return res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                products: cartProduct
            })
        })
    })
}

exports.postCartDeleteItem = (req, res) => {
    const id = req.body.productId
    const price = req.body.price
    Cart.deleteProductById(id, price)
    res.redirect('/cart')
}

exports.postCart = (req, res) => {
    const id = req.body.productId
    Product.findById(id, product => {
        Cart.addProduct(id, product.price)
    })
    res.redirect('/cart')
}

exports.getOrders = (req, res) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: 'orders'
    })
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout'
    })
}

exports.getShop = (req, res) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Your Products',
            path: 'user-products'
        })
    })
}