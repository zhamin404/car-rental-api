import {describe, expect, it, vi, beforeEach} from 'vitest';
import {getMockReq, getMockRes} from 'vitest-mock-express';
import {StatusCodes} from 'http-status-codes';
import * as carService from './car.service';
import {
    createCarController,
    deleteCarController,
    getAllCarsController,
    getCarByIdController,
    updateCarController
} from './car.controller';
import {errorHandler} from "../utils/error-handler";

vi.mock('./car.service');
vi.mock('../utils/error-handler');

describe('Car Controller', () => {
    const {res, mockClear} = getMockRes();
    const defaultCarId = '99';
    const defaultCar = {
        brand: 'Lada',
        name: 'Niva Sport',
        year: 2024,
        rate: 99000,
        image: 'https://www.masmotors.ru/resources/models/815/colors/color/fbb6133d66a50f6d60d74b7950aee298c8ffe17b_600x310.webp',
    };

    beforeEach(() => {
        mockClear();
        vi.clearAllMocks();
    });

    describe('createCarController', () => {
        it('should create a car', async () => {
            const req = getMockReq({
                body: defaultCar
            });
            vi.mocked(carService.createCar).mockResolvedValue(defaultCar);

            await createCarController(req, res);

            expect(carService.createCar).toHaveBeenCalledWith(defaultCar);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            expect(res.send).toHaveBeenCalledWith(defaultCar);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            const req = getMockReq();
            vi.mocked(carService.createCar).mockRejectedValue(error);

            await createCarController(req, res);
            expect(errorHandler).toHaveBeenCalledWith(res, error);
        });
    });

    describe('getCarByIdController', () => {
        it('should get a car by id', async () => {
            const req = getMockReq({
                params: { id: defaultCarId }
            });
            vi.mocked(carService.getCarById).mockResolvedValue(defaultCar);

            await getCarByIdController(req, res);

            expect(carService.getCarById).toHaveBeenCalledWith(defaultCarId);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith(defaultCar);
        });

        it('should return 404 if no car', async () => {
            const req = getMockReq({
                params: { id: defaultCarId }
            });
            vi.mocked(carService.getCarById).mockResolvedValue(null);

            await getCarByIdController(req, res);

            expect(carService.getCarById).toHaveBeenCalledWith(defaultCarId);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(res.send).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            const req = getMockReq({
                params: { id: defaultCarId }
            });
            vi.mocked(carService.getCarById).mockRejectedValue(error);

            await getCarByIdController(req, res);

            expect(errorHandler).toHaveBeenCalledWith(res, error);
        });
    });

    describe('getAllCarsController', () => {
        it('should get all cars', async () => {
            const defaultCars = [
                {
                    id: defaultCarId,
                    brand: 'BMW',
                    name: '320',
                },
                defaultCar,
            ];
            const req = getMockReq();
            vi.mocked(carService.getAllCars).mockResolvedValue(defaultCars);

            await getAllCarsController(req, res);

            expect(carService.getAllCars).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith(defaultCars);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            const req = getMockReq();
            vi.mocked(carService.getAllCars).mockRejectedValue(error);

            await getAllCarsController(req, res);

            expect(errorHandler).toHaveBeenCalledWith(res, error);
        });
    });

    describe('updateCarController', () => {
        it('should update a car', async () => {
            const req = getMockReq({
                params: { id: defaultCarId },
                body: defaultCar
            });
            vi.mocked(carService.updateCar).mockResolvedValue(defaultCar);

            await updateCarController(req, res);

            expect(carService.updateCar).toHaveBeenCalledWith(defaultCarId, defaultCar);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith(defaultCar);
        });

        it('should return 404 if no car', async () => {
            const req = getMockReq({
                params: { id: defaultCarId },
                body: defaultCar,
            });
            vi.mocked(carService.updateCar).mockResolvedValue(null);

            await updateCarController(req, res);

            expect(carService.updateCar).toHaveBeenCalledWith(defaultCarId, defaultCar);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(res.send).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            const req = getMockReq({
                params: { id: defaultCarId },
                body: defaultCar
            });
            vi.mocked(carService.updateCar).mockRejectedValue(error);

            await updateCarController(req, res);

            expect(errorHandler).toHaveBeenCalledWith(res, error);
        });
    });

    describe('deleteCarController', () => {
        it('should delete a car', async () => {
            const req = getMockReq({
                params: { id: defaultCarId }
            });
            vi.mocked(carService.deleteCar).mockResolvedValue(defaultCar);

            await deleteCarController(req, res);

            expect(carService.deleteCar).toHaveBeenCalledWith(defaultCarId);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith(defaultCar);
        });

        it('should return 404 if car not found', async () => {
            const req = getMockReq({
                params: { id: defaultCarId }
            });
            vi.mocked(carService.deleteCar).mockResolvedValue(null);

            await deleteCarController(req, res);

            expect(carService.deleteCar).toHaveBeenCalledWith(defaultCarId);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(res.send).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            const req = getMockReq({
                params: { id: defaultCarId }
            });
            vi.mocked(carService.deleteCar).mockRejectedValue(error);

            await deleteCarController(req, res);

            expect(errorHandler).toHaveBeenCalledWith(res, error);
        });
    });
});
