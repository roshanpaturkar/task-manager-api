//  CRUD Operation's in MongoDB using NodeJS
// Create Read Update Delete

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-api'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect database!')
    }

    const db = client.db(databaseName)

    db.collection('users').insertOne({
        name: 'Roshan Paturkar',
        age: 25
    })
})