const {User} = require('../models/user');

// middleware to make routes private

let authenticate = (req,res,next) => {
  let token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if(!user) {
      // res.status(401).send(); // this looks same as reject case of the promise
      return Promise.reject(); // therefore directly fire the reject() case
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    // 401 - authentication required
    res.status(401).send();
  });
};


module.exports = {
  authenticate
}
