import { NextFunction, Request, Response } from "express";
import { getUserRoleById } from "../user/user.service";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { UserRole } from "../user/user.constats";
import { errors } from "./constants";

export const appErrorHandler = (err: Error, req: Request) => {
  console.error(err?.stack);
  console.error(req);
};

export const defaultRequestValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).send({ errors: errors.array() });
    return;
  }
  next();
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const isValidToken = authHeader && Types.ObjectId.isValid(authHeader);

  if (!authHeader) {
    res.status(StatusCodes.UNAUTHORIZED).send(errors.noToken);
    return;
  }
  if (!isValidToken) {
    res.status(StatusCodes.UNAUTHORIZED).send(errors.invalidToken);
    return;
  }

  const userRole = await getUserRoleById(authHeader);
  if (!userRole) {
    res.status(StatusCodes.UNAUTHORIZED).send(errors.userNotFound);`
    return;`
  }
  req.user = { id: authHeader, role: userRole?.role };

  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const isUserAdmin = req.user?.role === UserRole.ADMIN;
  if (!isUserAdmin) {
    res.status(StatusCodes.FORBIDDEN).send(errors.noRights);
    return;
  }
  next();
};


