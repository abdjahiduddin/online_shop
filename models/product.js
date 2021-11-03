const db = require('../utils/database-connection')

const Cart = require('./cart')

module.exports = class {
    constructor(id, title, imageUrl, price, description) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.price = price
        this.description = description
    }

    save() {
        if (!this.id) {
            return db.execute(
                'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
                [this.title, this.price, this.description, this.imageUrl]
            )
        }
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products')
    }

    static findById(id) {
        return db.execute(
            'SELECT * FROM products WHERE id = ?',
            [id]
        )
    }

    static deleteById(id) {

    }
}