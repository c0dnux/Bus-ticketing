const express = require("express");
const router = express.Router();
const routerController = require("./../controllers/routeController");
router.post("/addRouter", routerController.createRoute);
router.get("/allRouter", routerController.allRoutes);

router.patch("/addBusToRouter/:routerId", routerController.addBus);
router.patch("/removeBus/:routerId", routerController.removeBus);

module.exports = router;
