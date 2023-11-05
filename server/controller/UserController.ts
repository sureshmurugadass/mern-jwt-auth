import { getAllUsers, getUserById } from "../data/UserHelper";
import { Request, Response } from "express";
export function getUsers(_req: Request, res: Response) {
  const users = getAllUsers();
  return res.status(200).json(users);
}
export function getUser(req: Request, res: Response) {
  if (!req.query.id) {
    return res.status(400);
  }
  const user = getUserById(req.query.id as string);
  res.status(200).json(user);
}
