const fs = require('fs')
const path = require('path')

const Cart = require('./cart')

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json')

const getDataFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err || fileContent.length == 0) {
            return cb([])
        }
        cb(JSON.parse(fileContent))
    })
}

module.exports = class {
    constructor(id, title, imageUrl, price, description) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.price = price
        this.description = description
    }

    save() {
        getDataFromFile( products => {
            if (this.id) {
                const getProductIndex = products.findIndex(item => item.id === this.id)
                products[getProductIndex] = this

            } else {
                this.id = Math.floor(1000000 +Math.random() * 1000000).toString()
                products.push(this)
            }
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err) {
                    console.log(err)
                }
            })
        })
    }

    static fetchAll(cb) {
        getDataFromFile(cb)
    }

    static findById(id, cb) {
        getDataFromFile(products => {
            const product = products.find(item => item.id === id)
            cb(product)
        })
    }

    static deleteById(id) {
        getDataFromFile(products => {
            const product = products.find(item => item.id === id)
            const updatedProducts = products.filter(item => item.id !== id)
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProductById(id, product.price)
                }
            })
        })
    }
}