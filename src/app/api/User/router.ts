import { Router } from "express";
import { controller } from "../../middlewares/controller";
import { validator } from "../../middlewares/validator";

import { registerSchema, loginSchema } from "./schema";

import userController from "./controller";
import { isAuthenticated } from "./utils/auth";
import { hasPermission, hasRole } from "./utils/permission";
import { roles } from "../../../constants/rolesAndPermissions";
import { successResponseController } from "./controller/protected";

const router = Router();

const routes = {
  base: "/user",
  root: "/",
  login: "/login",
  register: "/register",
  me: "/me",
  logout: "/logout",
  logoutAll: "/logout/all",
  superOnly: "/super-admin",
  specificPermission: "/specific-permission",
};

//Register
router.post(
  routes.register,
  validator(registerSchema),
  controller(userController.register)
);

/// Login route
router.post(
  routes.login,
  validator(loginSchema),
  controller(userController.login)
);

/// Protected route to view profile
router.get(
  routes.me,
  isAuthenticated,
  validator({} as any),
  controller(userController.me)
);

//Protected route to logout current session
router.get(
  routes.logout,
  isAuthenticated,
  validator({} as any),
  controller(userController.logout)
);

//Protected route to logout destroy all sessions
router.get(
  routes.logoutAll,
  isAuthenticated,
  validator({} as any),
  controller(userController.logoutAll)
);

//// ROUTE base on ROLE CHECK
router.get(
  routes.superOnly,
  isAuthenticated,
  hasRole(roles.superAdmin.name),
  controller(successResponseController)
);

//// ROUTE base on Specific permission CHECK
router.get(
  routes.specificPermission,
  isAuthenticated,
  hasPermission("PERMISSION_3"),
  controller(successResponseController)
);

const userBaseRoute = routes.base;

export { router as userRouter, userBaseRoute };
