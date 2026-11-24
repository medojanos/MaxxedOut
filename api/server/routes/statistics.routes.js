import express from 'express'
import { getStatistics, getAllExercisesWithStats } from "../controllers/statistics.controller.js"
import { authUser} from "../middleware/auth.js";

const router = express.Router();

router.get("/", authUser(), getStatistics);
router.get("/getExercises", authUser(), getAllExercisesWithStats);

export default router;