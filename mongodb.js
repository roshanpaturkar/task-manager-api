//  CRUD Operation's in MongoDB using NodeJS
// Create Read Update Delete

const {MongoClient, ObjectID, Long} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-api'

// const id = new ObjectID

// console.log(id);
// console.log(id.id);
// console.log(id.id.length);
// console.log(id.toHexString().length);
// console.log(id.getTimestamp());

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

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Go to sleep',
    //         completed: true
    //     }, {
    //         description: 'Go to tatti',
    //         completed: false
    //     }, {
    //         description: 'Kiss me',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //          return console.log('Unable to insert documents!');
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('users').findOne({name: 'Roshan'}, (error, user) => {
    //     if (error) {
    //         return console.log('Unabale to fetch the value');
    //     }
    //     return console.log(user);
    // })

    // db.collection('users').findOne({_id: new ObjectID("600db8767503d70958d766f9")}, (error, user) => {
    //     if (error) {
    //         return console.log('Unabale to fetch the value');
    //     }
    //     return console.log(user);
    // })

    db.collection('users').find({age: 25}).toArray((error, users) => {
        if (error) {
            return console.log('Unabale to fetch the value');
        }
        return console.log(users);
    })
})