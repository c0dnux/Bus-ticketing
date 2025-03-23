const express = require("express");
const route = express.Router();
const routeController = require("./../controllers/routeController");
route.post("/addRoute", routeController.createRoute);
route.get("/allRoute", routeController.allRoutes);

route.patch("/addBusToRoute/:routeId", routeController.addBus);
route.patch("/removeBus/:routeId", routeController.removeBus);

module.exports = route;
