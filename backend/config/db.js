const mongoose = require("mongoose");
require("dotenv").config(); // Load .env values

const connection = async () => {
  try {
    console.log("MongoDB connection string:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Successfully connected to MongoDB.");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connection;
