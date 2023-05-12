const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name : {
        type: String, 
        required: true
    },
    email : {
        type:String,
        required: true,
        unique: [true,"Email is required"]
    },
    phone : {
        type:String,
        required: true,
        unique: [true,"Phone is required"]
    },
    password : {
        type : String,
        required : [true,"Password is required"],
        minlength:5,  
        select : false
    },
    isActive : {
        type : Boolean,
        default : true
    },
    isUserVerified : {
        type : Boolean,
        default : false
    },
    userType: {
        type : String,
        enum : ["user","admin","broker","official"],
        default : "user"
    },
    subUser: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    addressLine1 : {
        type : String,
        required : [true,"Address line 1 is required"]
    },
    addressLine2 : {
        type : String
    },
    addressLine3 : {
        type : String
    },
    city : {
        type : String,
        required : [true,"City is required"]
    },
    district : {
        type : String,
        required : [true,"District is required"]
    },
    state : {
        type : String,
        required : [true,"State is required"]
    },
    country : {
        type : String,
        required : [true,"Country is required"]
    },
    pincode : {
        type : String,
        required : [true,"Pincode is required"]
    },
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,12);
    next();
});

userSchema.methods.checkPasswords = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}


var UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;