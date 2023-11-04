import express from "express";
import { getUsers, getUser } from "../controller/UserController";
const router = express.Router();

router.get("/login", getUsers);
router.get("/logout", getUser);

export default router;
