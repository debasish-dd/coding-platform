import { Router } from "express";
import { forgetPassword, getUser, loginUser, registerUser, verifyUser } from "../controllers/auth.controllers.js";

const router = Router()

router.post("/register", registerUser )
router.post("/login", loginUser )
router.post("/forget-password" , forgetPassword)
router.post("/verify-user",  verifyUser)
router.get("/me" , getUser)

export default router;
