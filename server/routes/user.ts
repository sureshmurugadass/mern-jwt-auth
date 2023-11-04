import express from "express";
import { getUsers, getUser } from "../controller/UserController";
const router = express.Router();

router.get("/get-users", getUsers);
router.get("/get-user-by-id", getUser);

export default router;
