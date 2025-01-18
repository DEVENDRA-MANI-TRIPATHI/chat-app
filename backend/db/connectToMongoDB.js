import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to mongoDB");
    } catch (error) {
        console.log("Error in connecting to MongoDB",error.mongoose)
    }
}

export default connectToMongoDB;