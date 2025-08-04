import {Router} from 'express';
import {
    createUserController,
    deleteUserController,
    updateUserController,
    getUserByIdController,
    updateDrivingLicenseController,
    updateFavoriteCarsIdController,
    deleteDrivingLicenseController,
    deleteFavoriteCarsIdController
} from './user.controller'
import {
    hasAccess
} from "./user.middleware"
import {
    validateUpdateUser,
    validateCreateUser,
    validateFavoriteCarsId,
    validateGetById 
} from './user.middleware';
import {auth} from "../middleware";

export const userRouter = Router();

userRouter.post(
    '/users',
    validateCreateUser,
    createUserController
);
userRouter.get('/users/:id',
    auth,
    hasAccess,
    validateGetById,
    getUserByIdController
);
userRouter.put(
    '/users/:id',
    auth,
    hasAccess,
    validateUpdateUser,
    updateUserController
);

userRouter.put(
    "/users/:id/favorite-cars",
    auth,
    hasAccess,
    validateFavoriteCarsId,
    updateFavoriteCarsIdController
);

userRouter.delete(
    '/users/:id',
    auth,
    hasAccess,
    validateGetById,
    deleteUserController
);



