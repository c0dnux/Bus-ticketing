const express = require("express");
const router = express.Router();
const busController = require("./../controllers/busController");
router.post("/addBus", busController.addBus);
router.delete("/deleteBus", busController.deleteBus);
router.patch("/updateBus/:busId", busController.updateBus);
router.get("/all", busController.allBuses);

module.exports = router;
