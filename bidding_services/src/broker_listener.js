const bidController = require("./controllers/bid_controller");

const eventListeners = function(){
    bidController.addANewBid();
}

module.exports = eventListeners;