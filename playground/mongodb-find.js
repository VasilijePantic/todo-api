const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.');
    const db = client.db('TodoApp');

    
    // // find files from DB
    // db.collection('Todos').find({_id: new ObjectID('5a995fbea314a82071bb51e2')}).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // });

    // finding all users with name: 'Vasilije'
    db.collection('Users').find({name: 'Vasilije'}).toArray().then((users) => {
        console.log(JSON.stringify(users, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch useres', err);
    })

    // client.close();
});