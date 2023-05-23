const dontenv = require("dotenv");

function testHelper() {
    dontenv.config({path:"./config.env"});  
}

module.exports = testHelper;