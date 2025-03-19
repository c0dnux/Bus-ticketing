const mongoose = require("mongoose");
const { Schema } = mongoose;

// Route Schema
const RouteSchema = new Schema({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  duration: { type: String, required: true },
  fare: { type: Number, required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Route = mongoose.model("Route", RouteSchema);
module.exports = Route;
