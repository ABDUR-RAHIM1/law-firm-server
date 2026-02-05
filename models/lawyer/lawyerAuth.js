
import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, required: true, default: "active", enum: ["active", "pending"] },
    role: { type: String, default: 'lawyer' },
    isSubscribed: { type: Boolean, default: false },
    subscriptionPlan: { type: mongoose.Schema.ObjectId, ref: "subscriptions" },
    createdAt: { type: Date, default: Date.now }
});


const LawyerModel = mongoose.model("LawyerAuth", LawyerSchema);

export default LawyerModel;