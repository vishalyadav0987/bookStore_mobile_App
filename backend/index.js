const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const connectDB = require("./connectDB/connect");
const authUserRoutes = require("./routes/authUserRoutes");
const bookRoutes = require("./routes/bookRoutes");

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  timeout: 120000,
});
app.use("/api/v1/auth", authUserRoutes);
app.use('/api/v1/books', bookRoutes);

app.use("/test", (req, res) => {
  res.send("<h1>This route is used for testing purposes. Yeah, it's working!</h1>");
});



const server = require("http").createServer(app);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Something went wrong in connecting to the server:", error.message);
  }
};

start();