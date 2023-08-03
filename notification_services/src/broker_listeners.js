const socketController = require("./controller/socket_controller");

const eventListeners = function() {
    socketController.joinARoom();
    socketController.emitEventToRoom();
    socketController.handleOutBid();
}

module.exports = eventListeners;