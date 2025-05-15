const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// User authentication routes
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;