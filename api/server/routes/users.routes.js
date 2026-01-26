import express from 'express'
import { Register, Login, forgotPassword, resetPassword, verifyCode, updateUser, deleteUser, getUsers, addUser, updateUserFromId , deleteUserFromId } from "../controllers/users.controller.js"
import { authUser, authAdmin } from "../middleware/auth.js";

const router = express.Router();

// App

router.post("/register", Register);
router.post("/login", Login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-code", verifyCode);

router.patch("/user", authUser(), updateUser);

router.delete("/user", authUser(), deleteUser);

// Admin

router.get("/user/admin", authAdmin(), getUsers);

router.post("/user/admin", authAdmin(), addUser);

router.patch("/user/admin", authAdmin(), updateUserFromId);

router.delete("/user/admin", authAdmin(), deleteUserFromId);

export default router;