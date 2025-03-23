const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Booking = require("./../models/bookingsModel");
const axios = require("axios");
const Route = require("./../models/routeModel");
const Bus = require("./../models/busModel"); // Import Bus model
const Payment = require("./../models/paymentModel");

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  res.status(200).json({ status: "success", data: bookings });
});
exports.makePayment = catchAsync(async (req, res, next) => {
  const { busId, seats, routeId } = req.body;

  // 🔹 Step 1: Check if bus exists
  const bus = await Bus.findById(busId);
  if (!bus) return next(new AppError("Bus not found", 404));

  // 🔹 Step 2: Check available seats
  if (bus.availableSeats < seats) {
    return next(new AppError("Not enough seats available", 400));
  }

  // 🔹 Step 3: Get route details and calculate price
  const route = await Route.findById(routeId);
  const price = route.fare * seats;
  const reference = `booking_${req.user.id}_${Date.now()}_${route.id}`;

  // 🔹 Step 4: Initialize Paystack payment
  const paystackResponse = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: req.user.email,
      amount: price * 100, // Convert to kobo (Naira subunit)
      currency: "NGN",
      reference,
      callback_url: `${req.protocol}://${req.get(
        "host"
      )}/confirm-payment?reference=${reference}`,
      metadata: {
        customer: req.user.id,
        busId,
        routeId,
        seats,
        price,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // 🔹 Step 5: Return checkout URL to user
  res.status(200).json({
    status: "success",
    checkoutUrl: paystackResponse.data.data.authorization_url,
  });
});

exports.paymentConfirmation = catchAsync(async (req, res, next) => {
  const { reference } = req.body; // Get reference from the request

  if (!reference) {
    return next(new AppError("Payment failed: Missing reference", 404));
  }

  // 🔹 Step 1: Verify the transaction with Paystack
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (response.data.data.status !== "success")
    return next(new AppError("Payment verification failed", 400));

  // 🔹 Step 2: Extract relevant payment details
  const {
    metadata,
    reference: verifiedRef,
    paid_at,
    amount,
    channel,
  } = response.data.data;

  // 🔹 Step 3: Find the bus and check seat availability again
  const bus = await Bus.findById(metadata.busId);
  if (!bus) return next(new AppError("Bus not found", 404));

  if (bus.availableSeats < metadata.seats) {
    return next(new AppError("Seats no longer available", 400));
  }

  // 🔹 Step 4: Create a new booking
  const booking = await Booking.create({
    user: metadata.customer, // User ID
    bus: metadata.busId,
    route: metadata.routeId,
    seats: metadata.seats,
    totalPrice: metadata.price,
    status: "confirmed",
    paymentStatus: "paid",
    transactionId: verifiedRef,
    createdAt: paid_at,
  });

  // 🔹 Step 5: Deduct booked seats from bus
  bus.availableSeats -= metadata.seats;
  await bus.save();

  // 🔹 Step 6: Save Payment Record
  const payment = await Payment.create({
    booking: booking._id,
    user: metadata.customer,
    amount: amount / 100, // Convert from kobo to naira
    method: channel, // Payment method (card, bank_transfer, etc.)
    status: "completed",
    transactionId: verifiedRef,
    createdAt: paid_at,
  });

  return res.status(200).json({
    status: "success",
    message: "Payment successful, booking created",
    booking,
  });
});
