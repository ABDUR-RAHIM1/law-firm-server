
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import lawyerAuth from "../../models/lawyer/lawyerAuth.js";
import { JWT_SECRET } from "../../constans.js";


export const registerLawyer = async (req, res) => {
    try {
        const { username, phone, password } = req.body;

        // 🔍 username OR phone check
        const existingUser = await lawyerAuth.findOne({
            $or: [
                { username: username },
                { phone: phone }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username বা Phone নাম্বার আগেই ব্যবহার করা হয়েছে"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newLawyer = new lawyerAuth({
            username,
            phone,
            password: hashedPassword,
        });

        await newLawyer.save();

        res.status(201).json({ message: "registered successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ====== Login ======
// export const loginLawyer = async (req, res) => {
//     try {
//         const { phone, password } = req.body;

//         const user = await lawyerAuth.findOne({ phone });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid Credentials" });
//         }

//         // password যাচাই
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid email or password" });
//         }

//         // JWT token তৈরি
//         const token = jwt.sign(
//             { userId: user._id, role: user.role },
//             JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//         res.status(200).json({
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 phone: user.phone,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

export const loginLawyer = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await lawyerAuth.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ cookie set
        res.cookie("accessToken", token, {
            httpOnly: true,
            // secure: false,
            // secure: process.env.NODE_ENV === "production",
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });



        res.status(200).json({
            message: "Login successful",
            role: user.role,
            token: true
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" });
    }
};


// ====== Update User ======
export const updateLawyer = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = { ...req.body };

        // যদি password আপডেট করা হয়, hash করে দিতে হবে
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await Auth.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ====== Delete User ======
export const deleteLawyer = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await Auth.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
