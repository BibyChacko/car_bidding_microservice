const express = require("express");
const userVerificationController = require("../controller/user_verification_controller");
const tokenVerificationMiddleware = require("common_modules/src/middlewares/token_middleware");

const userVerificationRouter = express.Router();

userVerificationRouter.post(
  "/user/docs/upload",
  tokenVerificationMiddleware,
  userVerificationController.uploadFiles,
  userVerificationController.uploadVerificationDocuments
);
module.exports = userVerificationRouter;
