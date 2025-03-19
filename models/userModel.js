const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Provide email"],
    lowerCase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, "en-NG"); // Validate Nigerian numbers
      },
      message: "Please provide a valid Nigerian phone number",
    },
  },
  password: {
    type: String,
    required: [true, "Provide a password"],
    minLength: [8, "Password must be more than 8 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  nin: {
    type: String,
    required: [true, "Nin is required."],
    unique: true,
    match: [/^\d{11}$/, "NIN must be exactly 11 digits"],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: { type: String, enum: ["passenger", "admin"], default: "passenger" },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: String,
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash password
  this.password = await bcrypt.hash(this.password, 12);
  // Remove confirmPassword field
  this.confirmPassword = undefined;

  // Set passwordChangedAt field
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.isCorrectPassword = async function (
  userPassword,
  hashedPassword
) {
  return await bcrypt.compare(userPassword, hashedPassword);
};
// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });

//   next();
// });
userSchema.methods.passwordChangedAfter = function (userTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changedTimeStamp > userTimeStamp;
  }
  return false;
};
userSchema.methods.passwordReset = function () {
  const resetToken = Math.floor(100000 + Math.random() * 900000);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(String(resetToken))
    .digest("hex");
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // Token expires in 5 minutes

  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
