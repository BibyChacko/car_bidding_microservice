const express = require("express");
const errorMiddleware = require("common_modules/src/middlewares/error_middleware");
const essentialMiddleware = require("common_modules/src/middlewares/essential_middleware");
const unknownRouteMiddleware = require("common_modules/src/middlewares/unknown_route_middleware");
const socketRouter = require("./router/socket_room_router");
const fcmRouter = require("./router/fcm_router");
const brokerListener = require("./broker_listeners");
const { initializeFirebaseApp } = require("./helper/firebase_admin_helper");
const app = express();

essentialMiddleware(app);
initializeFirebaseApp();
brokerListener();

app.get("/notification-services/health", (req, res) => {
  return res.send("Notification server is healthy");
});

app.use("/notification-services/socket", socketRouter);
app.use("/notification-services/fcm", fcmRouter);

app.use(unknownRouteMiddleware);
app.use(errorMiddleware);

module.exports = app;
