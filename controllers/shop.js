const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId
    const invoiceName = 'invoice' + '-' + orderId + '.pdf'
    const invoicePath = path.join('data', 'invoices', invoiceName)

    Orders.findById(orderId)
        .then(order => {
            if (!order) {
                const error = new Error('No order found')
                error.httpStatusCode = 500
                return next(error)
            }

            if (order.user.userId.toString() !== req.session.user._id.toString()) {
                const error = new Error('Unauthorized')
                error.httpStatusCode = 500
                return next(error)
            }
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')

            const createPdf = new PDFDocument({ font: 'Courier' })
            createPdf.pipe(fs.createWriteStream(invoicePath))
            createPdf.pipe(res)

            createPdf.font('Courier', 30).text('Invoice', 70);
            createPdf.font('Courier', 14).text('#' + orderId, 70)
            createPdf.font('Courier', 14).text(order.user.email, 70)
            createPdf.font('Courier', 20).text('---------------------------------------', 70)
            
            let y = 180
            let total = 0

            createPdf.font('Courier', 14).text('Items', 70, y)
            createPdf.font('Courier', 14).text('Qty', 360, y)
            createPdf.font('Courier', 14).text('Price', 410, y)
            createPdf.font('Courier', 14).text('Amount', 480, y)
            y = y + 5
            createPdf.font('Courier', 20).text('_______________________________________', 70, y)
            y = y + 35
            
            order.products.forEach(items => {
                const amount = items.qty * items.product.price
                total = total + amount
                createPdf.font('Courier', 14).text(items.product.title, 70, y)
                createPdf.font('Courier', 14).text(items.qty, 360, y)
                createPdf.font('Courier', 14).text('$' + items.product.price, 410, y)
                createPdf.font('Courier', 14).text(amount, 480, y)
                
                y = y + 20
            })

            y = y - 20
            createPdf.font('Courier', 20).text('_______________________________________', 70, y + 10)
            createPdf.moveDown()
            createPdf.font('Courier', 18).text('TOTAL $' + total, 70, y + 40, { align: 'right' })

            createPdf.end()

            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         const error = new Error(err)
            //         error.httpStatusCode = 500
            //         return next(error)
            //     }
            //     res.setHeader('Content-Type', 'application/pdf')
            //     res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`)
            //     // res.setHeader('Content-Diposition', 'inline; filename="'+invoiceName+'"')
            //     res.send(data)
            // })
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
