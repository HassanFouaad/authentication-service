import { Request, Response, NextFunction } from "express";
import { ServerError } from "../../../../core";
import Role from "../../../../models/role.model";

export const hasPermission =
  (permissionName: string) =>
  async (_: Request, res: Response, next: NextFunction) => {
    /// Getting usre role id
    const userRoleId = res.locals.user?.role;
    if (!userRoleId) return next(new ServerError("Not Allowed", 403));

    /// CHecking if allowed
    let allowed = await Role.findOne({
      _id: userRoleId,
      permissions: { $in: [permissionName] },
    });

    if (!allowed) return next(new ServerError("Not Allowed", 403));

    next();
  };
export const hasRole =
  (roleName: string) =>
  async (_: Request, res: Response, next: NextFunction) => {
    /// Getting usre role id
    const userRoleId = res.locals.user?.role;
    if (!userRoleId) return next(new ServerError("Not Allowed", 403));

    /// CHecking if allowed
    let allowed = await Role.findOne({
      _id: userRoleId,
      name: roleName,
    });

    if (!allowed) return next(new ServerError("Not Allowed", 403));

    next();
  };
