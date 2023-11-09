const express = require("express");
const userVerificationController = require("../controller/user_verification_controller");
const tokenVerificationMiddleware = require("@bibybat/common_modules/src/middlewares/token_middleware");
const validationUtil = require("@bibybat/common_modules/src/util/validation_util");

const userVerificationRouter = express.Router();

userVerificationRouter.use(tokenVerificationMiddleware);
userVerificationRouter.patch(
  "/user/docs/upload",
  userVerificationController.uploadFiles,
  userVerificationController.uploadVerificationDocuments
);

userVerificationRouter.route("/user/open_requests")
  .get(userVerificationController.getPendingVerificationDocs)
  .patch(
    validationUtil.validateRequiredFields([
      "aadharComment",
      "panComment",
      "bankStatementComment",
      "adminComment",
      "userId",
      "aadharStatus",
      "panStatus",
      "bankStatementStatus"
    ]),
    userVerificationController.updateVerificationDocs,
  );

  
module.exports = userVerificationRouter;
