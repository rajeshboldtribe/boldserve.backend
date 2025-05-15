const{DataTypes}=require("sequelize");
const sequelize=require("../config/db");

const category=sequelize.define
("category",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
    }
});


sequelize
.sync({ alter : false })
.then(() => {
  console.log("category table created successfully!");
})
.catch((error) => {
  console.error("Unable to create table : ", error);
});

module.exports=category;