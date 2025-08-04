import {Router} from 'express';
import {
    createCarController,
    deleteCarController,
    getAllCarsController,
    getCarByIdController,
    updateCarController
} from './car.controller';
import {
    validateCreateCar,
    validateGetById,
    validateUpdateCar,
    validateFilters
} from './car.middleware';
import {auth, isAdmin} from "../middleware";

export const carRouter = Router();

carRouter.post(
    '/cars',
    auth,
    isAdmin,
    validateCreateCar,
    createCarController
);

carRouter.get(
    '/cars',
    auth,
    validateFilters,
    getAllCarsController
);

carRouter.get(
    '/cars/:id',
    auth,
    validateGetById,
    getCarByIdController
);

carRouter.put(
    '/cars/:id',
    auth,
    isAdmin,
    validateGetById,
    validateUpdateCar,
    updateCarController
);

carRouter.delete(
    '/cars/:id',
    auth,
    isAdmin,
    validateGetById,
    deleteCarController
);
