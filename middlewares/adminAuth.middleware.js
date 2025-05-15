const jwt = require('jsonwebtoken');
const HttpStatus = require("../enums/httpStatusCode.enum");
const Admin = require("../models/admin.model");
require("dotenv").config();

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.error(
        HttpStatus.UNAUTHORIZED,
        false,
        "Authentication required"
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.APP_SUPER_SECRET_KEY);
    
    // Find admin by email
    const adminUser = await Admin.findOne({
      where: { email: decoded.id }
    });
    
    if (!adminUser) {
      return res.error(
        HttpStatus.UNAUTHORIZED,
        false,
        "Admin not found"
      );
    }
    
    // Add admin to request object
    req.admin = adminUser;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.error(
      HttpStatus.UNAUTHORIZED,
      false,
      "Invalid authentication token"
    );
  }
};

module.exports = adminAuthMiddleware;