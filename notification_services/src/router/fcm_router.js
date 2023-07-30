const express = require("express");
const fcmController = require("../controller/fcm_controller");

const fcmRouter = express.Router();

fcmRouter
  .route("/device/token")
  .patch(fcmController.updateDeviceId)
  .post(fcmController.addNewDevice);

module.exports = fcmRouter;
