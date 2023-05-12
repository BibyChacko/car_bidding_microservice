const verificationHandler = require("./controller/user_verification_controller");

const eventListeners = function(){
    verificationHandler.initiateVerificationRecords();
}

module.exports = eventListeners;