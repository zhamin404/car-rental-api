import { body, param } from "express-validator";
import { UserRole } from "./user.constats";
import { Types } from "mongoose";
import { defaultRequestValidation } from "../middleware";
import { Request, Response, RequestHandler, NextFunction } from "express";
import { errors } from "../middleware/constants";
import { StatusCodes } from "http-status-codes";

export const hasAccess = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).send(errors.noToken);
        return
    }
    const requestedId = req.body.userId || req.params.id;
    const isSameUser = req.user.id === requestedId;
    const isAdmin = req.user.role === UserRole.ADMIN;
    const hasAccess = isSameUser || isAdmin;

    if (!hasAccess) {
        res.status(StatusCodes.FORBIDDEN).send(errors.noRights);
        return
    }

    next();
};

export const validateCreateUser: RequestHandler[] = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Name is required and must be a string"),

  body("email").isEmail().withMessage("A valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  defaultRequestValidation,
];

export const validateUpdateUser: RequestHandler[] = [
  body("name")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Name must be a non-empty string"),

  body("email").optional().isEmail().withMessage("Email must be valid"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  defaultRequestValidation,
];

export const validateFavoriteCarsId: RequestHandler[] = [
  body("favoriteCarsId")
    .optional()
    .isArray()
    .withMessage("Driver license must be an object")
    .custom((id) => {
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new Error(
          "FavoriteCarsId must be an array of valid ObjectId strings"
        );
      }
      return true;
    }),
];

export const validateGetById: RequestHandler[] = [
  param("id").isString().isMongoId().withMessage("Invalid user ID format"),

  defaultRequestValidation,
];
