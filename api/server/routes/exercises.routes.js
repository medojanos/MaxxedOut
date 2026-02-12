import express from 'express'
import { getAllExercises, getExerciseById, getAllExercisesAdmin, addExercise, updateExercise, deleteExercise } from "../controllers/exercises.controller.js"
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin

router.get("/admin", authAdmin(), getAllExercisesAdmin);

router.post("/admin", authAdmin(), addExercise);

router.put("/admin", authAdmin(), updateExercise);

router.delete("/admin/:id", authAdmin(), deleteExercise);

// App

router.get("/", getAllExercises);
router.get("/:id", getExerciseById);

export default router;