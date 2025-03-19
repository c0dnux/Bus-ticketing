const express = require("express");
const app = express();
const globalErrorController = require("./controllers/errorController");
const userRoutes = require("./routes/userRoutes");

//Body Parser (req.body)
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.all("*", (req, res, next) => {
  //whenever we pass somrthing in the next it assumes there is an error
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});
app.use(globalErrorController);
module.exports = app;
