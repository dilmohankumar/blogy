require('dotenv').config()
const express = require("express");
const app = express();
const PORT =process.env.PORT || 4000;
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser=require("cookie-parser");
const { checkforauthcookie } = require("./middleware/authentication");
const Blog=require("./models/blog");



const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit process with failure
  }
};

// Call the MongoDB connection function
connectToMongoDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkforauthcookie("token"));
app.use(express.static(path.resolve("./public")));


// Set up the view engine and static paths
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async(req, res) => {
  const allBlogs=await Blog.find({});
  try {
    res.render("home",{
      user:req.user,
      blogs:allBlogs,

    });
  } catch (err) {
    console.error("Error rendering the home page", err);
    res.status(500).send("Internal Server Error");
  }
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("An error occurred", err);
  res.status(500).send("Something went wrong. Please try again later.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
