const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require("../models/app_error");

const verifyToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    throw(error);
  }
};

const validateToken = async (req,res,next) =>{
    const { authorization } = req.headers;
    try{
      if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(new AppError(401,"No token found,Please login for token"));
      }

      const token = authorization.split(' ')[1];
      const decoded = await verifyToken(token);
      req.headers.userId = decoded.uid;
      req.headers.userType = decoded.type;
      next();
    }catch(error){
      return next(new AppError(401,error.message,error.stacktrace));
    }
   
}

module.exports = validateToken;