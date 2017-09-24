require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


// local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

//create express app
let app = express();
const port = process.env.PORT;



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


// Configuring DELETE /todos/123
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
  });
});


// Configuring PATCH /todos/123
app.patch('/todos/:id', (req,res) => {
  const id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body},{new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => res.status(400).send());
})


// Configuring POST /users

app.post('/users', (req,res) => {
  const body = _.pick(req.body, ['email','password']);
  const user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken(); // instance method
  }).then((token) => {
    res.header('x-auth',token).send(user); // no need to call user.toJSON instance method explicitly
  }).catch((err) => {
    res.status(400).send(err);
  });
});



// Configuring private route to identify the user

app.get('/users/me', authenticate, (req,res) => {
  // let token = req.header('x-auth');
  // User.findByToken(token).then((user) => {
  //   if(!user) {
  //     // res.status(401).send(); // this looks same as reject case of the promise
  //     return Promise.reject(); // therefore directly fire the reject() case
  //   }
  //
  //   res.send(user);
  // }).catch((e) => {
  //   // 401 - authentication required
  //   res.status(401).send();
  // });
  res.send(req.user);
});

app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
});


module.exports = {app};
