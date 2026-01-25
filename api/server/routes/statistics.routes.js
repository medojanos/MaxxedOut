import express from 'express'
import { getStatistics } from "../controllers/statistics.controller.js"
import { authUser} from "../middleware/auth.js";

const router = express.Router();

router.get("/", authUser(), getStatistics);

export default router;