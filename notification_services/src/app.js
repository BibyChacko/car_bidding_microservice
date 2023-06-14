const express = require("express");
const errorMiddleware = require("common_modules/src/middlewares/error_middleware");
const essentialMiddleware = require("common_modules/src/middlewares/essential_middleware");
const unknownRouteMiddleware =  require("common_modules/src/middlewares/unknown_route_middleware");
const app = express();

essentialMiddleware(app);
app.get("/notification-services/health",(req,res)=>{
    return res.send("Notification server is healthy");
});


app.use(unknownRouteMiddleware);
app.use(errorMiddleware);

module.exports = app;