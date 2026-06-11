import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const conectdb = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

export default conectdb;