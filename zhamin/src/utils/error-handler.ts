import {StatusCodes} from "http-status-codes";
import {Response} from "express";
import {logger} from "./logger";

export const defaultServerError = {message: 'Something went wrong'}

export const errorHandler = (res: Response, error: unknown) => {
    logger(error);

    try {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(defaultServerError);
    } catch (e) {
        console.error(`network error: ${e}`);
    }
};
