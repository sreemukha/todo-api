const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const user1Id = new ObjectID;
const user2Id = new ObjectID;

const users = [{
  _id: user1Id,
  email: 'sree@example.com',
  password: 'user1pwd',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1Id, access:'auth'}, 'secret').toString()
  }]
},{
  _id: user2Id,
  email: 'abc@ex.com',
  password: 'user2pwd',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user2Id, access:'auth'}, 'secret').toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() =>{
    let user1 = new User(users[0]).save();
    let user2 = new User(users[1]).save();

    // wait for both above promises to succeed using Promise.all()

    return Promise.all([user1,user2]);
  }).then(() => done());
};


const todos = [{
  _id: new ObjectID,
  text: 'Test todo #1',
  _creator: user1Id
}, {
  _id: new ObjectID(),
  text: 'Test todo #2',
  completed: true,
  completedAt: 20170922,
  _creator: user2Id
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
  }).then(() => done());
};


module.exports = {todos, populateTodos,users, populateUsers};
