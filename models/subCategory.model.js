const{DataTypes}=require("sequelize");
const sequelize=require("../config/db");
const category=require("./category.model");

const subCategory=sequelize.define
("subcategory",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    categoryId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:category,
            key:'id'
        }
    },
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
});

category.hasMany(subCategory);
subCategory.belongsTo(category);

sequelize
.sync({ alter : false })
.then(() => {
  console.log("subCategory table created successfully!");
})
.catch((error) => {
  console.error("Unable to create table : ", error);
});

module.exports=subCategory;