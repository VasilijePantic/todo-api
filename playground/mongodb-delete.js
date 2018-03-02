const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server.')
    }
    console.log('Connected to MongoDB server.');
    const db = client.db('TodoApp');

    //DELETING DOCS

    // // deleteMany()
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });


    // // deleteOne()
    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });


    // //findOneAndDelete()
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });


        // PRACTICE

    // //delete many

    // db.collection('Users').deleteMany({name: 'Vasilije'}).then((result) => {
    //     console.log(result);
    // });



    // //delete one
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5a9972f1a314a82071bb51e9')}).then((result)=> {
        console.log(JSON.stringify(result, undefined, 2));
    });


    // client.close();
});