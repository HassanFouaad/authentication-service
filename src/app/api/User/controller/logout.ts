import { Request, Response } from "express";
import {
  logoutFromSingleSessionService,
  logoutFromAllSessionsService,
} from "../services";

export const logoutFromSingleSessionController = async (
  _: Request,
  res: Response
) => {
  const user = res.locals.user;
  const sessionId = res.locals.sessionId;
  await logoutFromSingleSessionService(user?.id, sessionId);
  return {
    message: "Success",
  };
};

export const logoutFromAllSessionsController = async (
  _: Request,
  res: Response
) => {
  const user = res.locals.user;

  await logoutFromAllSessionsService(user?.id);
  return {
    message: "Success",
  };
};
