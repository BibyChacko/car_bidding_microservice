const AppError = require("common_modules/src/models/app_error");
const BidModel = require("../models/bid_model");
const crudFactory = require("common_modules/src/util/factory/crud_handler_factory");
const rabbitMQChannel = require("common_modules/src/util/message_broker_util");

exports.placeABid = async (req, res, next) => {
  const bidId = req.body.bidId;
  const bidAmount = req.body.bidAmount;
  try {
  } catch (error) {
    return next(AppError(500, error.message, error.stacktrace));
  }
};

exports.addANewBid = async () => {
  const exchangeName = "add_car_to_bid";
  const queueName = "add_car_bid_queue";
  const routingKey = "bid.car";

  const channel = await rabbitMQChannel(queueName);

  channel.consume(queueName, async (message) => {
    const { carId, openingTime, closingTime, initialAmount } = JSON.parse(
      message.content.toString()
    );
    console.log(`Received message for car ${carId}`);
    await BidModel.create({
      carId: carId,
      bidAmount: initialAmount,
      openingTime: openingTime,
      closingTime: closingTime,
    });
    channel.ack(message);
  });
};

exports.getAllBids = crudFactory.readMany(BidModel);
exports.getBidById = crudFactory.readOne(BidModel);
exports.deleteABid = crudFactory.deleteOne(BidModel);
exports.updateABid = crudFactory.updateOne(BidModel);
