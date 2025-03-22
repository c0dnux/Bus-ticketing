const express = require("express");
const app = express();
const globalErrorController = require("./controllers/errorController");
const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/busRoutes");
const routeRoutes = require("./routes/routeRoutes");
const AppError = require("./utils/appError");
//Body Parser (req.body)
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/v1/route", routeRoutes);

app.all("*", (req, res, next) => {
  //whenever we pass somrthing in the next it assumes there is an error
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});
app.use(globalErrorController);
module.exports = app;
