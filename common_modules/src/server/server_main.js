const dontenv = require("dotenv");

function initServer(service,app){
    const port = serverPorts[service];
    dontenv.config({path:"./config.env"});  
    app.listen(port,()=>{
        console.log(`${service} running successfully on port ${port}`);
    });
}

const serverPorts = {
    "auth_service" : 7000,
    "verification_service" : 7001,
    "car_services" : 7002,
    "bidding_services": 7003,
    "notification_services": 7004
};

module.exports = initServer;
