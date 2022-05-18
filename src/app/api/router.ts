import { Router } from "express";

import { userRouter, userBaseRoute } from "./User/router";

const baseRouter = Router();

baseRouter.use(userBaseRoute, userRouter);

export { baseRouter as apiBaseRouter };
