const express = require("express");
const router = express.Router();
const busController = require("./../controllers/busController");
router.post("/addBus", busController.addBus);
router.delete("/deleteBus", busController.deleteBus);

module.exports = router;
