import { ObjectId } from "mongoose";
import { IRole } from "./role";

export interface IUser {
  id: ObjectId;
  name: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: IRole;
}
