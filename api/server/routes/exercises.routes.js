import express from 'express'
import { getAllExercises, getExerciseById } from "../controllers/exercises.controller.js"
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// App

router.get("/", getAllExercises);
router.get("/:id", getExerciseById);

// Admin

export default router;