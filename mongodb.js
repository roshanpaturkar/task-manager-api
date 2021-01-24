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

    // db.collection('users').insertOne({
    //     name: 'Roshan Paturkar',
    //     age: 25
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert document!');
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Lutika',
    //         ager: 23
    //     }, {
    //         name: 'Ashish',
    //         age: 25
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents!');
    //     }
    //     console.log(result.ops);
    // })

    db.collection('tasks').insertMany([
        {
            description: 'Go to sleep',
            completed: true
        }, {
            description: 'Go to tatti',
            completed: false
        }, {
            description: 'Kiss me',
            completed: true
        }
    ], (error, result) => {
        if (error) {
             return console.log('Unable to insert documents!');
        }
        console.log(result.ops);
    })
})