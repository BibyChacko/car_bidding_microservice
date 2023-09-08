const UserModel = require("../models/user_model");
const jwt = require("jsonwebtoken");
const rabbitMQChannel = require("@bibybat/common_modules/src/util/message_broker_util");
const AppError = require("@bibybat/common_modules/src/models/app_error");

exports.signUpUser = async (req, res, next) => {
  const payload = req.body;
  try {
    const User = await UserModel.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      dob: req.body.dob,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine,
      addressLine3: req.body.addressLine3,
      city: req.body.city,
      district: req.body.district,
      state: req.body.state,
      phone: req.body.phone,
      country: req.body.country,
      pincode: req.body.pincode,
    });
    const token = jwt.sign(
      { uid: User.id, type: User.userType },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .status(200)
      .json({
        status: true,
        data: User,
        token: token,
        msg: "User created successfully",
      });
    const userType = User.userType;
    if (userType == "user") {
      initUserVerification(User._id);
    } else if (userType == "official") {
      User.verifcyOfficial();
      await User.save();
    }
    return;
  } catch (ex) {
    return next(new AppError(500, ex.message, ex.stacktrace));
  }
};

async function initUserVerification(userId) {
  const queueName = "init_verification";
  const channel = await rabbitMQChannel(queueName);
  channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify({ userId: userId }))
  );
}

exports.updateVerification = async () => {
  console.log("Verification updated");
  const queueName = "update_verification";
  const channel = await rabbitMQChannel(queueName);
  channel.consume(queueName, async (message) => {
    try {
      const { userId, status } = JSON.parse(message.content.toString());
      console.log(`Received message for user ${userId}`);
      const user = await UserModel.findById(userId);
      user.updateUserStatus(status);
      await user.save();
      channel.ack(message);
    } catch (error) {
      console.log(error);
    }
  });
};

exports.loginUser = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(400, "Email and password are required"));
    }

    const userData = await UserModel.findOne({ email: email }).select(
      "+password"
    );
    if (!userData) {
      return next(new AppError(401, "Invalid email or password"));
    }

    const isPasswordsSame = await userData.checkPasswords(
      password,
      userData.password
    );
    if (!isPasswordsSame) {
      return next(new AppError(401, "Invalid email or password"));
    }

    const token = await jwt.sign(
      {
        uid: userData.id,
        type: userData.userType,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({ status: true, data: userData, token: token });
  } catch (error) {
    return next(new AppError(500, error.message, error.stacktrace));
  }
};

exports.findUser = async function (req, res, next) {
  const { email, phone } = req.body;
  if (!email && !phone) {
    return next(new AppError(400, "Email or phone is required"));
  }
  try {
    let user;
    if (email) {
      user = await UserModel.findOne({ email });
    } else {
      user = await UserModel.findOne({ phone });
    }
    if (!user) {
      return next(new AppError(404, "User not found"));
    }
    return res.status(200).json({ status: true, data: user });
  } catch (ex) {
    return next(new AppError(500, ex.message, ex.stacktrace));
  }
};
