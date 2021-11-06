const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const dotenv = require('dotenv')

dotenv.config()

let _db

const mongoConnection = callback => {
    const uri = process.env.MONGODB_URI
    MongoClient.connect(uri)
        .then( connection => {
            console.log('Connected to MongoDB !!')
            _db = connection.db() 
            
            callback(_db)
        })
        .catch( err => console.log(err))
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!!!'
}

exports.mongoConnection = mongoConnection
exports.getDb = getDb