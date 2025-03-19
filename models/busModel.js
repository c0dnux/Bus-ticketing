const mongoose = require("mongoose");
const { Schema } = mongoose;
// Bus Schema
const BusSchema = new Schema({
  busNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  operator: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Bus = mongoose.model("Bus", BusSchema);
module.exports = Bus;
