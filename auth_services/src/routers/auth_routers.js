const express = require("express");
const authController = require("../controllers/auth_controller");
const {validateLogin,validateRequiredFields,validateSignUp} = require("@bibybat/common_modules/src/util/validation_util");

const authRouter = express.Router();

authRouter.post("/login",validateLogin,authController.loginUser);
authRouter.post("/signup",validateSignUp,authController.signUpUser);
authRouter.post("/find_user",authController.findUser);

module.exports = authRouter;