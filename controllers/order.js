const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price") //here we will load one  product
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order found in db",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  //here req.profile will come from param and this info will be set to order.user
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  //here we r saving the order in db
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "failed to save order in db",
      });
    }
    res.json(order);
  });
};
//get all orders
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "no orders found in DB",
        });
      }
      res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "cannot update order status ",
        });
      }
      res.json(order);
    }
  );
};
