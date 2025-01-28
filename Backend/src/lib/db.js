import mongoose from "mongoose";


export const connectDB=async()=>{
      try {
        const conn=await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected to database");  
    } catch (error) {
        console.log("MongoDb connected error",error);
      }
}