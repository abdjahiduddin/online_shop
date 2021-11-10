const { validationResult } = require('express-validator')
const path = require('path')

const Products = require('../models/product')
const Users = require('../models/users')

const fileHelper = require('../utils/file-helper')

const ITEMS_PER_PAGE = 10

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
    const imageUrl = req.file
    const price = req.body.price
    const description = req.body.description

    const errors = validationResult(req)
    if (!imageUrl) {
        errorMessage = 'Attached file is not an image (jpeg/jpg/png).'
        allErrors = []
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: 'admin-add-product',
            edit: false,
            hasError: true,
            errorMessage: errorMessage,
            product: {
                title: title,
                price: price,
                description: description
            },
            allErrors: allErrors
        })
    }

    if (!errors.isEmpty()) {
        let errorMessage = errors.array()[0].msg
        let allErrors = errors.array()
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: 'admin-add-product',
            edit: false,
            hasError: true,
            errorMessage: errorMessage,
            product: {
                title: title,
                price: price,
                description: description
            },
            allErrors: allErrors
        })
    }

    const product = new Products({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl.filename,
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
    
    let page = +req.query.page || 1
    let totalItems

    Products.find({ userId: userId }).countDocuments()
        .then(numProducts => {
            totalItems = numProducts
            return Products.find({ userId: userId }).skip((page - 1 ) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
                        // .select('title price imageUrl -_id') // Select untuk mengambil beberapa field saja (title price imageUrl). Tanda minus (-) brarti tidak mengambil field dalam hal ini tidak mengambil field _id
                        // .populate('userId', 'name') // Populate berguna untuk referensi, mengambil data dari collection yang telah didefinisikan dischema. Paramater pertama (userId) merupakan id user dari collection user artinya mengambil data dari collection user dengan id tersebut, kemudian paramter kedua (name) hanya mengambil field nama saja, hampir sama dengan perintah Select
        })
        .then(products => {
            const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: 'admin-products',
                // link: '/admin/products',
                currentPage: page,
                lastPage: maxPage,
                hasNext: page < maxPage,
                hasPrevious: page > 1,
                nextPage: page + 1,
                previousPage: page - 1 
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
    const imageUrl = req.file
    const price = req.body.price
    const description = req.body.description

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let errorMessage = errors.array()[0].msg
        let allErrors = errors.array()
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: 'admin-add-product',
            edit: true,
            hasError: true,
            errorMessage: errorMessage,
            product: {
                title: title,
                price: price,
                description: description,
                _id: id
            },
            allErrors: allErrors
        })
    }

    Products.findById(id)
        .then(product => {
            if (product.userId.toString() !== req.session.user._id.toString() ) {
                return res.redirect('/')
            }
            if (imageUrl) {
                const filePath = path.join('images', product.imageUrl)
                fileHelper.deleteFile(filePath)
                product.imageUrl = imageUrl.filename
            }
            product.userId = req.session.user._id
            product.title = title
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

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId
    const id = req.session.user._id

    Products.findById(productId)
        .then(product => {
            const filePath = path.join('images', product.imageUrl)
            fileHelper.deleteFile(filePath)

            return Products.deleteOne({ _id: productId, userId: id })
        })
        .then(result => {
            return Users.findById(id)
        })
        .then(user => {
            return user.removeItemFromCart(productId)
        })
        .then(result => {
            res.status(200).json({
                message: 'Success'
            })
        })
        .catch(err => {
            // const error = new Error(err)
            // error.httpStatusCode = 500
            res.status(500).json({
                message: 'Delete product failed'
            })
        })

    
        
}