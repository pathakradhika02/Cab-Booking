const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const driverController = require("../controllers/driverController")
const bookingController = require("../controllers/bookingController")
const earning = require("../controllers/totalearningController")

router.post("/register/user",userController.registerUser );
router.post("/update/user",userController.updateUser );
router.post("/user/updatelocation",userController.updateUserLocation );

router.post("/register/driver", driverController.registerDriver);
router.post("/driver/updatelocation", driverController.updateDriverLocation);
router.post("/driver/updatestatus", driverController.updateDriverStatus);

router.get("/findallavailabledrivers", bookingController.findAvailableDrivers);
router.post("/chooseride", bookingController.chooseRide);
router.post("/calculatebill", bookingController.calculateBill);

router.get("/totalearning", earning.calculateTotalEarningByDrivers);

module.exports = router;