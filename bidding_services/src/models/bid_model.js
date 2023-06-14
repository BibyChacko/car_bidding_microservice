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

bidSchema.methods.placeBid = async function(userId,amount) {
  this.leaderId = userId;
  this.bidAmount = amount;
  // TODO: Lets also add the no: of bids and participants 
}
const bidModel = mongoose.model("Bid", bidSchema);

module.exports = bidModel;
