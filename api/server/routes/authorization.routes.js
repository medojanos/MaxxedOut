import express from 'express'
import { authU, authA } from "../controllers/authorization.controller.js"
import { authUser, authAdmin } from "../middleware/auth.js"

const router = express.Router();

// App

router.get("/", authUser(), authU);

// Admin

router.get("/admin", authAdmin(), authA);

export default router;