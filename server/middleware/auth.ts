import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../data/User";
import { CustomRequest, CustomResponse } from "../types";
export function validateUser(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
) {
  const AUTH_HEADER = req.headers.authorization;
  const ACCESS_TOKEN = AUTH_HEADER?.split(" ")[1];
  if (!ACCESS_TOKEN) return res.sendStatus(401);
  try {
    req.userInfo = jwt.verify(
      ACCESS_TOKEN,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as User;
  } catch (_e) {
    console.log(_e);
    return res.sendStatus(401);
  }
  next();
}
