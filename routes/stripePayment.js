const express = require("express");
const router = express.Router();
const { makepayment } = require("../controllers/stripePayment");

router.post("/stripePayment", makepayment);

module.exports = router;
