import express from "express";
import { generateNewToken, login, logout } from "../controller/AuthController";
const router = express.Router();

router.get("/login", login);
router.get("/logout", logout);
router.get("/generate-new-token", generateNewToken);

export default router;
