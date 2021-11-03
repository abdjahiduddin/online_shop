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

    console.log(req.user)

    req.user.createProduct({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl
    })
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))

    // Old ways before association added
    // Products.create({
    //     title: title,
    //     price: price,
    //     description: description,
    //     imageUrl: imageUrl
    // })
    // .then(result => {
    //     res.redirect('/admin/products')
    // })
    // .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
    req.user.getProducts()
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: 'admin-products'
        })
    })
    .catch(err => console.log(err))
    // Old ways before association added
    // Products.findAll()
    // .then(products => {
    //     res.render('admin/products', {
    //         prods: products,
    //         pageTitle: 'Admin Products',
    //         path: 'admin-products'
    //     })
    // })
    // .catch(err => console.log(err))
}

exports.getEditProducts = (req, res) => {
    const editMode = req.query.edit
    const id = req.params.productId

    req.user.getProducts({ where: { id: id } })
    .then(products => {
        const product = products[0]
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: 'admin-edit-product',
            edit: editMode,
            product: product
        })
    })
    .catch(err => console.log(err))

    // Old ways before association added
    // Products.findByPk(id)
    // .then(product => {
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Add Product',
    //         path: 'admin-edit-product',
    //         edit: editMode,
    //         product: product
    //     })
    // })
    // .catch(err => console.log(err))
}

exports.postEditProducts = (req, res) => {
    const id = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    Products.findByPk(id)
        .then(product => {
            product.title = title
            product.price = price
            product.imageUrl = imageUrl
            product.description = description
            return product.save()
        })
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))

    // Another way to update a product
    // Products.update({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description
    // }, {
    //     where: { id: id }
    // }).then(result => {
    //     console.log(result)
    //     res.redirect('/admin/products')
    // }).catch(err => console.log(err))
    
}

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId

    Products.findByPk(id)
        .then(product => {
            return product.destroy()
        })
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
        
    // Another way to delete product
    // Products.destroy({ where: { id: id } })
    //     .then(result => {
    //         res.redirect('/admin/products')
    //     })
    //     .catch(err => console.log(err))
}