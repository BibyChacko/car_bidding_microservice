const express = require("express");
const errorMiddleware = require("@bibybat/common_modules/src/middlewares/error_middleware");
const essentialMiddleware = require("@bibybat/common_modules/src/middlewares/essential_middleware");
const unknownRouteMiddleware =  require("@bibybat/common_modules/src/middlewares/unknown_route_middleware");
const biddingRouter = require("./routers/bidding_router");
const brokerListener = require("./broker_listener");
const app = express();

essentialMiddleware(app);
brokerListener();

app.get("/bid-services/health",(req,res) => {
    return res.send("Car server is healthy");
});
app.use("/bid-services",biddingRouter);

app.use(unknownRouteMiddleware);
app.use(errorMiddleware);

module.exports = app;