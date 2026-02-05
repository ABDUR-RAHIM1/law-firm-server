import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();


import { PORT } from "./constans.js";
import { connectDB } from "./config/db.js";
import lawyerAuthRouter from "./routes/lawyer/lawyerAuth.js";
import addCaseRouter from "./routes/lawyer/addCase.route.js";




// App initialization
const app = express();
app.use(cookieParser())
app.use(express.json());

// app.use(cors());
app.use(
    cors({
        origin: "http://localhost:3000", // frontend URL
        credentials: true,
    })
);
app.use(express.json());


// Sample route
app.get("/", (req, res) => {
    res.send("🔷 Law Firm Server is running...");
});

// ======= lawyer ===========
app.use("/api/v1/lawyer/auth", lawyerAuthRouter)
app.use("/api/v1/lawyer/case", addCaseRouter)

// ======= lawyer ===========


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    connectDB()
});

