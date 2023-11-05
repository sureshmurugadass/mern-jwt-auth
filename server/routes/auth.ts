import express from "express";
import {
  generateNewToken,
  login,
  logout,
  register,
} from "../controller/AuthController";
import { validateUser } from "../middleware/auth";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", [validateUser, logout]);
router.get("/generate-new-token", generateNewToken);

export default router;
