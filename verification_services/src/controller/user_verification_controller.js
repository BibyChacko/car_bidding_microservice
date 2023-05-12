const multer = require("multer");
const UserVerificationModel = require("../models/user_verification_model");
const rabbitMQChannel = require("common_modules/src/util/message_broker_util");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

exports.uploadFiles = upload.fields([
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
]);

exports.initiateVerificationRecords = async () => {
  console.log("Initial verification started");
  const queueName = "init_verification";
  const channel = await rabbitMQChannel(queueName);
  channel.consume(queueName, async (message) => {
    const { userId } = JSON.parse(message.content.toString());
    console.log(`Received message for user ${userId}`);
    await UserVerificationModel.create({
      userId: userId,
    });
    channel.ack(message);
  });
};

exports.uploadVerificationDocuments = async (req, res) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ status: false, error: "No files were uploaded" });
  }

  const aadhar = req.files.aadhar;
  const pan = req.files.pan;
  const bankStatement = req.files.bankStatement;
  const userId = req.headers.userId;

  if (!aadhar || !pan || !bankStatement) {
    return res.status(400).json({
      status: false,
      error: "All files (Aadhar, Pan, and Bank Statement) are required",
    });
  }

  try {
    var userVerification = await UserVerificationModel.findOne({ userId: userId });
    userVerification.updateDocuments(
      aadhar[0].originalname,
      pan[0].originalname,
      bankStatement[0].originalname
    );
    await userVerification.save();
    return res
      .status(200)
      .json({ status: true, msg: "Documents uploaded successfully" });
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

exports.getAllVerifications = async (req, res) => {};

exports.getPendingVerificationDocs = async (req, res) => {};
