//const MongoClient = require('mongodb').MongoClient;

//destructuring above statement as follows

const {  MongoClient,ObjectID } = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log(`Unable to connect to MongoDB server`);
  }
  console.log(`Connected to MongoDB server`);

//****.find() returns a mongodb cursor which is a pointer to documents. Cursor has many methods. .toArray() gives array of documents.
//**** toArray() returns a promise.

  //
  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });
  //
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({name:'Sree'}).toArray().then((docs) => {
    console.log('names');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  //db.close();
});
