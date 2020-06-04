const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); //to access path of the file we need to use file system fs

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm(); //here we r declaring the form
  form.keepExtensions = true; //here we want to set the format of the file type ie-jpeg,png..

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //here fields are coming from product schema from product.js from model
    //DESTRUCTURE the FIELD
    const { name, description, price, category, stock } = fields;
    //here when we use 'name'...it will simply means fields.name...coz of destructuring above fields
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "please include all fields",
      });
    }

    let product = new Product(fields);

    //handle files here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //allowing only 3mb files
        return res.staus(400).json({
          error: "File size is too big!",
        });
      }
      //technicall these r the 2 lines that save the photo in the DB
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    console.log(product);
    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "saving tshirt failed",
        });
      }
      res.json(product);
    });
  });
};

//1).GETTING the products
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};
//2).middleware..this will make our applications fast
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//DELETE CONTROLLER
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, delProduct) => {
    //here we will get the delProduct as callback
    if (err) {
      return res.status(400).json({
        error: "failed to delete the product",
      });
    }
    res.json({
      message: "Deletion successful",
      delProduct,
    });
  });
};

//UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm(); //here we r declaring the form
  form.keepExtensions = true; //here we want to set the format of the file type ie-jpeg,png..

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //UPDATION CODE
    let product = req.product;
    product = _.extend(product, fields); //here we r looking for the existing product.
    //nd the fields we r gonna change will be updated in our product.

    //handle files here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //allowing only 3mb files
        return res.staus(400).json({
          error: "File size is too big!",
        });
      }
      //technicall these r the 2 lines that save the photo in the DB
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //console.log(product);
    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "updation of product failed",
        });
      }
      res.json(product);
    });
  });
};

//PRODUCT LISTING
exports.getAllProducts = (req, res) => {
  //here in down 2 statements we r seeking query from the user
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo") //here we r deselecting the things that we donot want to execute
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err) {
        res.status(400).json({
          error: "No product found",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No category found",
      });
    }
    res.json(category);
  });
};

//UPDATING THE INVENTORY
exports.updateStock = (req, res, next) => {
  //1).
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    //2.
    if (err) {
      res.status(400).json({
        error: "Bulk operations have failed",
      });
    }
    next();
  });
};
