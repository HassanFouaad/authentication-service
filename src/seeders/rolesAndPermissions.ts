import mongoose from "mongoose";
import "dotenv/config";
import { mongoConnectionString } from "../config";

import Role from "../models/role.model";

import { roles } from "../constants/rolesAndPermissions";

const seed = async () => {
  await mongoose.connect(mongoConnectionString);
  await Role.deleteMany({});

  return await Role.insertMany(Object.values(roles));
};
seed();
