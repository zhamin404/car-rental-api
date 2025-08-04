import { defaultRequestValidation } from "../middleware/index";
import { StatusCodes } from "http-status-codes";
import { CarId } from "../car/car.dto";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { body, param } from "express-validator";
import { Status, limitMaxDaysInMs } from "./rental.constants";
import { errorHandler } from "../utils/error-handler";
import { getIsActivceCar } from "../car/car.service";
import * as rentalService from "./rental.service"
import { errors } from "../middleware/constants";
import { RentalErrors } from "./rental.constants";
import { RentalModel } from "./rental.model";
import { UserRole } from "../user/user.constats";

export function getFormatDate(rentalDate: Date): string {
  const date = new Date(rentalDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");

  return `${year}:${month}:${day}:${hours}`;
};

export const checkDateIntersection = async (
  carId: CarId,
  newStartDate: number,
  newFinishDate: number,
  currentRentalId: string
) => {
  const allDoneRentalDatesForCar = await rentalService.getDoneRentalsByCarId(carId);
  const conflictingRental = allDoneRentalDatesForCar.find((date) => {
    if (currentRentalId && date._id.toString() === currentRentalId) {
      return false;
    }
    const existingStartDate = new Date(date.rentalStartDate).getTime();
    const existingEndDate = new Date(date.rentalFinishDate).getTime();

    return newStartDate < existingEndDate && newFinishDate > existingStartDate;
  });
  if (conflictingRental) {
    return {
      start: getFormatDate(conflictingRental.rentalStartDate),
      finish: getFormatDate(conflictingRental.rentalFinishDate),
    };
  }
  return null;
};

export const validateRentalDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { carId, rentalStartDate, rentalFinishDate } = req.body;
    const startDateMs = new Date(rentalStartDate).getTime();
    const finishDateMs = new Date(rentalFinishDate).getTime();
    const isFinishAfterStart = finishDateMs > startDateMs;
    const isDateWithLimit = finishDateMs - startDateMs <= limitMaxDaysInMs;
    const isRentingNotAThingOfThePast = startDateMs >= Date.now();
    if (!isFinishAfterStart) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Finish date must be after start date");
      return;
    }
    if (!isDateWithLimit) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Maximum rental duration is 28 days.");
      return;
    }
    if (!isRentingNotAThingOfThePast) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Rental start date must be in the future");
      return;
    }

    const result = await checkDateIntersection(
      carId,
      startDateMs,
      finishDateMs,
      req.params.id
    );
    if (result) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          `This car is already rented from ${result.start} to ${result.finish}. Please choose another date.`
        );
      return;
    }
    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const validateCarAvailable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { carId } = req.body;
    const rental = await getIsActivceCar(carId);
    if (!rental) {
      res.status(StatusCodes.NOT_FOUND).send("Car not found.");
      return;
    }
    if (!rental?.isActive) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("This car is not available for rental.");
      return;
    }
    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const validateCreateRental: RequestHandler[] = [
  body("carId")
    .isMongoId()
    .withMessage("Car id is required and must be a mongoId"),
  body("userId")
    .isMongoId()
    .withMessage("User id is required and must be a mongoId"),

  body("rentalStartDate")
    .isISO8601()
    .withMessage(`Rental start date must be а ISO8601`),

  body("rentalFinishDate")
    .isISO8601()
    .withMessage("Rental start date must be а ISO8601"),

  body("oneDayRentalPrice")
    .isInt()
    .withMessage("Price must be a int number"),

  body("status")
    .isIn(Object.values(Status))
    .withMessage("Status must be a  Done or Canceled "),
  defaultRequestValidation,
];

export const validateUpdateRental: RequestHandler[] = [
  body("rentalStartDate")
    .isISO8601()
    .withMessage(`Rental start date must be а ISO8601`),
  body("rentalFinishDate")
    .isISO8601()
    .withMessage("Rental start date must be а ISO8601"),
  body("status")
    .isIn(Object.values(Status))
    .withMessage("Status must be a  Done or Canceled "),
  defaultRequestValidation,
];

export const validateDataCheckCar: RequestHandler[] = [
  body("carId")
    .isMongoId()
    .withMessage("Car id is required and must be a mongoId"),
  body("rentalStartDate")
    .isISO8601()
    .withMessage(`Rental start date must be а ISO8601`),
  body("rentalFinishDate")
    .isISO8601()
    .withMessage("Rental start date must be а ISO8601"),
  defaultRequestValidation,
];

export const validateGetById: RequestHandler[] = [
  param("id").isString().isMongoId().withMessage("Invalid car id format"),

  defaultRequestValidation,
];

export const hasAccessRental = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).send(errors.noToken);
    return;
  }
  const rentalId = req.params.id;
  const requestedId = await rentalService.getUserIdOnRentalsById(rentalId)
  if (!requestedId) {
    res.status(StatusCodes.NOT_FOUND).send(RentalErrors.rentalNotFound);
    return;
  }

  const isSameUser = req.user.id === requestedId.userId.toString();
  const isAdmin = req.user.role === UserRole.ADMIN;
  const hasAccess = isSameUser || isAdmin;

  if (!hasAccess) {
    res.status(StatusCodes.FORBIDDEN).send(errors.noRights);
    return;
  }

  next();
};

export const validateTimeLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== UserRole.ADMIN) {
    const rentalId = req.params.id
    const currentTime = Date.now();
    const limitTime = 24 * 60 * 60 * 1000;
    const rentalData = await rentalService.getStartDateOnRental(rentalId)
    if (!rentalData) {
      res.status(StatusCodes.NOT_FOUND).send("Rental not found");
      return;
    }
    const startMs = new Date(rentalData?.rentalStartDate).getTime()
    const isValid = startMs - currentTime > limitTime;
    if (!isValid) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("You can only update rentals within 24 hours of the start date.");
      return;
    }
    next();
  }
  next();
};
