const express=require("express")
const adminController=require("../controllers/admin.controller")
const adminRouter=express.Router()

adminRouter.route("/register").post(adminController.register);

adminRouter.post("/login",adminController.login);

module.exports=adminRouter;