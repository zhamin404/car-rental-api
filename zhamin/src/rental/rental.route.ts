import { Router } from "express";
import {
  createRentalController,
  getRentalByIdController,
  getRentalsController,
  getAllRentalsController,
  getAvailabilityMessageController,
  updateRentalController,
  canceleRentalController,
  getRentalStatisticsController
} from "./rental.controller";
import { isAdmin } from "../middleware/index";
import {
  validateCreateRental,
  validateRentalDate,
  validateGetById,
  validateCarAvailable,
  validateDataCheckCar,
  validateUpdateRental,
  validateTimeLimit
} from "./rental.middleware";
import { auth } from "../middleware";
import { hasAccessRental } from "./rental.middleware";


export const rentalRouter = Router();

rentalRouter.post(
  "/rentals",
  auth,
  validateCreateRental,
  validateCarAvailable,
  validateRentalDate,
  createRentalController
);

rentalRouter.get(
  "/rentals", 
  auth, 
  getRentalsController
);

rentalRouter.get(
  "/rentals/statistics", 
  auth, 
  isAdmin,
  getRentalStatisticsController
);

rentalRouter.get(
  "/rentals/checkCar",
  validateDataCheckCar,
  validateCarAvailable,
  validateRentalDate,
  getAvailabilityMessageController
);

rentalRouter.get(
  "/rentals/all", 
  auth, 
  isAdmin, 
  getAllRentalsController
);

rentalRouter.get(
  "/rentals/:id",
  auth,
  hasAccessRental,
  validateGetById,
  getRentalByIdController
);

rentalRouter.put(
    '/rentals/:id',
    auth,
    isAdmin,
    validateGetById,
    validateUpdateRental,
    validateCarAvailable,
    validateRentalDate,
    updateRentalController
);

rentalRouter.delete(
    '/rentals/:id',
    auth,
    hasAccessRental,
    validateGetById,
    validateTimeLimit,
    canceleRentalController
);
