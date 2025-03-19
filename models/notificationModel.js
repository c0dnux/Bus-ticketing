const mongoose = require("mongoose");
const { Schema } = mongoose;

// Notification Schema
const NotificationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["booking", "payment", "reminder"],
    required: true,
  },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
