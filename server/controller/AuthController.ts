import User from "../data/User";
import { addUser, getUserByEmail, updateUser } from "../data/UserHelper";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req: Request, res: Response) {
  const name = req.body.name as string;
  const password = req.body.password as string;
  const email = req.body.email as string;
  if (!Boolean(name) || !Boolean(password) || !Boolean(email)) {
    return res.status(400).json("Missing Required fields");
  }
  if (getUserByEmail(email) !== undefined) {
    return res.status(409).json("Mail id already exists");
  }
  const encryptedPassword = await bcryptjs.hash(password, 10);
  const user: User = {
    id: uuid(),
    name: name,
    password: encryptedPassword,
    email: email,
  };
  addUser(user);
  res.status(200).json(user);
}
export async function login(req: Request, res: Response) {
  const email = req.body.email as string;
  const password = req.body.password as string;
  if (!Boolean(password) || !Boolean(email)) {
    return res.status(400).json("Missing Required fields");
  }
  const user = getUserByEmail(email);
  if (user === undefined) return res.status(404).json("Email id not exists");

  const verify = await bcryptjs.compare(password, user?.password as string);
  if (!verify) return res.status(401).json("Invalid crediential");

  const data = { id: user.id, name: user.name, email: user.email };

  const accesstoken = jwt.sign(
    data,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "30s" }
  );
  const refreshtoken = jwt.sign(
    data,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "10m" }
  );
  // update token
  user.token = refreshtoken;
  updateUser(user);
  res
    .status(200)
    .cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({ data: data, accesstoken: accesstoken });
}
export function logout() {}
export function generateNewToken() {}
export function validateUser(req: Request, res: Response, next: any) {
  const AUTH_HEADER = req.headers.authorization;
  const TOKEN = AUTH_HEADER?.split(" ")[1];
  if (!TOKEN) return res.sendStatus(401);
  try {
    jwt.verify(TOKEN, process.env.ACCESS_TOKEN_SECRET as string);
    next();
  } catch (_e) {
    res.sendStatus(401);
  }
}
