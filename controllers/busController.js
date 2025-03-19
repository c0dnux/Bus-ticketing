const catchAsync = require("./../utils/catchAsync");
const Bus = require("./../models/busModel");
const AppError = require("./../utils/appError");
exports.addBus = catchAsync(async (req, res, next) => {
  const bus = await Bus.create(req.body);
  if (!bus) return next(new AppError("Error adding bus", 404));

  res
    .status(201)
    .json({
      status: "success",
      message: "Bus created successfully.",
      data: bus,
    });
});
