const express = require("express");
const errorMiddleware = require("@bibybat/common_modules/src/middlewares/error_middleware");
const essentialMiddleware = require("@bibybat/common_modules/src/middlewares/essential_middleware");
const unknownRouteMiddleware =  require("@bibybat/common_modules/src/middlewares/unknown_route_middleware");
const brokerListeners = require("./broker_listeners");
const userVerificationRouter = require("./router/user_verification_route");
const app = express();

app.get("/verification-services/health",(req,res)=>{
    res.send("Verification server is healthy");
});
essentialMiddleware(app);
brokerListeners();
app.use("/verification-services",userVerificationRouter);



app.use(unknownRouteMiddleware);
app.use(errorMiddleware);

module.exports = app;