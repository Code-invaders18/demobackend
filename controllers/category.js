const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "category not found in the db",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  //here we r making an object of a Category model..here modle can be treated as class
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "not able to save category in DB",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  //from the middleware
  const category = req.category;
  //down wali category tell us yes..i have deleted this
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete th is category",
      });
    }
    res.json({
      message: "succesfull deleted",
    });
  });
};
