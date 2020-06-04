const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//ALL OF PARAMS
router.param("userId", getUserById);
router.param("productId", getProductById);

//ACTUAL ROUTES
//All Create route
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//READ ROUTE
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//DELETE ROUTE
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);
//UPDATE ROUTE
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//LISTING ROUTE
router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
