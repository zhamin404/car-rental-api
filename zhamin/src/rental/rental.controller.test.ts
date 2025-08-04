import { describe, expect, it, vi, beforeEach } from "vitest";
import { Status } from "./rental.constants";
import { getMockReq, getMockRes } from "vitest-mock-express";
import { StatusCodes } from "http-status-codes";
import * as rentalService from "./rental.service";
import {
  createRentalController,
  getAllRentalsController,
  getRentalByIdController,
  getRentalsController,
  getAvailabilityMessageController,
  updateRentalController,
  canceleRentalController,
} from "./rental.controller";
import { errorHandler } from "../utils/error-handler";
import { getFormatDate } from "./rental.middleware";

vi.mock("./rental.service");
vi.mock("./rental.middleware");
vi.mock("../utils/error-handler");

describe("Rental Controller", () => {
  const { res, mockClear } = getMockRes();
  const defaultRentalId = "99";
  const defaultUserId = "99";
  const defaultRental = {
    CarId: "43453",
    UserId: "34253",
    rentalStartDate: "Cегодня",
    rentalFinishDate: "Завтра",
    oneDayRentalPrice: 9999,
    status: Status.Done,
  };

  beforeEach(() => {
    mockClear();
    vi.clearAllMocks();
  });

  describe("createRentalController", () => {
    it("should create a rental", async () => {
      const req = getMockReq({
        body: defaultRental,
      });
      vi.mocked(rentalService.createRental).mockResolvedValue(defaultRental);

      await createRentalController(req, res);

      expect(rentalService.createRental).toHaveBeenCalledWith(defaultRental);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith(defaultRental);
    });

    it("should handle errors", async () => {
      const error = new Error("Test error");
      const req = getMockReq();
      vi.mocked(rentalService.createRental).mockRejectedValue(error);

      await createRentalController(req, res);
      expect(errorHandler).toHaveBeenCalledWith(res, error);
    });
  });

  describe("getRentalByIdController", () => {
    it("should get a rental by id", async () => {
      const req = getMockReq({
        params: { id: defaultRentalId },
        user: { id: defaultUserId },
      });
      vi.mocked(rentalService.getRentalById).mockResolvedValue(defaultRental);

      await getRentalByIdController(req, res);

      expect(rentalService.getRentalById).toHaveBeenCalledWith(
        defaultRentalId,
        defaultUserId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(defaultRental);
    });

    it("should return 404 if no rental", async () => {
      const req = getMockReq({
        params: { id: defaultRentalId },
        user: { id: defaultUserId },
      });
      vi.mocked(rentalService.getRentalById).mockResolvedValue(null);

      await getRentalByIdController(req, res);

      expect(rentalService.getRentalById).toHaveBeenCalledWith(
        defaultRentalId,
        defaultUserId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const error = new Error("Test error");
      const req = getMockReq({
        params: { id: defaultRentalId },
        user: { id: defaultUserId },
      });
      vi.mocked(rentalService.getRentalById).mockRejectedValue(error);

      await getRentalByIdController(req, res);

      expect(errorHandler).toHaveBeenCalledWith(res, error);
    });
  });

  describe("getAllRentalsController", () => {
    it("should get all cars", async () => {
      const defaultRentals = [
        {
          CarId: "34534",
          UserId: "34634653",
          rentalStartDate: "Cегодня",
          rentalFinishDate: "Завтра",
          oneDayRentalPrice: 9999,
          status: Status.Done,
        },
        defaultRental,
      ];
      const req = getMockReq();
      vi.mocked(rentalService.getAllRentals).mockResolvedValue(defaultRentals);

      await getAllRentalsController(req, res);

      expect(rentalService.getAllRentals).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(defaultRentals);
    });
    it("should return 404 if no rental", async () => {
      const req = getMockReq();
      vi.mocked(rentalService.getAllRentals).mockResolvedValue([]);

      await getAllRentalsController(req, res);

      expect(rentalService.getAllRentals).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const error = new Error("Test error");
      const req = getMockReq();
      vi.mocked(rentalService.getAllRentals).mockRejectedValue(error);

      await getAllRentalsController(req, res);

      expect(errorHandler).toHaveBeenCalledWith(res, error);
    });
  });

  describe("getRentalsController", () => {
    it("should get all cars", async () => {
      const defaultRentals = [
        {
          CarId: "34534",
          UserId: "34634653",
          rentalStartDate: "Cегодня",
          rentalFinishDate: "Завтра",
          oneDayRentalPrice: 9999,
          status: Status.Done,
        },
        defaultRental,
      ];
      const req = getMockReq({
        user: { id: defaultUserId },
      });
      vi.mocked(rentalService.getRentals).mockResolvedValue(defaultRentals);

      await getRentalsController(req, res);

      expect(rentalService.getRentals).toHaveBeenCalledWith(defaultUserId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(defaultRentals);
    });
    it("should return 404 if no rental", async () => {
      const req = getMockReq({
        user: { id: defaultUserId },
      });
      vi.mocked(rentalService.getRentals).mockResolvedValue([]);

      await getRentalsController(req, res);

      expect(rentalService.getRentals).toHaveBeenCalledWith(defaultUserId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const req = getMockReq({
        user: { id: defaultUserId },
      });
      const error = new Error("Test error");
      vi.mocked(rentalService.getRentals).mockRejectedValue(error);

      await getRentalsController(req, res);
      expect(rentalService.getRentals).toHaveBeenCalledWith(defaultUserId);
      expect(errorHandler).toHaveBeenCalledWith(res, error);
    });
  });

  describe("getAvailabilityMessageController", () => {
    it("should get availability message", async () => {
      const req = getMockReq({
        body: {
          rentalStartDate: "2025:06:01",
          rentalFinishDate: "2025:06:10",
        },
      });
      vi.mocked(getFormatDate).mockReturnValueOnce("2025:06:01");
      vi.mocked(getFormatDate).mockReturnValueOnce("2025:06:10");
      const message = "The car is available for rent from 2025:06:01 to 2025:06:10.";
      await getAvailabilityMessageController(req, res);
  
      expect(getFormatDate).toBeCalledWith(req.body.rentalStartDate);
      expect(getFormatDate).toBeCalledWith(req.body.rentalFinishDate);
      expect(res.status).toBeCalledWith(StatusCodes.OK);
      expect(res.send).toBeCalledWith(message);
    });

    })
    describe("updateRentalController", () => {
      it("should update a rental", async () => {
        const req = getMockReq({
          params: { id: defaultRentalId },
          body: {
            rentalStartDate: "2025:06:01",
            rentalFinishDate: "2025:06:10",
          },
        });
        vi.mocked(rentalService.updateRental).mockResolvedValue(defaultRental);
    
        await updateRentalController(req, res);
    
        expect(rentalService.updateRental).toHaveBeenCalledWith(defaultRentalId,req.body);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith(defaultRental);
      });
    
      it("should return 404 if no rental", async () => {
        const req = getMockReq({
          params: { id: defaultRentalId },
          body: {
            rentalStartDate: "2025:06:01",
            rentalFinishDate: "2025:06:10",
          },
        });
        vi.mocked(rentalService.updateRental).mockResolvedValue(null);
    
        await updateRentalController(req, res);
    
        expect(rentalService.updateRental).toHaveBeenCalledWith(defaultRentalId, req.body);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(res.send).toHaveBeenCalled();
      });
    
      it("should handle errors", async () => {
        const req = getMockReq({
          params: { id: defaultRentalId },
          body: {
            rentalStartDate: "2025:06:01",
            rentalFinishDate: "2025:06:10",
          },
        });
        const error = new Error("Test error");
        vi.mocked(rentalService.updateRental).mockRejectedValue(error);
    
        await updateRentalController(req, res);
    
        expect(rentalService.updateRental).toHaveBeenCalledWith(defaultRentalId, req.body);
        expect(errorHandler).toHaveBeenCalledWith(res, error);
      });
    });
    describe("canceleRentalController", () => {
      it("should cancel a rental", async () => {
        const req = getMockReq({
          params: { id: defaultRentalId },
        });
        vi.mocked(rentalService.canceleRental).mockResolvedValue(defaultRental);
    
        await canceleRentalController(req, res);
    
        expect(rentalService.canceleRental).toHaveBeenCalledWith(defaultRentalId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith(defaultRental);
      });
    
      it("should return 404 if no rental", async () => {
        const req = getMockReq({
          params: { id: defaultRentalId },
        });
        vi.mocked(rentalService.canceleRental).mockResolvedValue(null);
    
        await canceleRentalController(req, res);
    
        expect(rentalService.canceleRental).toHaveBeenCalledWith(defaultRentalId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(res.send).toHaveBeenCalled();
      });
    
      it("should handle errors", async () => {
        const req = getMockReq({
          params: { id: defaultRentalId },
        });
        const error = new Error("Test error");
        vi.mocked(rentalService.canceleRental).mockRejectedValue(error);
    
        await canceleRentalController(req, res);
        expect(rentalService.canceleRental).toHaveBeenCalledWith(defaultRentalId);
        expect(errorHandler).toHaveBeenCalledWith(res, error);
      });
    });
    
});
