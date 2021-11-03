const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json')

module.exports = class {
    static addProduct(id, price) {
        fs.readFile(p, (err, content) => {
            let cart = {
                products: [],
                totalPrice: 0
            }
            if (!err && content.length > 0) {
                cart = JSON.parse(content)
            }
            const existingProductIndex = cart.products.findIndex(item => item.id === id)
            const existingProduct = cart.products[existingProductIndex]

            let updateProduct

            if (existingProduct) {
                updateProduct = { ...existingProduct }
                updateProduct.qty = updateProduct.qty + 1
                cart.products[existingProductIndex] = updateProduct
            } else {
                updateProduct = {
                    id: id,
                    qty: 1
                }
                cart.products.push(updateProduct)
            }
            cart.totalPrice = cart.totalPrice + +price

            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    console.log(err)
                }
            })
        })
    }

    static deleteProductById(id, price) {
        fs.readFile(p, (err, content) => {
            if (err) {
                return
            }
            const cart = JSON.parse(content)
            const product = cart.products.find(item => item.id === id)
            if (!product) {
                return
            }
            cart.products = cart.products.filter(item => item.id !== id)
            cart.totalPrice = Number((cart.totalPrice - (product.qty * price)).toFixed(2)) 
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    console.log(err)
                }
            })
        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, content) => {
            let cart = {
                products: [],
                totalPrice: 0
            }
            if (!err && content.length > 0) {
                cart = JSON.parse(content)
            }
            cb(cart)
        })
    }
}