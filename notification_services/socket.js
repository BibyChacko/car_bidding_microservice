const socketIO = require("socket.io");

let io;

function initialize(server) {
  io = socketIO(server);

  // Handle socket connection
  io.on("connection", (socket) => {
    console.log("A user connected!");

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected!");
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO is not initialized!");
  }
  return io;
}

module.exports = { initialize, getIO };