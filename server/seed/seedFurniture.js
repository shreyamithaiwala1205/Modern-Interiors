const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Furniture = require("../models/Furniture");
const furnitureData = require("./furnitureData");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // Existing data delete
    await Furniture.deleteMany();

    // Insert new data
    await Furniture.insertMany(furnitureData);

    console.log("✅ Furniture Data Imported Successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  importData();
});