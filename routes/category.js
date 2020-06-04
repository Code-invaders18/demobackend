const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/category");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//actual routes goes here

//CREATE ROUTE
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//READ ROUTE
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//UPDATION
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//DELETION
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
