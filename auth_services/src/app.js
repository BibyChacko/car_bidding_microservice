const express = require("express");
const errorMiddleware = require("@bibybat/common_modules/src/middlewares/error_middleware");
const essentialMiddleware = require("@bibybat/common_modules/src/middlewares/essential_middleware");
const unknownRouteMiddleware =  require("@bibybat/common_modules/src/middlewares/unknown_route_middleware");
const brokerListeners = require("./broker_listener");

const authRouter = require("./routers/auth_routers");
const app = express();

essentialMiddleware(app);
brokerListeners();
app.use("/auth-services",authRouter);

app.get("/auth-services/health",(req,res)=>{
    res.send("Auth server is healthy");
});


app.use(unknownRouteMiddleware);
app.use(errorMiddleware);

module.exports = app;