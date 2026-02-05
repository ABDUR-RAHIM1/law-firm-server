import jwt from "jsonwebtoken";

export const authGaurd = async (req, res, next) => {
    try {

        const accessToken = req.cookies.accessToken;
     
        // ২. টোকেন না থাকলে এরর দেওয়া
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "প্রবেশাধিকার নেই! অনুগ্রহ করে পুনরায় লগইন করুন।"
            });
        }

        // ৩. টোকেন ভেরিফাই করা
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "আপনার সেশন শেষ হয়ে গেছে, আবার লগইন করুন।"
                });
            };

            req.user = decoded;

            next();
        });

    } catch (error) {
        console.error("Auth Guard Error:", error);
        return res.status(500).json({
            success: false,
            message: "সার্ভার এরর!"
        });
    }
}