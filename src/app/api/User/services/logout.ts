import { ObjectId } from "mongoose";
import redisClient from "../../../../connection/redis";

export const logoutFromSingleSessionService = async (
  userId: ObjectId,
  sessionId: string
) => {
  return await redisClient.HDEL(`user_sesson_${userId}`, sessionId);
};

export const logoutFromAllSessionsService = async (userId: ObjectId) => {
  return await redisClient.del(`user_sesson_${userId}`);
};
