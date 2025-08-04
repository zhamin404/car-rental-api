import { Router } from "express";
import {
  createDriverLicenseController,
  deleteDriverLicenseController,
  updateDriverLicenseController,
  getDriverLicenseByUserIdController,
} from "./driver-license.controller";
import {
  validateCreateDriverLicense,
  validateUpdateDriverLicense,
  validateGetById,
} from "./driver-license.middleware";
import { hasAccess } from "../user/user.middleware";
import { auth } from "../middleware";

export const driverLicenseRouter = Router();

driverLicenseRouter.post(
  "/users/:id/driver-license",
  auth,
  hasAccess,
  validateCreateDriverLicense,
  createDriverLicenseController
);

driverLicenseRouter.get(
  "/users/:id/driver-license",
  auth,
  hasAccess,
  validateGetById,
  getDriverLicenseByUserIdController
);


driverLicenseRouter.put(
  "/users/:id/driver-license",
  auth,
  hasAccess,
  validateUpdateDriverLicense,
  updateDriverLicenseController
);

driverLicenseRouter.delete(
  "/users/:id/driver-license",
  auth,
  hasAccess,
  validateGetById,
  deleteDriverLicenseController
);
