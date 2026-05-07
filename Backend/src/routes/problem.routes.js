import { Router } from "express";
import { isAdmin, isUserLoggedIn } from "../middlewares/auth.middleware.js";
import { check, createProblem, deleteProblem, getAllProblems, getProblemById, updateProblem } from "../controllers/problem.controllers.js";

const router = Router()

router.use(isUserLoggedIn)

router.post("/create-problem",isAdmin, createProblem)
router.get("/check", isAdmin, check)
router.get("/get-all-problems", getAllProblems)
router.get("/get-problem/:id", getProblemById)
router.get("/delete-problem/:id", isAdmin, deleteProblem)
router.get("/update-problem/:id", isAdmin, updateProblem)
export default router