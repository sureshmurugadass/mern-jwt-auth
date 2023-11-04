import express from "express";
import {
  generateNewToken,
  login,
  logout,
  register,
} from "../controller/AuthController";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/generate-new-token", generateNewToken);

export default router;
