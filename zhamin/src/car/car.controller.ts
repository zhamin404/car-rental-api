import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as carService from "./car.service";
import { errorHandler } from "../utils/error-handler";
import { SortOrder, Types } from "mongoose";

export async function createCarController(req: Request, res: Response) {
  try {
    const car = await carService.createCar(req.body);
    res.status(StatusCodes.CREATED).send(car);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function getCarByIdController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const car = await carService.getCarById(id);
    if (!car) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(car);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function getAllCarsController(req: Request, res: Response) {
  try {
    const sortBy = req.query.sort_by as string;
    const order = req.query.order as SortOrder;
    const min_price = req.query.min_price as string;
    const max_price = req.query.max_price as string;
    const min_year = req.query.min_year as string;
    const max_year = req.query.max_year as string
    const cars = await carService.getAllCars(
      sortBy,
      order,
      min_price,
      max_price,
      min_year,
      max_year
    );
    res.status(StatusCodes.OK).send(cars);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateCarController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const updatedCar = await carService.updateCar(id, req.body);
    if (!updatedCar) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(updatedCar);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function deleteCarController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const deletedCar = await carService.deleteCar(id);
    if (!deletedCar) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(deletedCar);
  } catch (error) {
    errorHandler(res, error);
  }
}
