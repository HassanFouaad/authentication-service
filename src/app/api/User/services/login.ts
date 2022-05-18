import userRepo from "../repository";
import { compare } from "bcrypt";
import { signUserAndGenerateToken } from "../utils/auth";
export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    /// Finding if the account exists
    const user = await userRepo.findUserByEmail(email);

    if (!user) return { error: "Invalid email or password" };
    /// Password validating
    let validPassword = await compare(password, user.password);
    if (!validPassword) return { error: "Invalid email or password" };

    // Generating new user token
    const { accessToken } = await signUserAndGenerateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    /// Returns the data to the client
    return {
      data: {
        token: accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};
