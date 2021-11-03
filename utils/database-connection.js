const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnection = callback => {
    const uri = 'mongodb+srv://node_user:toor@freecodecamp.yulo9.mongodb.net/node_db?retryWrites=true&w=majority'
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