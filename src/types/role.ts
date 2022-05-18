import { ObjectId } from "mongoose";

export interface IRole {
  id: ObjectId;
  name: string;
  permissions: string;
}
