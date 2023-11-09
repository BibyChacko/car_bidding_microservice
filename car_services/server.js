const app = require("./src/app");
const server = require("@bibybat/common_modules/src/server/server_main");
const mongoose = require("mongoose");

server("car_services",app);
mongoose.connect(process.env.DATABASE_LOCAL,).then(conn=>{
    console.log("DB Connected");
}).catch(e=>console.log(e));
