import { Router } from "express";
import { checkUser, forgetPassword, getUser, loginUser, logoutUser, registerUser, verifyUser } from "../controllers/auth.controllers.js";
import { isUserLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", registerUser )
router.post("/login", loginUser )
router.post("/logout", isUserLoggedIn , logoutUser )
router.get("/check-auth", isUserLoggedIn , checkUser )
router.post("/forget-password" , forgetPassword)
router.post("/verify-user",  verifyUser)
router.get("/me" , getUser)

export default router;
