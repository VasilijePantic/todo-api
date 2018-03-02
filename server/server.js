const express = require('express');
const bodyParser = require('body-parser');

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

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});





app.listen(port, () => {
    console.log(`Server activated on port: ${port}.`);
});