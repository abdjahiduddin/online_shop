const Product = require('../models/product')

exports.getAddProducts = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: 'product'
    })
}

exports.postAddProducts = (req, res) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.getShop = (req, res) => {
    Product.fetchAll((products) => {
        console.log(products)
        res.render('shop/products-list', {
            prods: products,
            pageTitle: 'Shop',
            path: 'shop'
        })
    })
}