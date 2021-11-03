const Product = require('../models/product')

exports.getAddProducts = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: 'admin-add-product',
        edit: false
    })
}

exports.postAddProducts = (req, res) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    const product = new Product(null, title, imageUrl, price, description)
    product
        .save()
        .then(result => {
            console.log(result)
            res.redirect('/') 
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: 'admin-products'
        })
    })
}

exports.getEditProducts = (req, res) => {
    const editMode = req.query.edit
    const id = req.params.productId

    Product.findById(id, item => {
        item.price = +item.price
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: 'admin-edit-product',
            edit: editMode,
            product: item
        })
    })
}

exports.postEditProducts = (req, res) => {
    const id = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    const product = new Product(id, title, imageUrl, price, description)
    product.save()
    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId
    Product.deleteById(id)
    res.redirect('/admin/products')
}