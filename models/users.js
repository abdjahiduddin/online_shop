const getDb = require('../utils/database-connection').getDb
const mongodb = require('mongodb')

const ObjectId = mongodb.ObjectId

class Users {
    constructor(username, email, id, cart) {
        this.user = username
        this.email = email
        this.cart = cart
        if (id) {
            this._id = id
        }
    }

    save() {
        const db = getDb()
        return db.collection('users').insertOne(this)
    }

    addProduct(productId) {
        const productObjId = new ObjectId(productId)
        const db = getDb()
        const qty = 1
        const cartItems = [...this.cart.items]

        const cartItemsIndex = cartItems.findIndex(item => {
            return item.productId.toString() === productId.toString()
        })

        if (cartItemsIndex >= 0) {
            cartItems[cartItemsIndex].qty = cartItems[cartItemsIndex].qty + 1
        } else {
            const newItem = {
                productId: productObjId,
                qty: qty
            }
            cartItems.push(newItem)
        }

        const condition = {
            _id: new ObjectId(this._id)
        }
        const updateCart = {
            $set: {
                cart: {
                    items: cartItems
                }
            }
        }
        return db.collection('users').updateOne(condition, updateCart)
    }

    getCart() {
        const db = getDb()
        const cartItems = [...this.cart.items]
        const productIds = cartItems.map(item => {
            return item.productId
        })

        return db.collection('products').find({ _id: { $in: productIds } }).toArray()
            .then(products => {
                const items = products.map(product => {
                    const qty = cartItems.find(item => {
                        return item.productId.toString() === product._id.toString()
                    }).qty
                    return {
                        ...product,
                        qty: qty
                    }
                })
                return items
            }).catch(err => console.log(err))
    }

    createOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.user
                    }
                }
                return db.collection('orders').insertOne(order);
            })
            .then(result => {
                this.cart = { items: [] };
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
            })
    }

    getOrders() {
        const db = getDb()
        const condition = {
            'user._id': new ObjectId(this._id)
        }
        return db.collection('orders').find(condition).toArray()
    }

    deleteItem(productId) {
        const db = getDb()
        const updateCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString()
        })

        const condition = {
            _id: new ObjectId(this._id)
        }
        const updateCart = {
            $set: {
                cart: {
                    items: updateCartItems
                }
            }
        }
        return db.collection('users').updateOne(condition, updateCart)
    }


    static findById(userId) {
        const db = getDb()
        const objId = new ObjectId(userId)
        return db.collection('users').findOne({ _id: objId })
    }
}

module.exports = Users