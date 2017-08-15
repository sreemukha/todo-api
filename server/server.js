let express = require('express');
let bodyParser = require('body-parser');


// local imports
let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

//create express app
let app = express();

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

app.listen(3000, ()=>{
  console.log(`Started on port 3000`);
});

module.exports = {app};
