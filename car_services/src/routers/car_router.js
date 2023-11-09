const express = require("express");
const tokenVerificationMiddleware = require("@bibybat/common_modules/src/middlewares/token_middleware");
const validationHelper = require("@bibybat/common_modules/src/util/validation_util");
const carController = require("../controllers/car_controller");

const carRouter = express.Router();

carRouter.use(tokenVerificationMiddleware);

carRouter
  .route("/cars")
  .get(carController.getAllCar)
  .post(
    validationHelper.validateRequiredFields([
      "carMake",
      "carModel",
      "variant",
      "fuel",
      "engineCC",
      "transmission",
      "mileage",
      "engineNo",
      "askPrice",
    ]),
    carController.addNewCar
  );

carRouter.patch(
  "/cars/:id/bid",
  validationHelper.validateRequiredFields([
    "openingTime",
    "closingTime",
    "initialAmount",
  ]),
  carController.isCarByIdAvaialble,
  carController.markForBidding
);

carRouter
  .route("/cars/:id")
  .get(
    validationHelper.isDataExistsInParams(["id"]),
    carController.isCarByIdAvaialble,
    carController.getACarById
  )
  .patch(
    validationHelper.isDataExistsInParams(["id"]),
    carController.isCarByIdAvaialble,
    carController.updateACar
  )
  .delete(
    validationHelper.isDataExistsInParams(["id"]),
    carController.isCarByIdAvaialble,
    carController.deleteACar
  );

module.exports = carRouter;
