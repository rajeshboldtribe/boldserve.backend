const httpStatus=require("../enums/httpStatusCode.enum");
const category=require("../models/category.model");
const subCategory=require("../models/subCategory.model");
const product=require("../models/product.model");
const { where } = require("sequelize");

const productController={};

productController.addService=async(req,res)=>{
    try{
        const{categoryName,subcategoryName,name,price,description,offers}=req.body;
        const images=req.files?req.files.map(file=>file.path):[];

        if(!categoryName || !subcategoryName || !name || !price){
            return res.error(
                httpStatus.BAD_REQUEST,
                false,
                "category, subcategory, name and price are required "
            );
        } 
          if(images.length >6){            //validation for image count
            return res.error(
                httpStatus.BAD_REQUEST,
                false,
                "Maximum 6 images allowed"
            );
          } 

          const[categoryData]=await        //find and create category
          category.findOrCreate({
            where:{name:categoryName}
          });

          const[subcategoryData]=await      //find and create subcategory
          subCategory.findOrCreate({
            where:{name:subcategoryName,
                categoryId:categoryData.id
            }
          });
        
          const newProduct=await product.create    /////create the product
          ({
            name,
            price,
            description,
            offers,
            images,
            subcategoryId:subcategoryData.id,
            status:true
          });

          return res.success(
            httpStatus.CREATED,
            true,
            "Service added successfully",
            newProduct
          );
        }catch(error){
            console.error("Error adding service:",error);
            return res.error(
                httpStatus.INTERNAL_SERVER_ERROR,false,"Internal server error",
                error
            )
        }
    };


    //....................get all products 
    productController.getAllProducts=async(req,res)=>{
      try{
        const products=await product.findAll({
          include:[{
            model:subCategory,
            include:[{
              model:category
            }]
          }],
          where:{status:true}
        });

        return res.success(
          httpStatus.OK,
          true,
          "Products fetched successfully",
          products
        );
      } catch(error){
        console.error("Error fetching products:",error);
        return res.error(
          httpStatus.INTERNAL_SERVER_ERROR,
          false,"Interenal server error"
        );
      }
    };

    //Delete product
productController.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.error(
        httpStatus.BAD_REQUEST,
        false,
        "Product ID is required"
      );
    }

    // Find the product
    const productToDelete = await product.findByPk(id);

    if (!productToDelete) {
      return res.error(
        httpStatus.NOT_FOUND,
        false,
        "Product not found"
      );
    }

    // Soft delete by updating status to false
    await productToDelete.update({ status: false });

    return res.success(
      httpStatus.OK,
      true,
      "Product deleted successfully",
      { id: productToDelete.id }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.error(
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Internal server error",
      error
    );
  }
};

// Get user profile
productController.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.error(
        httpStatus.BAD_REQUEST,
        false,
        "User ID is required"
      );
    }

    // Find the user
    const userProfile = await user.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'fullName', 'phone', 'address', 'profileImage', 'createdAt'],
      include: [
        {
          model: order,
          attributes: ['id', 'orderDate', 'status', 'total'],
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!userProfile) {
      return res.error(
        httpStatus.NOT_FOUND,
        false,
        "User not found"
      );
    }

    return res.success(
      httpStatus.OK,
      true,
      "User profile fetched successfully",
      userProfile
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.error(
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Internal server error",
      error
    );
  }
};



    module.exports=productController

