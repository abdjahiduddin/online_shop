const Products = require('../models/product')
const Orders = require('../models/order')

exports.getIndex = (req, res) => {
    Products.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: 'shop'
            })
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
    Products.findAll()
        .then(products => {
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
    Products.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: 'user-products'
            })
        })
        .catch(err => console.log(err))

    // Another method to get one product by id
    // Products.findAll({ where: { id: prodId } })
    //     .then(products => {
    //         const product = products[0]
    //         res.render('shop/product-detail', {
    //             product: product,
    //             pageTitle: product.title,
    //             path: 'user-products'
    //         })
    //     })
    //     .catch(err => console.log(err))
    
}

exports.getCart = (req, res) => {
    req.user
    .getCart()
    .then(cart => {
        return cart.getProducts()
    })
    .then( products => {
        return res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: 'cart',
            products: products
        })
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteItem = (req, res) => {
    const id = req.body.productId
    const price = req.body.price
    req.user
    .getCart()
    .then( cart => {
        return cart.getProducts({ where: { id: id } })
    })
    .then( products => {
        const product = products[0]
        product.cartItems.destroy()
        res.redirect('/cart')
    })
    .catch(err => console.log(err))

}

exports.postCart = (req, res) => {
    const id = req.body.productId
    let fetchedCart
    let newQty = 1
    req.user
    .getCart()
    .then( cart => {
        fetchedCart = cart
        return cart.getProducts({ where: { id: id } })
    })
    .then( products => {
        let product
        
        if (products.length > 0) {
            product = products[0]
        }

        if (product) {
            const oldQty = product.cartItems.qty
            newQty = oldQty + 1
            return product
        }

        return Products.findByPk(id)

    })
    .then( product => {
        return fetchedCart.addProduct(product, { through: { qty: newQty } })
    })
    .then( result => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res) => {
    req.user.getOrders({ include: ['products'] })
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
    let fetchedCart
    req.user.getCart()
    .then( cart => {
        fetchedCart = cart
        return cart.getProducts()
    })
    .then( products => {
        return req.user.createOrder()
            .then( orders => {
                return orders.addProducts( products.map( product => {
                    product.orderItems = { qty: product.cartItems.qty }
                    return product
                }))
            })
            .catch( err => console.log(err))
    })
    .then( result => {
        return fetchedCart.setProducts(null)
    })
    .then( result => {
        res.redirect('/orders')
    })
    .catch( err => console.log(err) )
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout'
    })
}
