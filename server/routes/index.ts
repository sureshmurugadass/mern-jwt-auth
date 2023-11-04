import { Express } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import { validateUser } from "../controller/AuthController";

export default function configureRoutes(app: Express) {
  app.use("/auth", authRoutes);
  app.use("/user", [validateUser, userRoutes]);
}
