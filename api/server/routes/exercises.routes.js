import express from 'express'
import { getAllExercises, getExerciseById, addMuscleGroup, updateMuscleGroup, deleteMuscleGroup, addExercise, updateExercise, deleteExercise } from "../controllers/exercises.controller.js"
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// App

router.get("/", getAllExercises);
router.get("/:id", getExerciseById);

// Admin

router.post("/admin", authAdmin(), addExercise);
router.post("/admin/musclegroup", authAdmin(), addMuscleGroup);

router.patch("/admin", authAdmin(), updateExercise);
router.patch("/admin/musclegroup", authAdmin(), updateMuscleGroup);

router.delete("/admin", authAdmin(), deleteExercise);
router.delete("/admin/musclegroup", authAdmin(), deleteMuscleGroup);

export default router;