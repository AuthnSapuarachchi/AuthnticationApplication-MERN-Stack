import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.set("strictQuery", false);

    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
}