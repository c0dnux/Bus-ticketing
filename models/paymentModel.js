const mongoose = require("mongoose");
const { Schema } = mongoose;

// Payment Schema
const PaymentSchema = new Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ["card", "bank_transfer", "mobile_money"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  transactionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
