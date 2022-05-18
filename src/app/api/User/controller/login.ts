import { Request } from "express";
import { loginService } from "../services";

const loginController = async (req: Request) => {
  const { password, email } = req.body;

  const { error, data } = await loginService({
    password,
    email,
  });

  if (error) {
    return {
      error,
      status: 401,
    };
  }

  return {
    data,
    message: "Welcome back",
  };
};

export { loginController };
