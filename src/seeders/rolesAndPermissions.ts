import mongoose from "mongoose";
import "dotenv/config";
import { mongoConnectionString } from "../config";

import Role from "../models/role.model";

import { roles } from "../constants/rolesAndPermissions";

const seed = async () => {
  await mongoose.connect(mongoConnectionString);
  console.log("Seeders starts");
  await Role.deleteMany({});
  await Role.insertMany(Object.values(roles));
  console.log("Seeders End");
  return process.exit();
};
seed();
