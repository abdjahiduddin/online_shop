const getDb = require('../utils/database-connection').getDb
const mongodb = require('mongodb')

const ObjectId = mongodb.ObjectId

class Products {
    constructor(title, price, description, imageUrl, userId) {
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
        this.userId = userId
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
    }

    static findAllProducts() {
        const db = getDb()
        return db.collection('products').find({}).toArray()
    }

    static findById(id) {
        const objId = ObjectId(id)
        const db = getDb()
        return db.collection('products').findOne({ _id: objId })
        // Another way to get data by id
        // return db.collection('products').find({ _id: objId }).next()
    }

    static updateById(id, data) {
        const objId = ObjectId(id)
        const db = getDb()

        const updateData = {
            $set: data
        }

        return db.collection('products').updateOne({ _id: objId }, updateData)
    }

    static deleteById(id) {
        const objId = new ObjectId(id)
        const db = getDb()

        return db.collection('products').deleteOne({ _id: objId })
    }

}

module.exports = Products