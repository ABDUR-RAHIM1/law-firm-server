import Case from "../../models/lawyer/CasesModel.js";



// ১. নতুন মামলা তৈরি করা (Add Case)
export const createCase = async (req, res) => {
    try {
        const { userId, username } = req.user; // lawyer _id 
        const {
            caseNumber, caseTitle, clientName, clientPhone,
            partySide, court, nextDate
        } = req.body;


        // ভ্যালিডেশন
        if (!caseNumber || !caseTitle || !clientName || !userId) {
            return res.status(400).json({ message: "প্রয়োজনীয় সব তথ্য প্রদান করুন" });
        };


        const trackingId = `${username}-${caseNumber}`;

        const newCase = new Case({
            caseNumber,
            caseTitle,
            clientName,
            clientPhone,
            partySide,
            court,
            nextDate,
            lawyerId: userId,
            status: "চলমান",
            trackingId
        });

        const savedCase = await newCase.save();
        res.status(201).json({
            success: true,
            message: "মামলাটি সফলভাবে যোগ করা হয়েছে",
            data: savedCase
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};

//  =========  Update Case History =============


export const updateCaseHistory = async (req, res) => {
    try {
        const { id } = req.params; // মামলার আইডি
        const { nextOrder, nextDate, note, isImportant, court } = req.body;

        // ১. ভ্যালিডেশন: পরবর্তী তারিখ এবং আদেশ থাকা জরুরি
        if (!nextDate || !nextOrder) {
            return res.status(400).json({
                success: false,
                message: "পরবর্তী তারিখ এবং পরবর্তী আদেশ প্রদান করা বাধ্যতামূলক।"
            });
        }

        // ২. ডাটাবেস আপডেট লজিক
        const updatedCase = await Case.findByIdAndUpdate(
            id,
            {
                // মেইন ফিল্ডগুলো আপডেট (যা ড্যাশবোর্ড বা কজ-লিস্টে দেখাবে)
                $set: {
                    nextDate: nextDate,
                    court: court,
                    isImportant: isImportant,
                    currentStage: nextOrder // মামলার বর্তমান ধাপ হিসেবে nextOrder সেট করা
                },
                // হিস্ট্রি অ্যারেতে নতুন রেকর্ড যোগ করা (আর্কাইভ হিসেবে)
                $push: {
                    history: {
                        nextDate: nextDate,
                        nextOrder: nextOrder,
                        note: note,
                        isImportant: isImportant,
                        court: court
                    }
                }
            },
            { new: true, runValidators: true } // আপডেটেড ডাটা রিটার্ন করবে
        );

        if (!updatedCase) {
            return res.status(404).json({
                success: false,
                message: "এই আইডির কোনো মামলা খুঁজে পাওয়া যায়নি।"
            });
        }

        return res.status(200).json({
            success: true,
            message: "মামলার ইতিহাস এবং পরবর্তী তারিখ সফলভাবে আপডেট করা হয়েছে",
            data: updatedCase
        });

    } catch (error) {
        console.error("Update Case Error:", error);
        return res.status(500).json({
            success: false,
            message: "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।"
        });
    }
};

//  =========  Update Case History ^ =============


//  =========  Case Details by Case ID (protected) =================
export const getCaseDetails = async (req, res) => {
    try {
        const { caseId } = req.params;
        const lawyerId = req.user.userId;

       
        const caseDetails = await Case.findOne({
            _id: caseId,
            lawyerId: lawyerId
        });
      
        if (!caseDetails) {
            return res.status(404).json({
                success: false,
                message: "মামলাটি খুঁজে পাওয়া যায়নি অথবা আপনার এই তথ্য দেখার অনুমতি নেই।"
            });
        }

        return res.status(200).json(caseDetails);


    } catch (error) {
        console.error("Get Case Details Error:", error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "অকার্যকর মামলার আইডি (Invalid Case ID)"
            });
        }

        return res.status(500).json({
            success: false,
            message: "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।"
        });
    }
};

//  =========  Case Details by Case ID (protected) ^ ===============



// ২. মামলার ফলাফল আপডেট করা (Add Result)
export const updateCaseToResult = async (req, res) => {
    try {
        const { id } = req.params; // মামলার ID
        const { disposedDate, resultStatus, judgmentNote, documentLink } = req.body;

        // মামলাটি খুঁজে বের করে আপডেট করা
        const updatedCase = await Case.findByIdAndUpdate(
            id,
            {
                disposedDate,
                resultStatus,
                judgmentNote,
                documentLink,
                status: "নিষ্পত্তি", // স্ট্যাটাস পরিবর্তন করে আর্কাইভ করা হলো
                nextDate: null      // নিষ্পত্তি হয়ে গেলে আর পরবর্তী তারিখ থাকে না
            },
            { new: true } // আপডেটেড ডাটা রিটার্ন করবে
        );

        if (!updatedCase) {
            return res.status(404).json({ message: "মামলাটি খুঁজে পাওয়া যায়নি" });
        }

        res.status(200).json({
            success: true,
            message: "মামলার ফলাফল সফলভাবে সংরক্ষিত হয়েছে",
            data: updatedCase
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৩. চলমান মামলার লিস্ট পাওয়া (For Case List Page)
export const getRunningCases = async (req, res) => {
    try {
        const { userId: lawyerId } = req.user; // lawyer

        const cases = await Case.find({ lawyerId, status: "চলমান" }).sort({ nextDate: 1 });
        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ৪. নিষ্পত্তি হওয়া মামলার লিস্ট পাওয়া (For Results Page)
export const getDisposedCases = async (req, res) => {
    try {
        const { lawyerId } = req.query;
        const cases = await Case.find({ lawyerId, status: "নিষ্পত্তি" }).sort({ disposedDate: -1 });
        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};