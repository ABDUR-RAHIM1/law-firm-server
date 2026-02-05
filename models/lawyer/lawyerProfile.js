
import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    // barCouncilId: { type: String }, 
    chamberAddress: { type: String },
    designation: { type: String },
    bio: { type: String },
    profilePicture: { type: String },
    specialization: [String],
    socialLinks: {
        facebook: String,
        linkedin: String
    }
});


const profileModel = mongoose.model("Profile", ProfileSchema);
export default profileModel;
