import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection

    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
}