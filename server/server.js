require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');


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
app.post('/todos', authenticate, async (req,res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  // same functionality as below with async/await. Same applies for all the other routes. Refer this one for the difference.
  try {
    const doc = await todo.save();
    res.send(doc);
  } catch(e){
    res.status(400).send(e);
  }

  // without async/await
  // todo.save().then((doc) =>{
  //   //sending response back to user
  //   res.send(doc);
  // }, (err) =>{
  //   //sending bad request response back to user
  //   res.status(400).send(err);
  // });
});

// Configuring GET /todos route
app.get('/todos', authenticate, async (req,res) =>{
  // with async/await

  try {
    const todos = await Todo.find({
       _creator: req.user._id
    });
    res.send({todos});
  }catch(e){
    res.status(400).send(e);
  }

  // withou async/await
  // Todo.find({
  //   _creator: req.user._id
  // }).then((todos)=>{
  //   res.send({todos});
  // },(err)=>{
  //   res.status(400).send(err);
  // });
});


// Configuring GET /todos/123
app.get('/todos/:id', authenticate, async (req,res) => {
  //req.params.id gives the /todos/:id given by the user

  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  // with async/await
  try{
    const todo = await Todo.findOne({
      _id: id,
      _creator: req.user._id
    });
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }catch(e){
    res.status(400).send();
  }

  // without async/await
  // Todo.findOne({
  //   _id: id,
  //   _creator: req.user._id
  // }).then((todo) => {
  //   if(!todo){
  //     return res.status(404).send();
  //   }
  //   res.send({todo});
  //
  // }).catch((err) => {
  //   res.status(400).send();
  // });

});


// Configuring DELETE /todos/123
app.delete('/todos/:id', authenticate, async (req,res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  try{
    const todo = await Todo.findOneAndRemove({
      _id:id,
      _creator:req.user._id
    });
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }catch(e){
    res.status(400).send();
  }
});


// Configuring PATCH /todos/123
app.patch('/todos/:id', authenticate, async (req,res) => {
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
  try{
    const todo = await Todo.findOneAndUpdate({_id:id, _creator: req.user._id}, {$set: body},{new: true});
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }catch(err){
    res.status(400).send();
  }
});


// Configuring POST /users

app.post('/users', async (req,res) => {

  try{
    const body = _.pick(req.body, ['email','password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken(); // instance method
    res.header('x-auth',token).send(user); // no need to call user.toJSON instance method explicitly
  }catch(err){
    res.status(400).send(err);
  }
});



// Configuring private route to identify the user

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);

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
});

// Configuring POST /users/login {email, password} route

app.post('/users/login', async (req,res) => {
  try{
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email,body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }catch(e){
    res.status(400).send();
  }
});

// Configuring private DELETE /users/me/token

app.delete('/users/me/token', authenticate, async (req,res) => {
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
});

app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
});


module.exports = {app};
