import {body, param, query} from 'express-validator';
import {defaultRequestValidation} from "../middleware";
import {SortBy, Order} from "./car.dto";
import {RequestHandler} from "express";
import { currentYear } from './car.constants';

export const validateCreateCar: RequestHandler[] = [
    body('brand')
        .isString()
        .notEmpty()
        .withMessage('Brand is required and must be a string'),

    body('name')
        .isString()
        .notEmpty()
        .withMessage('Name is required and must be a string'),

    body('year')
        .isInt({ min: 1900, max: currentYear })
        .withMessage(`Year must be between 1900 and ${currentYear}`),

    body('rate')
        .isInt({ min: 0 })
        .withMessage('Rate must be a positive integer'),

    body('image')
        .isURL()
        .withMessage('Image must be a valid url'),

    defaultRequestValidation
];

export const validateUpdateCar: RequestHandler[] = [
    body('brand')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Brand must be a non-empty string'),

    body('name')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Name must be a non-empty string'),

    body('year')
        .optional()
        .isInt({ min: 1900, max: currentYear })
        .withMessage(`Year must be between 1900 and ${currentYear}`),

    body('rate')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Rate must be a non-negative integer'),

    body('image')
        .optional()
        .isURL()
        .withMessage('Image must be a valid url'),

    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Field isActive must be boolean'),

    defaultRequestValidation
];

export const validateFilters: RequestHandler[] = [
  query('sort_by')
    .optional()
    .isIn(Object.values(SortBy))
    .withMessage(`sort_by must be one of: ${Object.values(SortBy).join(', ')}`),

  query('order')
    .optional()
    .isIn(Object.values(Order))
    .withMessage(`order must be one of: ${Object.values(Order).join(', ')}`),

  query('min_price')
    .optional()
    .isInt({ min: 0 })
    .withMessage('min_price must be a valid non-negative integer'),

  query('max_price')
    .optional()
    .isInt({ min: 0 })
    .withMessage('max_price must be a valid non-negative integer')
    .custom((value, { req }) => {
      if (req.query?.min_price > value) {
        throw new Error('max_price cannot be less than min_price');
      }
      return true;
    }),
  query('min_yaer')
    .optional()
    .isInt({ min: 1900, max: currentYear})
    .withMessage(`min_year the year range must be from 1900 to ${currentYear}.`),

  query('max_year')
    .optional()
    .isInt({ min: 1900, max: currentYear })
    .withMessage(`max_year the year range must be from 1900 to ${currentYear}.`)
    .custom((value, { req }) => {
      if (req.query?.min_price > value) {
        throw new Error('max_year cannot be less than min_year');
      }
      return true;
    }),
];

export const validateGetById: RequestHandler[] = [
    param('id')
        .isString()
        .isMongoId()
        .withMessage('Invalid car id format'),

    defaultRequestValidation
];
