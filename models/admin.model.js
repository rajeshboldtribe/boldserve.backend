const{DataTypes}=require("sequelize");
const sequelize=require("../config/db");

const admin = sequelize.define(
    "admin",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            } ,
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            }, 
        phone_no:{
            type:DataTypes.STRING,
            allowNull:false,
            },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
            },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            },
        
    }
);    

sequelize
.sync({ alter : false })
.then(() => {
  console.log("admin table created successfully!");
})
.catch((error) => {
  console.error("Unable to create table : ", error);
});

module.exports = admin;
 