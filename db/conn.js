import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // to use the .env file
// Define an asynchronous function named dbConnection
const dbConnection = async () => {
  try {
    // Attempt to connect to the MongoDB database using the connection string from environment variables
    await mongoose.connect(process.env.ATLAS_URI);
    // Log a success message to the console if the connection is successful
    console.log("Database connected successfully.");
    // Return the mongoose connection object
    return mongoose.connection;
  } catch (error) {
    // Log an error message to the console if the connection fails
    console.error("Error while connecting to database", error);
  }
};

export default dbConnection; // Export the database connection
