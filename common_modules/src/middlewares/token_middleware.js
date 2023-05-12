const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verifyToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    console.log("Invalid token");
    throw new Error('Invalid token');
  }
};

const validateToken = async (req,res,next) =>{
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log("No token");
      throw new Error('Token not found. Please login again');
    }

    const token = authorization.split(' ')[1];
    const decoded = await verifyToken(token);
    req.headers.userId = decoded.uid;
    console.log(decoded);
    // Set user object on request headers
    next();
}

module.exports = validateToken;