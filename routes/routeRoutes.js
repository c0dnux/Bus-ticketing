const express = require("express");
const router = express.Router();
const routerController = require("./../controllers/routerController");
router.post("/addRouter", routerController.createRouter);
router.get("/allRouter", routerController.allRouters);

router.patch("/addBusToRouter/:routerId", routerController.addBus);
router.patch("/removeBus/:routerId", routerController.removeBus);

module.exports = router;
