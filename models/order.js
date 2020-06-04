const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

//we can define multiple schemas in one file also ...
//this is another way to include schemas by defining them in the same file

const ProductCartSchema = new mongoose.Schema({
  //this is done so that we can access the property of 'POPULATE()'
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const Orderschema = new mongoose.Schema(
  {
    products: [ProductCartSchema], //in ProductCartSchema we have product in it from user.js
    transaction_id: {},
    amount: {
      type: Number,
    },
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      //here we r referencing User schema in user.js
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", Orderschema);

module.exports = { Order, ProductCart };
