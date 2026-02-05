import express from "express";
import {
    createCase,
    updateCaseToResult,
    getRunningCases,
    getDisposedCases,
    updateCaseHistory,
    getCaseDetails
} from "../../controllers/lawyer/addCase.Controller.js";
import { authGaurd } from "../../middlewere/authGuard.js";
const router = express.Router();

// কন্ট্রোলার ইমপোর্ট (আপনার ফাইল পাথ অনুযায়ী পরিবর্তন করে নেবেন)


/**
 * @route   POST /api/cases/add
 * @desc    নতুন মামলা তৈরি করা (Add Case Modal থেকে আসবে)
 */
router.post("/add", authGaurd, createCase);
router.put("/updateHistory/:id", authGaurd, updateCaseHistory);


/**
 * @route   GET /api/cases/getDetails/:id
 * @desc     আইনজীবী তার নিজের মামলার বিস্তারিত ইতিহাস দেখতে পারবে 
 */
router.get("/getDetails/:caseId", authGaurd, getCaseDetails);

/**
 * @route   PUT /api/cases/add-result/:id
 * @desc    চলমান মামলাকে ফলাফল দিয়ে নিষ্পত্তি করা (Add Result Modal থেকে আসবে)
 */
router.put("/add-result/:id", updateCaseToResult);

/**
 * @route   GET /api/cases/running
 * @desc    আইনজীবীর সকল চলমান মামলার লিস্ট পাওয়া
 */
router.get("/running", authGaurd, getRunningCases);

/**
 * @route   GET /api/cases/disposed
 * @desc    আইনজীবীর সকল নিষ্পত্তি হওয়া (আর্কাইভ) মামলার লিস্ট পাওয়া
 */
router.get("/disposed", getDisposedCases);

export default router;