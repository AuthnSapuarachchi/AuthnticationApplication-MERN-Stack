import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on

    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
}