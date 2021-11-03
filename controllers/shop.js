const Products = require('../models/product')

exports.getIndex = (req, res) => {
    Products.find()
        .then( products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: 'shop'
            })
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
    Products.find()
        .then( products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Your Products',
                path: 'user-products'
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
                path: 'user-products'
            })
        })
        .catch(err => console.log(err))
    
}

exports.getCart = (req, res) => {
    req.user.getCart()
    .then( products => {
        return res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: 'cart',
            products: products
        })
    })
    .catch(err => console.log(err))
}


exports.postCart = (req, res) => {
    const productId = req.body.productId
    const user = req.user

    user.addProduct(productId)
    .then( result => {
        res.redirect('/cart')
    }).catch( err => console.log(err));
}

exports.postCartDeleteItem = (req, res) => {
    const id = req.body.productId
    
    req.user
    .deleteItem(id)
    .then( results => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))

}

exports.getOrders = (req, res) => {
    req.user.getOrders()
    .then( orders => {
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: 'orders',
            orders: orders
        })
    })
    .catch( err => console.log(err))
}

exports.postOrders = (req, res) => {
    req.user.createOrder()
    .then( result => {
        res.redirect('/orders')
    })
    .catch( err => console.log(err) )
}

// exports.getCheckout = (req, res) => {
//     res.render('shop/checkout', {
//         pageTitle: 'Checkout',
//         path: 'checkout'
//     })
// }
