import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import * as userService from './user.service';
import {errorHandler} from "../utils/error-handler";

export async function createUserController(req: Request, res: Response) {
    try {
        const user = await userService.createUser(req.body);
        res.status(StatusCodes.CREATED).send(user);
    } catch (error) {
        errorHandler(res, error)
    }
}

export async function getUserByIdController(req: Request, res: Response) {
    const {id} = req.params;
    try {
        const user = await userService.getUserById(id);
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).send();
        }
        res.status(StatusCodes.OK).send(user);
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function updateUserController(req: Request, res: Response) {
    const {id} = req.params;
    try {
        const updatedUser = await userService.updateUser(id, req.body);
        if (!updatedUser) {
            res.status(StatusCodes.NOT_FOUND).send();
        }
        res.status(StatusCodes.OK).send(updatedUser);
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function deleteUserController(req: Request, res: Response) {
    const {id} = req.params;
    try {
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser) {
            res.status(StatusCodes.NOT_FOUND).send();
        }
        res.status(StatusCodes.OK).send(deletedUser);
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function updateFavoriteCarsIdController(req: Request, res: Response) {
    const {id} = req.params;
    try {
        const updatedUser = await userService.updateFavoriteCarsIdToUser(id, req.body);
        if (!updatedUser) {
            res.status(StatusCodes.NOT_FOUND).send();
        }
        res.status(StatusCodes.OK).send(updatedUser);
    } catch (error) {
        errorHandler(res, error);
    
    }
}

export async function deleteFavoriteCarsIdController(req: Request, res: Response) {
    const {id} = req.params;
    try {
        const updatedUser = await userService.deleteFavoriteCarsIdToUser(id);
        if (!updatedUser) {
            res.status(StatusCodes.NOT_FOUND).send();
        }
        res.status(StatusCodes.OK).send();
    } catch (error) {
        errorHandler(res, error);
    
    }
}
