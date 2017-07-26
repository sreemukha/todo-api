const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect');
  }
  console.log('Connected to MongoDB server');

  //*** findOneAndUpdate(filter, update, options)

  // db.collection('Todos').findOneAndUpdate({ // filter
  //   _id: new ObjectID('59790781fabc59f4e0b7f955')
  // }, { //update
  //   $set: {
  //     text : 'Something to do v1',
  //     completed: true
  //   }
  // }, { // options
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndUpdate({ // filter
    _id: new ObjectID('5978f9e238f08e4da98fdbb1')
  }, { //update
    $set: {
      name : 'Siva'
    },
    $inc: {
      age: 4
    }
  }, { // options
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })

})
