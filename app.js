const express = require("express");
require("dotenv").config();
const sendResponse = require("./middlewares/response.middleware");
const handleNotFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");
const adminRouter=require("./routes/admin.router");
const productRouter=require("./routes/product.router");
const meetingRoomRouter = require("./routes/meetingRoom.routes");
const userRouter = require("./routes/user.router");
const seedMeetingRooms = require('./seeders/meetingRoomSeeder');
const sequelize = require('./config/db');

const app = express();
const port = process.env.APP_PORT;
const baseUrl = process.env.BASE_URL;

// CORS configuration .................
app.use(cors({
  origin: '*', // Allow all origins, or specify allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const fs=require('fs'); 
const uploadDir='uploads/products';
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir,{recursive:true});
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sendResponse);

// router middlewares  
app.use("/admin", adminRouter);
app.use("/product",productRouter);
app.use('/api/meeting-rooms', meetingRoomRouter);
app.use("/user", userRouter);

//serve uploaded images statically
app.use('/uploads',express.static('uploads'));

// Middleware for handling 404 errors for API routes
app.use(handleNotFound);

// Middleware for handling catch errors for API routes
app.use(errorHandler);

async function startServer() {
  try {
    // First, authenticate the database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Then sync all models with the database
    await sequelize.sync({ alter: false });
    console.log('All models were synchronized successfully.');
    
    // Now run the seeders after tables are created
    console.log('Starting to seed meeting rooms...');
    await seedMeetingRooms();
    console.log('Finished seeding meeting rooms.');
    
    app.listen(port, () => {
      console.log(`Server running at : ${baseUrl}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database or sync models:", error);
  }
}

startServer();
