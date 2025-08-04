import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as rentalService from "./rental.service";
import { errorHandler } from "../utils/error-handler";
import { getFormatDate } from "./rental.middleware";
import { UserRole } from "../user/user.constats";

export async function createRentalController(req: Request, res: Response) {
  try {
    const rental = await rentalService.createRental(req.body);
    res.status(StatusCodes.CREATED).send(rental);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function getRentalByIdController(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id!;
  try {
    const rental = await rentalService.getRentalById(id, userId);
    if (!rental) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(rental);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function getRentalsController(req: Request, res: Response) {
  const id = req.user!.id!;
  try {
    const rentals = await rentalService.getRentals(id);
    if (!rentals.length) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(rentals);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function getAllRentalsController(_: Request, res: Response) {
  try {
    const rentals = await rentalService.getAllRentals();
    if (!rentals.length) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(rentals);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function getRentalStatisticsController(_: Request, res: Response) {
  try{
    const statistics = await rentalService.getRentalStatistics()
    if (!statistics.length) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(statistics); 
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function getAvailabilityMessageController(
  req: Request,
  res: Response
) {
  try{
    const { rentalStartDate, rentalFinishDate } = req.body;
    const formatStartDate = getFormatDate(rentalStartDate);
    const formatFinishDate = getFormatDate(rentalFinishDate);
    const message = `The car is available for rent from ${formatStartDate} to ${formatFinishDate}.`
    res.status(StatusCodes.OK).send(message);    
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateRentalController(req: Request, res: Response) {
  try{
    const { id } = req.params;
    const changeRentalData = req.body;
    const updateRental = await rentalService.updateRental(id, changeRentalData);
    if (!updateRental) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(updateRental);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function canceleRentalController(req: Request, res: Response) {
  try{
    const { id } = req.params;
    const canceleRental = await rentalService.canceleRental(id);
    if (!canceleRental) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(canceleRental);
  } catch (error) {
    errorHandler(res, error);
  }
}
