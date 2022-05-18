import jwt, { SignOptions } from "jsonwebtoken";
import { accessTokenSecret } from "../config";

export const signJwt = (payload: Object, options: SignOptions = {}) => {
  return jwt.sign(payload, accessTokenSecret, {
    ...(options && options),
  });
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, accessTokenSecret) as T;
  } catch (error) {
    console.error(error)
    return null;
  }
};
