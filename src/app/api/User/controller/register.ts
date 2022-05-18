import { registerService } from "../services";
import { Request } from "express";
const registerController = async (req: Request) => {
  const { username, name, password, email } = req.body;

  const { error, user } = await registerService({
    username,
    name,
    password,
    email,
  });

  if (error) {
    return {
      error,
      status: 400,
    };
  }

  return {
    data: user,
    message: "User has been created successfully",
  };
};

export { registerController };
