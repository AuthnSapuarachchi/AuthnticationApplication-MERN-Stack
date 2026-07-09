import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js DNS SRV lookup issue on some networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "mern-auth",
    });

    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;