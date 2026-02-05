import mongoose from "mongoose";
import { MONGO_URI } from "../constans.js";
import LawyerModel from "../models/lawyer/lawyerAuth.js";

 
  

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       dbName: "law-firm",
//     });
//     console.log("✅ MongoDB Connected");

//     // ===== Step 1: Drop old index =====
//     try {
//       await mongoose.connection.collection("lawyerauths").dropIndex("mobile_1");
//       console.log("✅ Old 'mobile' index dropped");
//     } catch (err) {
//       console.log("⚠️ No old index to drop or error:", err.message);
//     }

//     // ===== Step 2: Sync schema indexes =====
//     await LawyerModel.syncIndexes();
//     console.log("✅ Mongoose indexes synced with schema");

//   } catch (error) {
//     console.error("❌ MongoDB Connection Failed:", error.message);
//   }
// };



export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "law-firm"
        });
        console.log("✅ MongoDB Connected");

    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
    }
};
