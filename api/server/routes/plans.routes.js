import express from 'express'
import { getPlans, getPlanById, getPlanInfo, addPlan, updatePlan, deletePlan } from "../controllers/plans.controller.js"
import { authUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authUser(), getPlans);
router.get("/info/:id", authUser(), getPlanInfo);
router.get("/:id", authUser(), getPlanById);

router.post("/", authUser(), addPlan);

router.patch("/:id", authUser(), updatePlan);

router.delete("/:id", authUser(), deletePlan);

export default router;