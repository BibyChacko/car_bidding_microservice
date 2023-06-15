const AppError = require("common_modules/src/models/app_error");
const { getIO } = require("../../socket");
const rabbitMQChannel = require("common_modules/src/util/message_broker_util");

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
    const io = getIO();
    const { roomName, eventName, data } = JSON.parse(
      message.content.toString()
    );
    console.log(
      `Recieved an event ${eventName} with data : ${data} for the room ${roomName}`
    );
    io.to(roomName).emit(eventName, data);
    channel.ack(message);
  });
};

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

function sendGeneralNotification(data) {}
