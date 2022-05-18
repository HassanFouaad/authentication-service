import { Request, Response } from "express";
import { meService } from "../services";

export const meController = async (_: Request, res: Response) => {
  const userId = res?.locals?.user?.id;
  const { user, error } = await meService(userId);

  if (error || !user) return { error, status: 401 };

  return {
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
    },
  };
};
