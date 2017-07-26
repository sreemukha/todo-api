const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
  if(err) {
    return console.log('Unable to connect');
  }
  console.log('Connected to MongoDB server');

  //**** deleteMany, deleteOne, findOneAndDelete

  //deleteMany

  // db.collection('Todos').deleteMany({text:'3rd todo'}).then((result) =>{
  //   console.log('Deleted successfully');
  //   console.log(result);
  // }, (err) => {
  //   console.log('Unable to delete',err);
  // })

// deleteOne

// db.collection('Todos').deleteOne({text:'3rd todo'}).then((result) =>{
//   console.log('Deleted successfully');
//   console.log(result);
// }, (err) => {
//   console.log('Unable to delete',err);
// })


// findOneAndDelete

db.collection('Todos').findOneAndDelete({completed: false}).then((result) =>{
  console.log('Deleted successfully');
  console.log(result);
}, (err) => {
  console.log('Unable to delete',err);
})


})
