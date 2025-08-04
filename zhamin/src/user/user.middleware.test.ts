import { describe, expect, it, vi, beforeEach } from "vitest";
import { getMockReq, getMockRes } from "vitest-mock-express";
import { StatusCodes } from "http-status-codes";
import {
  hasAccess
} from "./user.middleware"
import {
  validateCreateUser,
  validateUpdateUser,
  validateGetById,
} from "./user.middleware";

import { UserRole } from "./user.constats";
import { errors } from "../middleware/constants";

vi.mock("express-validator", () => {
  const fakeChain = {
    param: vi.fn().mockReturnThis(),
    custom: vi.fn().mockReturnThis(),
    isString: vi.fn().mockReturnThis(),
    isEmail: vi.fn().mockReturnThis(),
    isLength: vi.fn().mockReturnThis(),
    isIn: vi.fn().mockReturnThis(),
    isArray: vi.fn().mockReturnThis(),
    isObject: vi.fn().mockReturnThis(),
    isMongoId: vi.fn().mockReturnThis(),
    optional: vi.fn().mockReturnThis(),
    notEmpty: vi.fn().mockReturnThis(),
    withMessage: vi.fn().mockReturnThis(),
  };

  return {
    param: vi.fn(() => fakeChain),
    body: vi.fn(() => fakeChain),
    validationResult: vi.fn(),
  };
});

describe("hasAccess middleware", () => {
  const { res, mockClear } = getMockRes();
  const next = vi.fn();

  beforeEach(() => {
    mockClear();
    vi.clearAllMocks();
  });

  it("should return 401 if no user", () => {
    const req = getMockReq();

    hasAccess(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.send).toHaveBeenCalledWith(errors.noToken);
    expect(next).not.toHaveBeenCalled();
  });

  it("should allow access for own user resource", () => {
    const userId = "123";
    const req = getMockReq({
      user: { id: userId },
      params: { id: userId },
    });

    hasAccess(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it("should allow access for admin", () => {
    const req = getMockReq({
      user: { id: "123", role: UserRole.ADMIN },
      params: { id: "456" },
    });

    hasAccess(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it("should return 403 if not admin and not match", () => {
    const req = getMockReq({
      user: { id: "123", role: UserRole.CLIENT },
      params: { id: "456" },
    });

    hasAccess(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.send).toHaveBeenCalledWith(errors.noRights);
    expect(next).not.toHaveBeenCalled();
  });
});



