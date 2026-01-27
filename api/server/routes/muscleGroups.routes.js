import express from 'express'
import { getAllMuscleGroups, addMuscleGroup, updateMuscleGroup, deleteMuscleGroup } from "../controllers/muscleGroups.controller.js"
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// App

router.get("/", getAllMuscleGroups);

// Admin

router.post("/admin", authAdmin(), addMuscleGroup);

router.put("/admin", authAdmin(), updateMuscleGroup);

router.delete("/admin", authAdmin(), deleteMuscleGroup);

export default router;