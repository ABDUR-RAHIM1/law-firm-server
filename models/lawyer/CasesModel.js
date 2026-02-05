import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
    {
        trackingId: { type: String, required: true },
        caseNumber: { type: String, required: true },
        caseTitle: { type: String, required: true },
        clientName: { type: String, required: true },
        clientPhone: { type: String, required: true },
        partySide: { type: String, enum: ["বাদী", "বিবাদী"], required: true },
        court: { type: String, required: true },
        nextDate: { type: Date },
        isImportant: { type: Boolean, default: false },

        // ১. status: এটি মামলার বর্তমান অবস্থা (Main Switch)
        status: {
            type: String,
            enum: ["চলমান", "নিষ্পত্তি"],
            default: "চলমান"
        },

        // ২. currentStage: মামলার বর্তমান ধাপ (যেমন: চার্জ গঠন, সাক্ষ্য গ্রহণ)
        currentStage: {
            type: String,
            default: "প্রাথমিক পর্যায়"
        },

        // ৩. history: মামলার টাইমলাইন বা ইতিহাস (যেটা নিয়ে একটু আগে কথা বললাম)
        history: [
            {
                nextOrder: { type: String },
                nextDate: { type: Date },
                note: { type: String },
                isImportant: { type: String },
                court: { type: String },
            }
        ],

        // ৪. রায়ের তথ্য (শুধুমাত্র status: "নিষ্পত্তি" হলে এগুলো ডাটা পাবে)
        disposedDate: { type: Date, default: null },
        resultStatus: {
            type: String,
            enum: ["বিজয়ী", "পরাজিত", "আপোষ", null],  
            default: null
        },
        judgmentNote: { type: String, default: "" },
        documentLink: { type: String, default: "" },

        lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Case = mongoose.models.Case || mongoose.model('Case', caseSchema);
export default Case;