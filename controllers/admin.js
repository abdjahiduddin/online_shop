const Products = require('../models/product')
const Users = require('../models/users')

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
        .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
    const userId = req.session.user._id
    Products.find({ userId: userId })
        // .select('title price imageUrl -_id') // Select untuk mengambil beberapa field saja (title price imageUrl). Tanda minus (-) brarti tidak mengambil field dalam hal ini tidak mengambil field _id
        // .populate('userId', 'name') // Populate berguna untuk referensi, mengambil data dari collection yang telah didefinisikan dischema. Paramater pertama (userId) merupakan id user dari collection user artinya mengambil data dari collection user dengan id tersebut, kemudian paramter kedua (name) hanya mengambil field nama saja, hampir sama dengan perintah Select
        .then(products => {
            console.log(products)
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
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    Products.findById(id)
        .then(product => {
            product.userId = req.session.user._id
            product.title = title
            product.imageUrl = imageUrl
            product.price = price
            product.description = description
            return product.save()
        })
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))

}

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId
    const id = req.session.user._id

    Products.findByIdAndRemove(productId)
        .then(result => {
            return Users.findById(id)
        })
        .then(user => {
            return user.removeItemFromCart(productId)
        })
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}