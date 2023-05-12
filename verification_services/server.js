
const app = require("./src/app");
const server = require("common_modules/src/server/server_main");
const mongoose = require("mongoose");

server("verification_service",app);

mongoose.connect(process.env.DATABASE_LOCAL,).then(conn=>{
    console.log("DB Connected");
}).catch(e=>console.log(e));
