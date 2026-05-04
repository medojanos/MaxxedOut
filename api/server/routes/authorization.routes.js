import express from 'express';
import { authU, authA } from "../controllers/authorization.controller.js";
import { authUser, authAdmin } from "../middleware/auth.js";
import { registerUser, loginUser, forgotPassword, resetPassword, verifyCode, refreshAccessToken } from "../controllers/authorization.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-code", verifyCode);

router.post("/refresh", refreshAccessToken);

router.get("/", authUser(), authU);

router.get("/admin", authAdmin(), authA);

export default router;