const express =require("express");
const productController=require("../controllers/product.controller");
const upload=require("../middlewares/photoUpload.middleware");


const productRouter=express.Router();

productRouter.post("/add-service",upload.array('images',6),productController.addService);
productRouter.get("/get-all",productController.getAllProducts);

module.exports=productRouter;