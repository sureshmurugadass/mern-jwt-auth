import { Request, Response } from "express";
import User from "../data/User";

export interface CustomRequest extends Request {
  userInfo?: User;
}

export interface CustomResponse extends Response {}
