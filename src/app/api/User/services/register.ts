import userRepo from "../repository";
import { hash } from "bcrypt";

export const registerService = async ({
  name,
  username,
  email,
  password,
}: {
  username: string;
  name: string;
  email: string;
  password: string;
}) => {
  try {
    let [emailFound, usernameFound] = await Promise.all([
      await userRepo.findUserByEmail(email),
      await userRepo.findUserByUsername(username),
    ]);

    if (emailFound)
      return {
        error: "Email alreay exists",
      };

    if (usernameFound)
      return {
        error: "Username alreay exists",
      };

    let hashedPassword = await hash(password, 10);

    await userRepo.create({
      username,
      password: hashedPassword,
      email,
      name,
    });

    return {
      user: {
        email,
        username,
      },
    };
  } catch (error) {
    throw error;
  }
};
