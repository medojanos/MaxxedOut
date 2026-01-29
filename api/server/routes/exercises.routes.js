import express from 'express'
import { getAllExercises, getExerciseById, getAllExercisesAdmin, addMuscleGroup, updateMuscleGroup, deleteMuscleGroup, addExercise, updateExercise, deleteExercise } from "../controllers/exercises.controller.js"
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin

router.get("/admin", authAdmin(), getAllExercisesAdmin);

router.post("/admin", authAdmin(), addExercise);
router.post("/admin/musclegroup", authAdmin(), addMuscleGroup);

router.put("/admin", authAdmin(), updateExercise);
router.put("/admin/musclegroup", authAdmin(), updateMuscleGroup);

router.delete("/admin/:id", authAdmin(), deleteExercise);
router.delete("/admin/musclegroup", authAdmin(), deleteMuscleGroup);

// App

router.get("/", getAllExercises);
router.get("/:id", getExerciseById);

export default router;