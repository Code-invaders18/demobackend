const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");

//here we r using getUserById as our router
router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
//for all users
// router.get("/users", getAllUsers);

//to update the existing record
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

module.exports = router;
