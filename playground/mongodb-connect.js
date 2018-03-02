// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name: 'Andrew', age: 25};
// var {name} = user;  // = DESTRUCTURING
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.');
    const db = client.db('TodoApp');
    
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    // insert new doc into Users(name, age, location) collection
    // db.collection('Users').insertOne({
    //     name: 'Vasilije',
    //     age: 23,
    //     location: 'Belgrade'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert user.', err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });
    
    client.close();
});