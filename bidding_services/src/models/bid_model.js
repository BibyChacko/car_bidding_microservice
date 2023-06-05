const mongoose = require("mongoose");

const bidSchema = mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bidAmount: {
      type: Number,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    openingTime: {
      type: Date,
      required: [true, "Opening time is required"],
    },
    closingTime: {
      type: Date,
      required: [true, "Closing time is required"],
    },
  },
  {
    timeStamps: true,
  }
);

const bidModel = mongoose.model("Bid", bidSchema);

module.exports = bidModel;
