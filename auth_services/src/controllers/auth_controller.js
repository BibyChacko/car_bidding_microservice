
const UserModel = require("../models/user_model");
const jwt = require("jsonwebtoken");
const rabbitMQChannel = require("common_modules/src/util/message_broker_util");


exports.signUpUser = async(req,res) => {
    const payload = req.body;
    try{
        console.log("Reached a");
        const User = await UserModel.create({
            email : req.body.email,
            password : req.body.password,
            name : req.body.name,
            dob: req.body.dob,
            addressLine1 : req.body.addressLine1,
            addressLine2 : req.body.addressLine,
            addressLine3 : req.body.addressLine3,
            city : req.body.city,
            district : req.body.district,
            state : req.body.state,
            phone: req.body.phone,
            country : req.body.country,
            pincode : req.body.pincode,
        });
        const token = jwt.sign({uid:User.id,type:"user"},process.env.JWT_SECRET_KEY,
                {expiresIn:process.env.JWT_EXPIRES_IN});
        
        console.log("Reached b");
        res.status(200).json({status:true,data: User,token: token,msg: "User created successfully"});
        initUserVerification(User._id);  
        return;
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status:false,error:ex.message});
    }
}

async function initUserVerification(userId){
    const queueName = "init_verification";
    const channel = await rabbitMQChannel(queueName);
    channel.sendToQueue(queueName,Buffer.from(JSON.stringify({userId:userId})));
}

exports.loginUser = async function(req,res){
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400).json({status:false,error:"Email and password is required"});
        return;
    }

   const userData = await UserModel.findOne({email:email}).select("+password");
   if(!userData){
    res.status(401).json({status:false,error:"Invalid email or password"});
    return;
   }

   const isPasswordsSame = await userData.checkPasswords(password,userData.password);
   if(!isPasswordsSame){
    res.status(401).json({status:false,error:"Invalid email or password"});
    return;
   }

   const token = await jwt.sign(
    {
        uid : userData.id,
        type:userData.userType
    },
    process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN});

    return  res.status(200).json({status:true,data:userData,token:token});

}

exports.findUser = async function(req,res){
    const {email,phone} = req.body;
    if(!email && !phone){
        return res.status(400).json({status:false,error:"Email or phone is required"});
    }
    try{
        let user;
        if(email){
            user = await UserModel.findOne({email});
        }else{
            user = await UserModel.findOne({phone});
        }
        if (!user) {
            return res.status(404).json({ status: false, error: "User not found" });
        }
        return res.status(200).json({ status: true, data: user });
    }catch(ex){
        throw ex;
    }
}