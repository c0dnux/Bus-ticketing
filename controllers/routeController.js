const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Route = require("./../models/routeModel");

exports.createRoute = catchAsync(async (req, res, next) => {
  const route = await Route.create(req.body);
  if (!route) return next(new AppError("Error creating route", 404));
  res.status(201).json({
    status: "success",
    message: "Route created successfully",
    data: route,
  });
});
exports.addBus = catchAsync(async (req, res, next) => {
  const { routeId } = req.params;
  const { busId } = req.body;
  if (!routeId || !busId)
    return next(new AppError("please provide route id and bus id", 404));
  const route = await Route.findById(routeId);

  // Check if the bus already exists in schedules
  const busExists = route.schedules.some(
    (schedule) => schedule.bus.toString() === busId
  );
  if (busExists) return next(new AppError("Cant add a bus twice", 404));
  const routeUpdate = await Route.findByIdAndUpdate(
    routeId,
    {
      $push: { schedules: { bus: busId } },
    },
    { new: true }
  );
  if (!routeUpdate) return next(new AppError("Error adding bus to route", 400));
  res.status(201).json({
    status: "success",
    message: "bus added successfully",
    data: routeUpdate,
  });
});
exports.removeBus = catchAsync(async (req, res, next) => {
  const { routeId } = req.params;
  const { busId } = req.body;
  if (!routeId || !busId)
    return next(new AppError("please provide route id and bus id", 404));
  const routeUpdate = await Route.findByIdAndUpdate(
    routeId,
    {
      $pull: { schedules: { bus: busId } },
    },
    { new: true, useFindAndModify: false }
  );
  if (!routeUpdate) return next(new AppError("Error creating route", 404));
  res.status(201).json({
    status: "success",
    message: "Bus Removed successfully",
    data: routeUpdate,
  });
});
