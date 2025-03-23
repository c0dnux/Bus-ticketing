const express = require("express");
const router = express.Router();
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");

router.post("/payRide", authController.protect, bookingController.makePayment);
router.post(
  "/confirmPayment",
  authController.protect,
  bookingController.paymentConfirmation
);
router.post("/getAll", authController.protect, bookingController.getMyBookings);

module.exports = router;
