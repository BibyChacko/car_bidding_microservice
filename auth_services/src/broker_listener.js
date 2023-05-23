const authHandler = require("./controllers/auth_controller");

const eventListeners = function(){
    authHandler.updateVerification();
}

module.exports = eventListeners;