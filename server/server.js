const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

//create express app
let app = express();
const port = process.env.PORT || 3000



// Configuring middleware
app.use(bodyParser.json());

// Configuring POST /todos route
app.post('/todos',(req,res) => {
  let todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) =>{
    //sending response back to user
    res.send(doc);
  }, (err) =>{
    //sending bad request response back to user
    res.status(400).send(err);
  });
});

// Configuring GET /todos route
app.get('/todos', (req,res) =>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(err)=>{
    res.status(400).send(err);
  });
});


// Configuring GET /todos/123
app.get('/todos/:id', (req,res) => {
  //req.params.id gives the /todos/:id given by the user
  let id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});

  }).catch((err) => {
    res.status(400).send();
  });

});

app.delete('/todos/:id', (req,res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }, (err) => {
    res.status(400).send();
  })
})

app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
});


module.exports = {app};
