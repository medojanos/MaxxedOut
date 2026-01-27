import express from 'express'
import { getAllExercises, getExerciseById, getMuscleGroups, addMuscleGroup, updateMuscleGroup, deleteMuscleGroup, addExercise, updateExercise, deleteExercise } from "../controllers/exercises.controller.js"
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin

router.get("/admin", authAdmin(), getMuscleGroups);

router.post("/admin", authAdmin(), addExercise);
router.post("/admin/musclegroup", authAdmin(), addMuscleGroup);

router.put("/admin", authAdmin(), updateExercise);
router.put("/admin/musclegroup", authAdmin(), updateMuscleGroup);

router.delete("/admin", authAdmin(), deleteExercise);
router.delete("/admin/musclegroup", authAdmin(), deleteMuscleGroup);

// App

router.get("/", getAllExercises);
router.get("/:id", getExerciseById);

export default router;