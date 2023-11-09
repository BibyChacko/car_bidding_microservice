const AppError = require("@bibybat/common_modules/src/models/app_error");
const CarModel = require("../models/car_model");
const crudFactory = require("@bibybat/common_modules/src/util/factory/crud_handler_factory");
const rabbitMQChannel = require("@bibybat/common_modules/src/util/message_broker_util");

exports.addNewCar = crudFactory.createOne(CarModel);
exports.getAllCar = crudFactory.readMany(CarModel);
exports.updateACar = crudFactory.updateOne(CarModel);
exports.deleteACar = crudFactory.deleteOne(CarModel);
exports.getACarById = crudFactory.readOne(CarModel);

exports.markForBidding = async (req, res, next) => {
  try {
    const car = req.headers.car;
    const openingTime = req.body.openingTime;
    const closingTime = req.body.closingTime;
    const initialAmount = req.body.initialAmount;

    car.markCarForBidding(openingTime, closingTime, initialAmount);
    await car.save();
    res.status(200).json({ status: true, msg: "Car is marked for bidding" }); // Sending response

    const timeInMilliSec = new Date(openingTime) - new Date().getTime();
    // Sending a delayed event
    const exchangeName = "add_car_to_bid";
    const queueName = "add_car_bid_queue";
    const routingKey = "bid.car";

    const eventData = {
      carId: car._id,
      openingTime: openingTime,
      closingTime: closingTime,
      initialAmount: initialAmount,
    };

    const channel = await rabbitMQChannel(exchangeName);
    await channel.assertExchange(exchangeName, "x-delayed-message", {
      autoDelete: false,
      durable: false,
      passive: true,
      arguments: { "x-delayed-type": "direct" },
    });

    await channel.assertQueue(queueName,{ durable: false });
    await channel.bindQueue(queueName, exchangeName, routingKey);

    channel.publish(
      exchangeName,
      routingKey,
      new Buffer.from(JSON.stringify(eventData)),
      { headers: { "x-delay": timeInMilliSec } }
    );
    return;
  } catch (error) {
    console.log(error);
    return next(new AppError(500, error.message, error.stacktrace));
  }
};

exports.isCarByIdAvaialble = async (req, res, next) => {
  try {
    const carId = req.params.id;
    const car = await CarModel.findById(carId);
    if (!car) {
      return next(new AppError(404, "Car not found"));
    }
    req.headers.car = car;
    next();
  } catch (error) {
    return next(new AppError(500, error.message, error.stacktrace));
  }
};
