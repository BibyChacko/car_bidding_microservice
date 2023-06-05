const express = require("express");
const errorMiddleware = require("common_modules/src/middlewares/error_middleware");
const essentialMiddleware = require("common_modules/src/middlewares/essential_middleware");
const unknownRouteMiddleware =  require("common_modules/src/middlewares/unknown_route_middleware");
const carRouter = require("./routers/car_router");
const app = express();

essentialMiddleware(app);
app.get("/car-services/health",(req,res)=>{
    return res.send("Car server is healthy");
});
app.use("/car-services",carRouter);

app.use(unknownRouteMiddleware);
app.use(errorMiddleware);

module.exports = app;