import express from 'express'
import { updateUser, deleteUser, getUsers, addUser, updateUserFromId , deleteUserFromId } from "../controllers/users.controller.js";
import { authUser, authAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin", authAdmin(), getUsers);
router.post("/admin", authAdmin(), addUser);
router.put("/admin", authAdmin(), updateUserFromId);
router.delete("/admin/:id", authAdmin(), deleteUserFromId);

router.patch("/", authUser(), updateUser);
router.delete("/", deleteUser);

export default router;