const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.');
    const db = client.db('TodoApp');

    // UPDATING DOCS

    // db.collection('Todos').findOneAndUpdate({//3 args
    //     _id: new ObjectID('5a997d24828a6634866eb877')// 1st arg - filter
    // }, {
    //     $set: {// update operator - obj - sets the value - mongodb docs
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });


    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a997fa6a314a82071bb51ea')
    }, {
        $set: {
            name: 'Vasilije'
        },
        $inc: {
            age: 2
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    // client.close();
});