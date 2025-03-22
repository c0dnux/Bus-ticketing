const catchAsync = require("./../utils/catchAsync");
const Bus = require("./../models/busModel");
const AppError = require("./../utils/appError");
exports.allBuses = catchAsync(async (req, res, next) => {
  const bus = await Bus.find();

  res.status(200).json({
    status: "success",
    message: "All buses",
    data: bus,
  });
});
exports.addBus = catchAsync(async (req, res, next) => {
  const bus = await Bus.create(req.body);
  if (!bus) return next(new AppError("Error adding bus", 404));

  res.status(201).json({
    status: "success",
    message: "Bus created successfully.",
    data: bus,
  });
});

exports.deleteBus = catchAsync(async (req, res, next) => {
  const { busId } = req.body;
  if (!busId) return next(new AppError("Bus id required", 400));

  const bus = await Bus.findOneAndDelete({ _id: busId });
  console.log(bus, busId);
  if (!bus) return next(new AppError("Error deleting bus", 404));

  res.status(200).json({
    status: "success",
    message: "Bus deleted successfully.",
    data: bus,
  });
});
exports.updateBus = catchAsync(async (req, res, next) => {
  const { busId } = req.params;
  if (!busId) return next(new AppError("Bus id required", 400));

  const bus = await Bus.findByIdAndUpdate(busId, req.body, { new: true });
  console.log(bus, busId);
  if (!bus) return next(new AppError("Error updating bus", 404));

  res.status(200).json({
    status: "success",
    message: "Bus updated successfully.",
    data: bus,
  });
});
