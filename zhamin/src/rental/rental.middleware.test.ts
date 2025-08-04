import { describe, expect, it, vi, beforeEach } from "vitest";
import { getMockReq, getMockRes } from "vitest-mock-express";
import { StatusCodes } from "http-status-codes";
import { RentalErrors} from "./rental.constants";
import { UserRole } from "../user/user.constats";
import { errors } from "../middleware/constants";
import * as rentalService from "./rental.service";
import * as carService from "../car/car.service";
import {
  getFormatDate,
  checkDateIntersection,
  validateRentalDate,
  validateCarAvailable,
  hasAccessRental,
  validateTimeLimit,
} from "./rental.middleware";


vi.mock("./rental.service");
vi.mock("../car/car.service");

describe("Rental Middleware", () => {
  const { res, next, mockClear } = getMockRes();

  beforeEach(() => {
    mockClear();
    vi.clearAllMocks();
  });

  describe("getFormatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2025-06-01T10:00:00");
      const result = getFormatDate(date);
      expect(result).toBe("2025:06:01:10");
    });
  });

  describe('checkDateIntersection', () => {
  it('should return null when dates do not intersect', async () => {

    const mockRentals = [
      {
        _id: 'currentRentalId',
        rentalStartDate: new Date('2024-04-01'),
        rentalFinishDate: new Date('2024-04-07')
      },
      {
        _id: 'rental1',
        rentalStartDate: new Date('2024-03-01'),
        rentalFinishDate: new Date('2024-03-08')
      }
    ];

    vi.mocked(rentalService.getDoneRentalsByCarId).mockResolvedValue(mockRentals);

    const newStartDate = new Date('2024-04-01').getTime();
    const newFinishDate = new Date('2024-04-08').getTime();

    const result = await checkDateIntersection(
      'carId123',
      newStartDate,
      newFinishDate,
      'currentRentalId'
    );
    expect(rentalService.getDoneRentalsByCarId).toHaveBeenCalledWith('carId123');
    expect(result).toBeNull();
  });
  it('should return conflict dates when dates intersect', async () => {
    const mockRentals = [
      {
        _id: 'rental1',
        rentalStartDate: new Date('2024-03-01'),
        rentalFinishDate: new Date('2024-03-07')
      }
    ];

    vi.mocked(rentalService.getDoneRentalsByCarId).mockResolvedValue(mockRentals);

    const newStartDate = new Date('2024-03-01').getTime();
    const newFinishDate = new Date('2024-03-09').getTime();

    const result = await checkDateIntersection(
      'carId123',
      newStartDate,
      newFinishDate,
      'currentRentalId'
    );

    expect(rentalService.getDoneRentalsByCarId).toHaveBeenCalledWith('carId123');
    expect(result).toEqual({
      start: '2024:03:01:03',
      finish: '2024:03:07:03'
    });
  });
});

  describe("validateRentalDate", () => {
    it("should return error if finish date is before start date", async () => {
      const req = getMockReq({
        body: {
          carId: "123",
          rentalStartDate: "2025-06-10",
          rentalFinishDate: "2025-06-01"
        }
      });

      await validateRentalDate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith("Finish date must be after start date");
    });

    it("should return error if rental duration is more than 28 days", async () => {
      const req = getMockReq({
        body: {
          carId: "123",
          rentalStartDate: "2025-06-01",
          rentalFinishDate: "2025-07-01"
        }
      });

      await validateRentalDate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith("Maximum rental duration is 28 days.");
    });

    it("should return error if start date is in the past", async () => {
      const req = getMockReq({
        body: {
          carId: "123",
          rentalStartDate: "2020-06-01",
          rentalFinishDate: "2020-06-10"
        }
      });

      await validateRentalDate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith("Rental start date must be in the future");
    });

    it("should return error if dates overlap with existing rental", async () => {
      const req = getMockReq({
        body: {
          carId: "123",
          rentalStartDate: "2025-06-03",
          rentalFinishDate: "2025-06-10"
        }
      });

      vi.mocked(rentalService.getDoneRentalsByCarId).mockResolvedValue([{
        _id: "456",
        rentalStartDate: new Date("2025-06-05"),
        rentalFinishDate: new Date("2025-06-15")
      }]);

      await validateRentalDate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith(
        "This car is already rented from 2025:06:05:03 to 2025:06:15:03. Please choose another date."
      );
    });
  });

  describe("validateCarAvailable", () => {
    it("should return error if car not found", async () => {
      const req = getMockReq({
        body: {
          carId: "123"
        }
      });

      vi.mocked(carService.getIsActivceCar).mockResolvedValue(null);

      await validateCarAvailable(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith("Car not found.");
    });

    it("should return error if car is not active", async () => {
      const req = getMockReq({
        body: {
          carId: "123"
        }
      });

      vi.mocked(carService.getIsActivceCar).mockResolvedValue({ isActive: false });

      await validateCarAvailable(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith("This car is not available for rental.");
    });

    it("should call next if car is available", async () => {
      const req = getMockReq({
        body: {
          carId: "123"
        }
      });

      vi.mocked(carService.getIsActivceCar).mockResolvedValue({ isActive: true });

      await validateCarAvailable(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("hasAccessRental", () => {
    it("should return error if no user", async () => {
      const req = getMockReq();

      await hasAccessRental(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(res.send).toHaveBeenCalledWith(errors.noToken);
    });

    it("should return error if rental not found", async () => {
      const req = getMockReq({
        user: { id: "123" },
        params: { id: "456" }
      });

      vi.mocked(rentalService.getUserIdOnRentalsById).mockResolvedValue(null);

      await hasAccessRental(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith(RentalErrors.rentalNotFound);
    });

    it("should return error if user has no access", async () => {
      const req = getMockReq({
        user: { id: "123", role: UserRole.USER },
        params: { id: "456" }
      });

      vi.mocked(rentalService.getUserIdOnRentalsById).mockResolvedValue({ userId: "789" });

      await hasAccessRental(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith(errors.noRights);
    });

    it("should allow access for admin", async () => {
      const req = getMockReq({
        user: { id: "123", role: UserRole.ADMIN },
        params: { id: "456" }
      });

      vi.mocked(rentalService.getUserIdOnRentalsById).mockResolvedValue({ userId: "789" });

      await hasAccessRental(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should allow access for rental owner", async () => {
      const req = getMockReq({
        user: { id: "123", role: UserRole.USER },
        params: { id: "456" }
      });

      vi.mocked(rentalService.getUserIdOnRentalsById).mockResolvedValue({ userId: "123" });

      await hasAccessRental(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("validateTimeLimit", () => {
    it("should allow admin to update anytime", async () => {
      const req = getMockReq({
        user: { role: UserRole.ADMIN },
        params: { id: "123" }
      });

      await validateTimeLimit(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return error if rental not found", async () => {
      const req = getMockReq({
        user: { role: UserRole.USER },
        params: { id: "123" }
      });

      vi.mocked(rentalService.getStartDateOnRental).mockResolvedValue(null);

      await validateTimeLimit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith("Rental not found");
    });

    it("should return error if less than 24 hours before start", async () => {
      const req = getMockReq({
        user: { role: UserRole.USER },
        params: { id: "123" }
      });

      const startDate = Date.now(); 
      vi.mocked(rentalService.getStartDateOnRental).mockResolvedValue({ rentalStartDate: startDate });

      await validateTimeLimit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith("You can only update rentals within 24 hours of the start date.");
    });

    it("should allow update if more than 24 hours before start", async () => {
      const req = getMockReq({
        user: { role: UserRole.USER },
        params: { id: "123" }
      });
      const TwoDaysInMs = 2 * 24 * 60 * 60 * 1000; 
      const startDate = Date.now() +  TwoDaysInMs
      vi.mocked(rentalService.getStartDateOnRental).mockResolvedValue({ rentalStartDate: startDate });

      await validateTimeLimit(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});