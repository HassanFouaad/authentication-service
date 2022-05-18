import { registerController } from "./register";
import { loginController } from "./login";
import {
  logoutFromAllSessionsController,
  logoutFromSingleSessionController,
} from "./logout";
import { successResponseController } from "./protected";
import { meController } from "./me";

const userController = {
  register: registerController,
  login: loginController,
  logout: logoutFromSingleSessionController,
  logoutAll: logoutFromAllSessionsController,
  successResponseController,
  me: meController,
};

export default userController;
