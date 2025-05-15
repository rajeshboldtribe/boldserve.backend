const HttpStatus = require("../enums/httpStatusCode.enum");
const ResponseMessages = require("../enums/responseMessage.enum");
const admin=require("../models/admin.model");
const bcrypt = require("bcrypt");
const helpers=require("../utils/helper");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const adminController = {};

adminController.register = async (req, res) => {
  const { user_name, email, phone_no, password, confirm_password } = req.body;

  // Check if all required fields are present
  if (!user_name || !email || !phone_no || !password || !confirm_password) {
    return res.error(
      HttpStatus.BAD_REQUEST,
      false,
      "All fields are required"
    );
  }

  try {
    // Hash the password BEFORE using it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin with hashed password
    const newAdmin = await admin.create({
      user_name,
      email,
      phone_no,
      password: hashedPassword,
    });

    return res.success(
      HttpStatus.CREATED,
      true,
      "Admin registered successfully",
      newAdmin
    );
  } catch (error) {
    console.error("Error registering admin:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Internal server error",
      error
    );
  }
};

// login admin by email or phno and password

adminController.login =async(req,res) =>
{
  const{email,phone_no,password}=req.body

  if((!email && !phone_no)||!password){
    return res.error(
      HttpStatus.BAD_REQUEST,
      false,
      "please provide email/phone number and password"
    );
  }

  try{
    const existAdmin=await admin.findOne({
      where:email ? {email}:{phone_no}
    });

    if(!existAdmin){
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        "Admin not found"
      );
    }
    
    const isValidPassword=await bcrypt.compare(password,existAdmin.password);
    if(!isValidPassword){
      return res.error(
        HttpStatus.UNAUTHORIZED,
        false,
        "Invalid credential"
      );
    }

    const token=jwt.sign(
      {id:existAdmin.email},
      process.env.APP_SUPER_SECRET_KEY,
      {expiresIn:'24h'}
    );
    
    const adminData=existAdmin.toJSON();
    delete adminData.password;
    
    return res.success(
      HttpStatus.OK,
      true,
      "login successful",
      {admin:adminData,token}
    );
  }catch(error){
    console.error("Login error:",error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Internal server error",error
    );
  }
};

module.exports = adminController;