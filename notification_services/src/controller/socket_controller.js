const AppError = require("common_modules/src/models/app_error");
const { getIO } = require("../../socket");
const rabbitMQChannel = require("common_modules/src/util/message_broker_util");
const DeviceModel = require("../models/device_model");
const {
  sendMessageToDevice,
  sendMessageToTopic,
} = require("../helper/firebase_admin_helper");

exports.joinARoom = async () => {
  const queueName = "join-room";
  const channel = await rabbitMQChannel(queueName);
  channel.consume(queueName, async (message) => {
    const io = getIO();
    const { roomName } = JSON.parse(message.content.toString());
    console.log(`Joining request recieved for the room ${roomName}`);
    io.on("connection", (socket) => {
      socket.join(roomName);
    });
    channel.ack(message);
  });
};

exports.emitEventToRoom = async () => {
  const queueName = "send-event-to-room";
  const channel = await rabbitMQChannel(queueName);
  channel.consume(queueName, async (message) => {
    const { roomName, eventName, data } = JSON.parse(
      message.content.toString()
    );
    console.log(
      `Recieved an event ${eventName} with data : ${data} for the room ${roomName}`
    );

    sendEvent(roomName, eventName, data);
    channel.ack(message);
  });
};

function sendEvent(roomName, eventName, data) {
  const io = getIO();
  io.to(roomName).emit(eventName, data);
}

exports.disconnectClientFromRoom = async (req, res, next) => {
  try {
    const roomName = req.params.roomId;
    const clientId = req.params.clientId;
    const io = getIO();
    const clientsInRoom = roomClients.get(roomName);
    if (clientsInRoom && clientsInRoom.has(clientId)) {
      io.to(clientId).emit(
        "removedFromRoom",
        "You have been removed from the room."
      );
      io.sockets.sockets[clientId].leave(roomName);
      clientsInRoom.delete(clientId);
    }
    return res
      .status(200)
      .json({ status: true, msg: "Disconnected succeffully from the room" });
  } catch (error) {
    return next(new AppError(500, error.message, error.stacktrace));
  }
};

exports.disconnectRoom = async (req, res, next) => {
  try {
    const roomName = req.params.roomId;
    const room = io.sockets.in(roomName);
    room.disconnect(true);
    return res
      .status(200)
      .json({ status: true, msg: "Room closed succesfully" });
  } catch (error) {
    return next(new AppError(500, error.message, error.stacktrace));
  }
};

exports.handleOutBid = async () => {
  const queueName = "bid_notification";
  const channel = await rabbitMQChannel(queueName);
  channel.consume(queueName, async (message) => {
    const { formerLeaderId, currentLeaderId, bidAmount, bidId, carId } =
      JSON.parse(message.content.toString());
    sendNotificationToUserDeviceToken(
      currentLeaderId,
      "Congragulations",
      `You leads the bid with amount of Rs.${bidAmount}`,
      { bidId: bidId, carId: carId }
    );
    sendNotificationToUserDeviceToken(
      formerLeaderId,
      "Alert",
      `Sorry, you are outbidden by Rs.${bidAmount}`,
      { bidId: bidId, carId: carId }
    );

    sendMessageToTopic(
      carId,
      "Bid Alert",
      `A new bid had been placed for Rs. ${bidAmount}`,
      null,
      { bidId: bidId, carId: carId }
    );

    // Send the data to the room so that the widget for showing the amount updates
    sendEvent(carId,"new-bid",JSON.parse(message.content.toString()));
    channel.ack(message);
  });
};

async function sendNotificationToUserDeviceToken(userId, title, message, data) {
  const deviceModel = await DeviceModel.find({ userId: userId });
  const deviceToken = deviceModel.deviceToken;
  sendMessageToDevice(deviceToken, title, message, null, data);
}
