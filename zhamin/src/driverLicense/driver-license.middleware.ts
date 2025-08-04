import { body, param } from "express-validator";
import { defaultRequestValidation } from "../middleware";
import { RequestHandler } from "express";


export const validateCreateDriverLicense: RequestHandler[] = [
  body("number")
    .isString()
    .notEmpty()
    .withMessage("License number is required and must be a string"),

  body("issueDate")
    .isISO8601()
    .withMessage("Issue date must be a valid date"),

  body("expiryDate")
    .isISO8601()
    .withMessage("Expiry date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.issueDate)) {
        throw new Error("Expiry date must be after issue date");
      }
      return true;
    }),

  body("userId")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ID"),

  defaultRequestValidation,
];

export const validateUpdateDriverLicense: RequestHandler[] = [
  body("number")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("License number must be a non-empty string"),

  body("issueDate")
    .optional()
    .isISO8601()
    .withMessage("Issue date must be a valid date"),

  body("expiryDate")
    .optional()
    .isISO8601()
    .withMessage("Expiry date must be a valid date")
    .custom((value, { req }) => {
      if (
        new Date(value) <= new Date(req.body.issueDate)
      ) {
        throw new Error("Expiry date must be after issue date");
      }
      return true;
    }),

  defaultRequestValidation,
];

export const validateGetById: RequestHandler[] = [
  param("id")
    .isString()
    .isMongoId()
    .withMessage("Invalid driver license ID format"),
  defaultRequestValidation,
];
