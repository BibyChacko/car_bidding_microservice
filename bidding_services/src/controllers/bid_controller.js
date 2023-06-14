const AppError = require("common_modules/src/models/app_error");
const BidModel = require("../models/bid_model");
const crudFactory = require("common_modules/src/util/factory/crud_handler_factory");
const rabbitMQChannel = require("common_modules/src/util/message_broker_util");
const redis = require("redis");

var redisClient = redis.createClient();

exports.placeABid = async (req, res, next) => {
  try {
    const carId = req.body.carId;
    const bidAmount = req.body.bidAmount;
    const userId = req.headers.userId;

    const bidModel = await BidModel.findOne({ carId: carId }); // This is going to bring a lot of load on DB, Check for an optimized solution

    if (bidAmount <= bidModel.bidAmount) {
      return res
        .status(400)
        .json({ status: false, error: "Your bid amount is low" });
    }

    const lockKey = `lock${carId}`;
    const amountKey = `${carId}-amount`;
    const userIdKey = `${carId}-userId`;

    const [currentBidAmount, currentUserId] = await redisGetMultiple([
      amountKey,
      userIdKey,
    ]);
    if (!currentBidAmount || bidAmount > currentBidAmount) {
      await redisSetMultiple([amountKey, bidAmount, userIdKey, userId]);
    } else {
      return res
        .status(400)
        .json({ status: false, error: "Your bid amount is low" });
    }

    // The wait queue, checking if the lock is existing, if yes, we are on a wait queue until its released
    const isLockExists = await redisClient.exists(lockKey);
    if (isLockExists) {
      await redisClient.blpop(lockKey, 0);
    }

    // Locking the bid with the highest proce user Id, the lock is held for 3s
    const lockAcquired = await redisClient.set(
      lockKey,
      userId,
      "NX",
      "PX",
      3 * 10000
    );
    if (!lockAcquired) {
      return next(
        new AppError(403, "Couldn't place the bid.Technical Error occured")
      );
    }

    // Placing the bid, relasing the lock and sending success resposne to user
    bidModel.placeBid(userId, bidAmount);
    await bidModel.save();
    await redisClient.del(lockKey);
    return res
      .status(200)
      .json({
        status: true,
        msg: "Bid placed successfully.Congragulations, you leads the bid now.",
      });
  } catch (error) {
    return next(new AppError(500, error.message, error.stacktrace));
  }
};

// Helper function to retrieve multiple values from Redis
function redisGetMultiple(keys) {
  return new Promise((resolve, reject) => {
    redisClient.mget(keys, (err, values) => {
      if (err) {
        reject(err);
      } else {
        resolve(values);
      }
    });
  });
}

// Helper function to set multiple values in Redis
function redisSetMultiple(keyValuePairs) {
  return new Promise((resolve, reject) => {
    redisClient.mset(keyValuePairs, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

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
