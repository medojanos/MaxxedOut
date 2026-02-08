import express from 'express'
import { getWorkoutByQuery, getWorkoutById, addWorkout, deleteWorkout } from "../controllers/workouts.controller.js"
import { authUser} from "../middleware/auth.js";

const router = express.Router();

router.get("/", authUser(), getWorkoutByQuery);
router.get("/:id", authUser(), getWorkoutById);

router.put("/", authUser(), addWorkout);

router.delete("/:id", authUser(), deleteWorkout);

export default router;