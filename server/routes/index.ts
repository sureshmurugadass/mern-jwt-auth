import { Express } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import { validateUser } from "../middleware/auth";

export default function configureRoutes(app: Express) {
  app.use("/auth", authRoutes);
  app.use("/user", [validateUser, userRoutes]);
}
