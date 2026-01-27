import express from 'express'
import { getAllMuscleGroups, addMuscleGroup, updateMuscleGroup, deleteMuscleGroup } from "../controllers/muscleGroups.controller.js"
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin

router.post("/admin", authAdmin(), addMuscleGroup);

router.put("/admin", authAdmin(), updateMuscleGroup);

router.delete("/admin", authAdmin(), deleteMuscleGroup);

// App

router.get("/", getAllMuscleGroups);


export default router;