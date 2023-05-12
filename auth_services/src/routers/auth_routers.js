const express = require("express");
const authController = require("../controllers/auth_controller");
const {validateLogin,validateRequiredFields,validateSignUp} = require("common_modules/src/util/validation_util");

const authRouter = express.Router();

authRouter.post("/login",validateLogin,authController.loginUser);
authRouter.post("/signup",validateSignUp,authController.signUpUser);
authRouter.post("/find_user",validateRequiredFields(["email","phone"]),authController.findUser);

module.exports = authRouter;