const multer = require("multer");
const UserVerificationModel = require("../models/user_verification_model");
const rabbitMQChannel = require("@bibybat/common_modules/src/util/message_broker_util");
const AppError = require("@bibybat/common_modules/src/models/app_error");

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

exports.uploadVerificationDocuments = async (req, res, next) => {
  if (!req.files) {
    return next(new AppError(400, "No files were uploaded"));
  }

  const aadhar = req.files.aadhar;
  const pan = req.files.pan;
  const bankStatement = req.files.bankStatement;
  const userId = req.headers.userId;

  if (!aadhar || !pan || !bankStatement) {
    return next(
      new AppError(
        400,
        "All files (Aadhar, Pan, and Bank Statement) are required"
      )
    );
  }

  try {
    var userVerification = await UserVerificationModel.findOne({
      userId: userId,
    });
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
    return next(new AppError(500, ex.message, ex.stacktrace));
  }
};

// Update by the admin for verifying or rejecting teh documents uploaded

exports.updateVerificationDocs = async (req, res, next) => {
  const aadharComment = req.body.aadharComment;
  const panComment = req.body.panComment;
  const bankStatementComment = req.body.bankStatementComment;
  const adminComment = req.body.adminComment;
  const aadharStatus = req.body.aadharStatus;
  const panStatus = req.body.panStatus;
  const bankStatementStatus = req.body.bankStatementStatus;
  const userId = req.body.userId;

  const verificationModel = await UserVerificationModel.findOne({
    userId: userId,
  });
  verificationModel.verifyDocs(
    aadharComment,
    panComment,
    bankStatementComment,
    adminComment,
    aadharStatus,
    panStatus,
    bankStatementStatus
  );
  await verificationModel.save();
  res.status(200).json({ status: true, msg: "Documents verified succeffully" });
  const verificationResult = verificationModel.isAllDocsApproved();
  if (verificationResult) {
    sendVerificationSuccessAck(verificationModel.userId);
  }
  return;
};

async function sendVerificationSuccessAck(userId) {
  const queueName = "update_verification";
  const channel = await rabbitMQChannel(queueName);
  channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify({ userId: userId, status: true }))
  );
}

exports.getPendingVerificationDocs = async (req, res, next) => {
  try {
    var verificationPendings = await UserVerificationModel.find({
      verificationOpen: false,
    });
    return res.status(200).json({
      status: true,
      data: verificationPendings,
      msg: "Pending verifications fetched successfully",
    });
  } catch (ex) {
    return next(new AppError(500, ex.message, ex.stacktrace));
  }
};
