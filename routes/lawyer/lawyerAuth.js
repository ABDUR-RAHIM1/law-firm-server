import express from "express";
import { loginLawyer, updateLawyer, deleteLawyer, registerLawyer } from "../../controllers/lawyer/authController.js";


const router = express.Router();


//  root =>  "/api/v1/lawyer/auth"
router.post("/register", registerLawyer);
router.post("/login", loginLawyer);
router.put("/update/:id", updateLawyer);
router.delete("/delete/:id", deleteLawyer);

export default router;
