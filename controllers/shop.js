const Products = require('../models/product')
const Orders = require('../models/order')
const Users = require('../models/users')

exports.getIndex = (req, res) => {
    Products.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: 'shop',
                isAuthenticated: req.session.isLogin
            })
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
    Products.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Your Products',
                path: 'user-products',
                isAuthenticated: req.session.isLogin
            })
        })
        .catch(err => console.log(err))
}

exports.getProductDetails = (req, res) => {
    const prodId = req.params.id
    Products.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: 'user-products',
                isAuthenticated: req.session.isLogin
            })
        })
        .catch(err => console.log(err))

}

exports.getCart = (req, res) => {
    if (req.session.isLogin !== undefined) {
        const id = req.session.user._id
        Users.findById(id).populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            return res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                products: products,
                isAuthenticated: req.session.isLogin
            })
        })
        .catch(err => console.log(err))   
    } else {
        res.redirect('/login')
    }
}


exports.postCart = (req, res) => {
    const productId = req.body.productId

    if (req.session.isLogin !== undefined) {
        const id = req.session.user._id
    
        Users.findById(id)
            .then(user => {
                return user.addToCart(productId)
            })
            .then(result => {
                res.redirect('/cart')
            })
            .catch(err => console.log(err));
    } else {
        res.redirect('/login')
    }
}

exports.postCartDeleteItem = (req, res) => {
    const productId = req.body.productId
    const id = req.session.user._id
    
    Users.findById(id)
        .then(user => {
            return user.removeItemFromCart(productId)
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))

}

exports.getOrders = (req, res) => {
    if (req.session.isLogin !== undefined) {
        Orders.find({ 'user.userId': req.session.user._id })
            .then(orders => {
                res.render('shop/orders', {
                    pageTitle: 'Your Orders',
                    path: 'orders',
                    orders: orders,
                    isAuthenticated: req.session.isLogin
                })
            })
            .catch(err => console.log(err))
    } else {
        res.redirect('/login')
    }

}

exports.postOrders = (req, res) => {
    const id = req.session.user._id
    let userObj

    Users.findById(id).populate('cart.items.productId')
        .then(user => {
            userObj = user
            const userData = {
                name: req.session.user.name,
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
            return  userObj.clearCart()
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err))
}

// exports.getCheckout = (req, res) => {
//     res.render('shop/checkout', {
//         pageTitle: 'Checkout',
//         path: 'checkout'
//     })
// }
