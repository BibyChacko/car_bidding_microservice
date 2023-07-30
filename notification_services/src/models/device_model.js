const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    deviceToken: {
        type: String,
        required: [true,"Device token is mandatory"]
    },
    platform: {
        type: String,
        enum: ["Web","Android","iOS"],
        default: "Web"
    },
    appId: {
        type: String,
        default: "car_bidding_v1_001"
    }
},);

const DeviceModel = mongoose.model("DeviceModel",deviceSchema);

module.exports = DeviceModel;
