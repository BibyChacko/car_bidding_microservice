const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  carMake: {
    type: String,
    required: [true, "Car make is mandatory"],
  },
  carModel: {
    type: String,
    required: [true, "Car model is mandatory"],
    unique: true,
  },
  variant: {
    type: String,
    required: [true, "Car variant is mandatory"],
  },
  fuel: {
    type: String,
    required: [true, "Fuel is mandatory"],
    enum: ["P", "D", "H", "E"],
  },
  engineCC: {
    type: Number,
    required: [true, "Engine CC is mandatory"],
  },
  transmission: {
    type: String,
    required: [true, "Transmission is mandatory"],
    enum: ["MANUAL", "AMT", "CVT", "TORQUE_CONVERTER", "DST"],
  },
  mileage: {
    type: Number,
    required: [true, "Mileage is mandatory"],
  },
  engineNo: {
    type: String,
    required: [true, "Engine number is mandatory"],
  },
  askPrice: {
    type: Number,
  },
  closingPrice: {
    type: Number,
  },
  isBidding: {
    type: Boolean,
    default: false
  },
  carStatus: {
    type: String,
    enum: ["acquired", "open", "on-bid", "sold", "dispatched", "dropped"],
  },
  transactionId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  dispatchInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dispatch",
  },
  biddingInfo: {
    openingTime: {
      type: Date,
    },
    closingTime: {
      type: Date,
    },
    initialAmount: {
      type: Number,
    },
  },
});

carSchema.methods.markCarForBidding = async function(openingTime,closingTime,initialAmount){
  this.isBidding = true;
  this.carStatus = "on-bid";
  this.biddingInfo = {
    "openingTime" : openingTime,
    "closingTime" : closingTime,
    "initialAmount" : initialAmount
  };
}

const CarModel = mongoose.model("Car", carSchema);

module.exports = CarModel;
