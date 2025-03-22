const express = require("express");
const route = express.Router();
const busController = require("./../controllers/busController");
route.post("/addBus", busController.addBus);
route.delete("/deleteBus", busController.deleteBus);
route.patch("/updateBus/:busId", busController.updateBus);
route.get("/all", busController.allBuses);

module.exports = route;
