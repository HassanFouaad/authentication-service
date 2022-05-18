import { ObjectId } from "mongoose";
import { logoutFromAllSessionsService } from ".";
import userRepo from "../repository";

export const meService = async (userId: ObjectId) => {
  const user = await userRepo.findUserById(userId);

  if (user) return { user };
  await logoutFromAllSessionsService(userId)
  return { error: "Your account has been deleted" };
};
