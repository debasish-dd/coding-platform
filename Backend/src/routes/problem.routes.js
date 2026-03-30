import { Router } from "express";
import { isAdmin, isUserLoggedIn } from "../middlewares/auth.middleware.js";
import { createProblem } from "../controllers/problem.controllers.js";

const router = Router()

router.use(isUserLoggedIn)

router.post("/create-problem", createProblem, isAdmin)

export default router