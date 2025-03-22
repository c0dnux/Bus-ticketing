const mongoose = require("mongoose");
const { Schema } = mongoose;
// Bus Schema
const BusSchema = new Schema({
  busNumber: {
    type: String,
    required: [true, "please provide bus number."],
    unique: [true, "Bus number already exists."],
  },
  type: {
    type: String,
    enum: ["standard", "luxury", "mini"],
    default: "standard",
  },
  capacity: { type: Number, required: [true, "please provide capacity."] },
  availableSeats: {
    type: Number,
    required: [true, "please provide avilable seats."],
  },
  status: {
    type: String,
    enum: ["available", "booked", "maintenance"],
    default: "available",
  },
  operator: { type: String, required: [true, "please provide operator."] },
  createdAt: { type: Date, default: Date.now },
});

const Bus = mongoose.model("Bus", BusSchema);
module.exports = Bus;
