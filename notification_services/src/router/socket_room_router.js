const express = require("express");
const socketController = require("../controller/socket_controller");

const socketRoomRouter = express.Router();
socketRoomRouter.delete(
  "/room/:roomId/remove",
  socketController.disconnectRoom
);

socketRoomRouter.delete(
  "/room/:roomId/remove/:clientId",
  socketController.disconnectClientFromRoom
);


module.exports = socketRoomRouter;
