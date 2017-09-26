const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const{todos, populateTodos,users,populateUsers} = require('./data/seed_data');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {

  // 1st test case
  it('should create a new todo', (done) => {
    let text = 'todo test text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  //2nd test case
  it('should not create todo with invalid body data',(done) =>{

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos',(done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });

});


describe('GET /todos/:id', () => {
  it('should get todo with given valid id',(done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // toHexString converts object to string
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo is not found', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

    it('should return 404 for non-object IDs', (done) => {
      request(app)
        .get(`/todos/123saddasd`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo' ,(done) => {
    const hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err));
      });
  })

  it('should return 404 if todo is not found', (done) => {
    const hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid IDs', (done) => {
    request(app)
      .delete(`/todos/123saddasd`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    const hexId = todos[0]._id.toHexString();
    const text = 'Update text of todo 1';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text,completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');

      }).end(done);
  });

  it('should update completedAt to null when todo is not completed', (done) => {
    const hexId = todos[1]._id.toHexString();
    const text = 'Update text of todo 2';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      }).end(done);
  });

  it('should return 404 if todo is not found', (done) => {
    const hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid IDs', (done) => {
    request(app)
      .delete(`/todos/123saddasd`)
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      }).end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'test@example.com';
    const pwd = '!test!';

    request(app)
      .post('/users')
      .send({email,password:pwd})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(pwd);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if reequest is invalid', (done) => {
    const email = 'invalid';
    const password = 'abc';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);

  });

  it('should not create user if email is already in use', (done) => {
    const password = 'valid!';
    request(app)
      .post('/users')
      .send({email:users[1].email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return x-auth token', (done) => {

    request(app)
      .post('/users/login')
      .send({email:users[1].email,password:users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid reject', (done) => {
    request(app)
      .post('/users/login')
      .send({email:users[1].email,password:'invalid!'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should log out the user by removing auth token', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .end((err) => {
        if(err){
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
