const User = require("../models/user");
const Order = require("../models/order");

//here we r wworking with the 'params' as id
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    //here we r creating an object in the req
    //here we r populating the value of req.profile
    req.profile = user;
    next();
  });
};

//simple method to grab the user
exports.getUser = (req, res) => {
  //TODO:Get back here for the password
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  //req.profile.createdAt = undefined;
  //req.profile.updatedAt = undefined;
  return res.json(req.profile);
};
//simple method to get all users in database
exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "NO USERS HAVE BEEN FOUND",
      });
    }
    return res.json(users);
  });
};

//update the user details
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name ")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order in this account",
        });
      }
      return res.json(order);
    });
};
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = []; //here we r creating an array
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  /*    |  |
        |  |
        |  |
        |__|
        \  /
         \/ 
  */

  //till now we have created an array purchases
  //now we will push or store it into our mongodb
  //here we will be using the 'User' because everthing is stored in the user modle
  //we will use 'findOneAndUpdate' method coz at one pt. of tym the purchases..
  //...array will be empty nd we have to update that array after purchasing
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save the purchase list",
        });
      }
      next();
    }
  );
};
