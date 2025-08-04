import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as driverLicenseService from "./driver-license.service";
import { errorHandler } from "../utils/error-handler";
import { MongooseError } from "mongoose";
import { MongoServerError } from "mongodb"

export async function createDriverLicenseController(
  req: Request,
  res: Response
) {
  try {
    const driverLicense = await driverLicenseService.createDriverLicense(
      req.body
    );

    res.status(StatusCodes.CREATED).send(driverLicense);
  } catch (error) {
    if (
        error instanceof MongooseError &&
        error.cause instanceof MongoServerError &&
        error.cause.code === 11000
      ) {
      res.status(StatusCodes.BAD_REQUEST).send(error.message);
      return;
    }
    errorHandler(res, error)
  }
}

export async function getDriverLicenseByUserIdController(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  try {
    const driverLicense = await driverLicenseService.getDriverLicenseByUserId(
      id
    );
    if (!driverLicense) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(driverLicense);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateDriverLicenseController(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  try {
    const updatedDriverLicense = await driverLicenseService.updateDriverLicense(
      id,
      req.body
    );
    if (!updatedDriverLicense) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(updatedDriverLicense);
  } catch (error) {
    if (        
        error instanceof MongooseError &&
        error.cause instanceof MongoServerError &&
        error.cause.code === 11000
    ) {
      res.status(StatusCodes.BAD_REQUEST).send(error.message);
      return;
    }
    errorHandler(res, error)
  }
}

export async function deleteDriverLicenseController(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  try {
    const deletedDriverLicense = await driverLicenseService.deleteDriverLicense(
      id
    );
    if (!deletedDriverLicense) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    res.status(StatusCodes.OK).send(deletedDriverLicense);
  } catch (error) {
    errorHandler(res, error);
  }
}
