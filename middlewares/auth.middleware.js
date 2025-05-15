const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const httpStatus = require("../enums/httpStatusCode.enum");
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.error(
        httpStatus.UNAUTHORIZED,
        false,
        "Authentication required"
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.APP_SUPER_SECRET_KEY);
    
    // Find user by id
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.error(
        httpStatus.UNAUTHORIZED,
        false,
        "User not found"
      );
    }
    
    // Add user to request object
    req.user = user;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.error(
      httpStatus.UNAUTHORIZED,
      false,
      "Invalid authentication token"
    );
  }
};

module.exports = authMiddleware;
