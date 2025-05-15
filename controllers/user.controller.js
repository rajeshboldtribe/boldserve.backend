const HttpStatus = require("../enums/httpStatusCode.enum");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize"); // Add this import for Sequelize operators
require("dotenv").config();

const userController = {};

// Register a new user
userController.register = async (req, res) => {
  const { fullName, email, phone, password, confirmPassword } = req.body;

  // Check if all required fields are present
  if (!fullName || !email || !phone || !password || !confirmPassword) {
    return res.error(
      HttpStatus.BAD_REQUEST,
      false,
      "All fields are required"
    );
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.error(
      HttpStatus.BAD_REQUEST,
      false,
      "Passwords do not match"
    );
  }

  try {
    // Check if user already exists with the same email or phone
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }], // Use Op directly instead of sequelize.Op
      },
    });

    if (existingUser) {
      return res.error(
        HttpStatus.CONFLICT,
        false,
        "User with this email or phone already exists"
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    // Remove password from response
    const userData = newUser.toJSON();
    delete userData.password;

    return res.success(
      HttpStatus.CREATED,
      true,
      "User registered successfully",
      userData
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Internal server error",
      error
    );
  }
};

// Login user
userController.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.error(
      HttpStatus.BAD_REQUEST,
      false,
      "Email and password are required"
    );
  }

  try {
    // Find user by email
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.error(
        HttpStatus.NOT_FOUND,
        false,
        "User not found"
      );
    }

    // Check if password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.error(
        HttpStatus.UNAUTHORIZED,
        false,
        "Invalid credentials"
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.APP_SUPER_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const userData = user.toJSON();
    delete userData.password;

    return res.success(
      HttpStatus.OK,
      true,
      "Login successful",
      { user: userData, token }
    );
  } catch (error) {
    console.error("Login error:", error);
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Internal server error",
      error
    );
  }
};

module.exports = userController;