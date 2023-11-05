import User from "../data/User";
import {
  addUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../data/UserHelper";
import { CustomRequest, CustomResponse } from "../types";
import { v4 as uuid } from "uuid";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY =
  (process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS as unknown as number) || 30;
const REFRESH_TOKEN_EXPIRY =
  (process.env.REFRESH_TOKEN_EXPIRY_IN_SECONDS as unknown as number) || 600;
export async function register(req: CustomRequest, res: CustomResponse) {
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
export async function login(req: CustomRequest, res: CustomResponse) {
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
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  const refreshtoken = jwt.sign(
    data,
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  // update token
  user.token = refreshtoken;
  updateUser(user);
  res
    .status(200)
    .cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRY * 1000,
    })
    .json({
      data: data,
      accesstoken: accesstoken,
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY * 1000),
    });
}
export function logout(req: CustomRequest, res: CustomResponse) {
  if (!req.userInfo?.id) return res.sendStatus(404);
  const user = getUserById(req.userInfo.id) as User;
  user.token = undefined;
  updateUser(user);
  res.clearCookie("refreshtoken").sendStatus(200);
}
export function generateNewToken(req: CustomRequest, res: CustomResponse) {
  const REFRESH_TOKEN = req.cookies.refreshtoken as string;
  if (!REFRESH_TOKEN) return res.sendStatus(401);
  try {
    const user = jwt.verify(
      REFRESH_TOKEN,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as User;
    const data = { id: user.id, name: user.name, email: user.email };

    const accesstoken = jwt.sign(
      data,
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    res
      .status(200)
      .json({
        data: data,
        accesstoken: accesstoken,
        expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY * 1000),
      });
  } catch (_e) {
    res.sendStatus(401);
  }
}
