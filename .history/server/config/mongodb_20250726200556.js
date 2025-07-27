import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.conne

    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
}