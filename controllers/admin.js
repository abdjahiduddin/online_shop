const Products = require('../models/product')

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
    const userId = req.user._id

    const product = new Products(title, price, description, imageUrl, userId)
    product.save()
        .then(result => {
            res.redirect('/products')
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
    Products.findAllProducts()
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: 'admin-products'
        })
    })
    .catch(err => console.log(err))
}

exports.getEditProducts = (req, res) => {
    const editMode = req.query.edit
    const id = req.params.productId

    Products.findById(id)
    .then(product => {
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: 'admin-edit-product',
            edit: editMode,
            product: product
        })
    })
    .catch(err => console.log(err))
}

exports.postEditProducts = (req, res) => {
    const id = req.body.productId
    const updateData = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description
    }
    
    Products.updateById(id, updateData)
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId

    Products.deleteById(id)
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))        
}