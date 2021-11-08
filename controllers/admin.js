const { validationResult } = require('express-validator')

const Products = require('../models/product')
const Users = require('../models/users')

exports.getAddProducts = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: 'admin-add-product',
        edit: false,
        hasError: false,
        errorMessage: null,
        allErrors: []
    })
}

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: 'admin-add-product',
            edit: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            allErrors: errors.array()
        })
    }

    const product = new Products({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.session.user._id
    })
    product.save()
        .then(result => {
            res.redirect('/products')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProducts = (req, res, next) => {
    const userId = req.session.user._id
    Products.find({ userId: userId })
        // .select('title price imageUrl -_id') // Select untuk mengambil beberapa field saja (title price imageUrl). Tanda minus (-) brarti tidak mengambil field dalam hal ini tidak mengambil field _id
        // .populate('userId', 'name') // Populate berguna untuk referensi, mengambil data dari collection yang telah didefinisikan dischema. Paramater pertama (userId) merupakan id user dari collection user artinya mengambil data dari collection user dengan id tersebut, kemudian paramter kedua (name) hanya mengambil field nama saja, hampir sama dengan perintah Select
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: 'admin-products',
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit
    const id = req.params.productId

    Products.findById(id)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: 'admin-edit-product',
                edit: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                allErrors: []
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postEditProducts = (req, res, next) => {
    const id = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: 'admin-add-product',
            edit: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description,
                _id: id
            },
            allErrors: errors.array()
        })
    }

    Products.findById(id)
        .then(product => {
            if (product.userId.toString() !== req.session.user._id.toString() ) {
                return res.redirect('/')
            }
            product.userId = req.session.user._id
            product.title = title
            product.imageUrl = imageUrl
            product.price = price
            product.description = description
            return product.save()
            .then(result => {
                res.redirect('/admin/products')
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    const id = req.session.user._id

    Products.deleteOne({ _id: productId, userId: id })
        .then(result => {
            return Users.findById(id)
        })
        .then(user => {
            return user.removeItemFromCart(productId)
        })
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}