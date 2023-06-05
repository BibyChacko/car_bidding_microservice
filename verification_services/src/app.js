const express = require("express");
const errorMiddleware = require("common_modules/src/middlewares/error_middleware");
const essentialMiddleware = require("common_modules/src/middlewares/essential_middleware");
const unknownRouteMiddleware =  require("common_modules/src/middlewares/unknown_route_middleware");
const brokerListeners = require("./broker_listeners");
const userVerificationRouter = require("./router/user_verification_route");
const app = express();

essentialMiddleware(app);
brokerListeners();
app.use("/verification-services",userVerificationRouter);

app.get("/verification-services/health",(req,res)=>{
    res.send("Verification server is healthy");
});

app.use(unknownRouteMiddleware);
app.use(errorMiddleware);

module.exports = app;