const{DataTypes}=require("sequelize");
const sequelize=require("../config/db");
const subCategory=require("./subCategory.model");

const product=sequelize.define("product",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        description:{
            type:DataTypes.TEXT,
            allowNull:true
        },
        price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false
        },
        offers:{
            type:DataTypes.STRING,
            allowNull:true
        },
        images:{
            type:DataTypes.JSON,
            allowNull:true
        },
        subcategoryId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:subCategory,
                key:'id'
            }
        },
        status:{
            type:DataTypes.BOOLEAN,
            defaultValue:true
        }


    }
)

subCategory.hasMany(product);
product.belongsTo(subCategory);


sequelize
.sync({ alter : false })
.then(() => {
  console.log("product table created successfully!");
})
.catch((error) => {
  console.error("Unable to create table : ", error);
});

module.exports=product;