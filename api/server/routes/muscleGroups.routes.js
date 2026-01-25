import express from 'express'
import { getAllMuscleGroups } from "../controllers/muscleGroups.controller.js"
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// App

router.get("/", getAllMuscleGroups);

// Admin



export default router;