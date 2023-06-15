const socketController = require("./controller/socket_controller");

const eventListeners = function() {
    socketController.joinARoom();
    socketController.emitEventToRoom();
}

module.exports = eventListeners;