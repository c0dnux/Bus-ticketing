const catchAsync = require("./../utils/catchAsync");
const Payment = require("./../models/paymentModel");

exports.getMyReceipts = catchAsync(async (req, res, next) => {
  const receipts = await Payment.find({ user: req.user.id });
  res.status(200).json({
    status: "success",
    message: "My transaction history",
    data: receipts,
  });
});
exports.getAllReceipts = catchAsync(async (req, res, next) => {
  const receipts = await Payment.find();
  res.status(200).json({
    status: "success",
    message: "All transaction history",
    data: receipts,
  });
});
