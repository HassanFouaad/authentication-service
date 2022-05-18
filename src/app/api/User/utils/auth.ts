import { Request, Response, NextFunction } from "express";
import { accessTokenExpiresIn } from "../../../../config";
import redisClient from "../../../../connection/redis";
import { ServerError } from "../../../../core";
import { signJwt, verifyJwt } from "../../../../utils/jwt";
import { IRole } from "../../../../types/role";

export const signUserAndGenerateToken = async (user: {
  id: number;
  username: string;
  email: string;
  role: IRole;
}) => {
  // Sign the access token

  let sessionId = String(`AUTH_SESSION_${user.id}_${Date.now()}`);

  const accessToken = signJwt(
    { user, sessionId },
    {
      expiresIn: accessTokenExpiresIn,
    }
  );

  // Create a Session
  await redisClient.hSet(
    `user_sesson_${user.id}`,
    sessionId,
    JSON.stringify({
      token: accessToken,
      user,
    })
  );

  // Return access token
  return { accessToken };
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the token
  let access_token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    access_token = req.headers.authorization.split(" ")[1];
  }

  if (!access_token) {
    return next(new ServerError("Not Authenticated", 401));
  }

  // Validate Access Token
  const decoded = verifyJwt<{
    sessionId: string;
    user: any;
  }>(access_token);

  if (!decoded?.sessionId || !decoded?.user) {
    return next(
      new ServerError(`Invalid access token or user doesn't exist`, 401)
    );
  }

  const { sessionId, user } = decoded;

  // Check if user has a valid session
  const session = await redisClient.hGet(`user_sesson_${user?.id}`, sessionId);

  if (!session) {
    return next(new ServerError(`User session has expired`, 401));
  }

  res.locals.user = user;
  res.locals.sessionId = sessionId;

  next();
};
