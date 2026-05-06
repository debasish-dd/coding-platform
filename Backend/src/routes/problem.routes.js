import { Router } from "express";
import { isAdmin, isUserLoggedIn } from "../middlewares/auth.middleware.js";
import { check, createProblem } from "../controllers/problem.controllers.js";

const router = Router()

router.use(isUserLoggedIn)

router.post("/create-problem",isAdmin, createProblem)
router.get("/check", isAdmin, check)
export default router