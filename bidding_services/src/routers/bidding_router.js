const express = require("express");
const tokenVerificationMiddleware = require("common_modules/src/middlewares/token_middleware");
const bidController = require("../controllers/bid_controller");

const bidRouter = express.Router();

bidRouter.use(tokenVerificationMiddleware);

bidRouter.route("/bids").get(bidController.getAllBids);
bidRouter
  .route("/bids/:id")
  .delete(bidController.deleteABid)
  .get(bidController.getBidById)
  .patch(bidController.updateABid);

  
module.exports = bidRouter;
