const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// local imports
var {mongoose} = require('./db/mongoose.js');// requiring mongoose from ./db/
var {Todo} = require('./models/todo.js');// requiring Todo mongoose model
var {User} = require('./models/user.js');// requiring User mongoose model

var app = express();
var port = process.env.PORT || 3000;// for heroku

//===================
//       MIDDLEWARE
//===================
app.use(bodyParser.json());

//===================
//         ROUTES
//===================

    // /todos POST
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);// send error obj with status 400
    });
});

    // /todos GET
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos}); // insead of an array-we send an obj - more flexibility later on
    }, (e) => {
        res.status(400).send(e);
    });
});

//-----------------------------

// /todos/:id GET
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) { //validate id with isValid
        return res.status(404).send(); //if not,stop func,respond 404,send()
    }
    Todo.findById(id).then((todo) => {//if valid
        if(!todo) {// and there is no todo with that id
            return res.status(404).send();// respond with 404 status
        }
        res.send({todo});// if there is that todo, respond with todo document
    }).catch((e) => {// if error
        res.status(400).send();// respond with status 400 
    });
});


//------------------------------

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
    // get the id   
    var id = req.params.id;
    // validate the id
    if(!ObjectID.isValid(id)) {// if not valid, return 404 classic shieeet
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => { // if valid, try to find it
        if(!doc) { // if no doc with that id, return 404
            return res.status(404).send();
        }
        res.status(200).send({todo})// if found, send the doc
    }).catch((e) => {// if error
        res.status(400).send();// send status 400
    });
});





app.listen(port, () => {
    console.log(`Server activated on port: ${port}.`);
});

module.exports = {app};