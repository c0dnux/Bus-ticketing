const express = require("express");
const router = express.Router();
const paymentController = require("./../controllers/paymentController");
const authController = require("./../controllers/authController");
router.post(
  "/getMyreceipts",
  authController.protect,
  paymentController.getMyReceipts
);
router.post(
  "/getAllreceipts",
  authController.protect,
  authController.restrictTo("admin"),
  paymentController.getAllReceipts
);
module.exports = router;
