const mongoose = require("mongoose");

const userVerificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    aadharDocument: {
      type: String,
    },
    panDocument: {
      type: String,
    },
    bankDocument: {
      type: String,
    },
    documentVerficiationStatus: {
      aadhar: {
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        comment: {
          type: String,
        },
      },
      pan: {
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        comment: {
          type: String,
        },
      },
      bankDocument: {
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        comment: {
          type: String,
        },
      },
    },
    verificationOpen: {
      type: Boolean,
      default: false,
    },
    adminComment: {
      type: String,
    },
  },
  { timestamp: true }
);

userVerificationSchema.methods.updateDocuments = function (
  aadhar,
  pan,
  bankStatement
) {
  console.log(aadhar);
  this.aadharDocument = aadhar;
  this.panDocument = pan;
  this.bankDocument = bankStatement;
  this.verificationOpen = true;
};

userVerificationSchema.methods.verifyDocs = function (
  aadharComment,
  panComment,
  bankStatementComment,
  adminComment,
  aadharStatus,
  panStatus,
  bankDocumentStatus
) {
  this.verificationOpen = false;
  this.documentVerficiationStatus.aadhar.status = aadharStatus;
  this.documentVerficiationStatus.aadhar.comment = aadharComment;
  this.documentVerficiationStatus.pan.status = panStatus;
  this.documentVerficiationStatus.pan.comment = panComment;
  this.documentVerficiationStatus.bankDocument.status = bankDocumentStatus;
  this.documentVerficiationStatus.bankDocument.comment = bankStatementComment;
  this.adminComment = adminComment;
};

userVerificationSchema.methods.isAllDocsApproved = function () {
  return (
    this.documentVerficiationStatus.aadhar.status === "approved" &&
    this.documentVerficiationStatus.pan.status === "approved" &&
    this.documentVerficiationStatus.bankDocument.status === "approved"
  );
};

const UserVerificationModel = mongoose.model(
  "UserVerification",
  userVerificationSchema
);

module.exports = UserVerificationModel;
