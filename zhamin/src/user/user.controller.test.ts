import {describe, expect, it, vi, beforeEach} from 'vitest';
import {getMockReq, getMockRes} from 'vitest-mock-express';
import {StatusCodes} from 'http-status-codes';
import * as userService from './user.service';
import {
    createUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    updateDrivingLicenseController,
    updateFavoriteCarsId,
} from './user.controller';
import {UserRole} from "./user.constats";
import {defaultServerError} from "../utils/error-handler";

vi.mock('./user.service');
vi.mock('./user.middleware');

describe('createUserController', () => {
    const {res, mockClear} = getMockRes();

    beforeEach(() => {
        mockClear();
        vi.clearAllMocks();
    });

    it('should create user', async () => {
        const mockUserData = {
            name: 'John',
            email: 'john@mail.com',
            password: 'password123'
        };
        const mockCreatedUser = {
            id: '123',
            ...mockUserData,
            role: UserRole.CLIENT,
        };
        const req = getMockReq({
            body: mockUserData
        });
        vi.mocked(userService.createUser).mockResolvedValue(mockCreatedUser);

        await createUserController(req, res);

        expect(userService.createUser).toHaveBeenCalledWith(mockUserData);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(res.send).toHaveBeenCalledWith(mockCreatedUser);
    })

    it('should response with an error', async () => {
        const req = getMockReq();
        const errorResponse = {error: 'Database error'};
        vi.mocked(userService.createUser).mockRejectedValue(errorResponse);
        await createUserController(req, res);

        expect(userService.createUser).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith(defaultServerError);
    })
})

describe('updateUserController', () => {
    const {res, mockClear} = getMockRes();

    beforeEach(() => {
        mockClear();
        vi.clearAllMocks();
    });

    it('should update user', async () => {
        const mockUserData = {
            name: 'Johnchange',
            email: 'johnchange@mail.com',
            password: 'password123'
        };
        const mockUpdatedUser = {
            id: '123',
            ...mockUserData,
            role: UserRole.CLIENT,
        };
        const req = getMockReq({
            body: mockUserData,
            params: {id:"123"}
        });
        const {id} = req.params
        vi.mocked(userService.updateUser).mockResolvedValue(mockUpdatedUser);

        await updateUserController(req, res);

        expect(userService.updateUser).toHaveBeenCalledWith(id, mockUserData);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith(mockUpdatedUser);
    })

    it('should response with an error', async () => {
        const req = getMockReq();
        const errorResponse = {error: 'Database error'};
        vi.mocked(userService.updateUser).mockRejectedValue(errorResponse);
        await updateUserController(req, res);

        expect(userService.updateUser).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith(defaultServerError);
    })
})



describe('getUserController', () => {
    const {res, mockClear} = getMockRes();

    beforeEach(() => {
        mockClear();
        vi.clearAllMocks();
    });

    it('should update user', async () => {
        const mockUserData = {
            name: 'John',
            email: 'john@mail.com',
            password: 'password123'
        };
        const mockGetUser = {
            id: '123',
            ...mockUserData,
            role: UserRole.CLIENT,
        };
        const req = getMockReq({
            body: mockUserData,
            params: {id:"123"}
        });
        const {id} = req.params
        vi.mocked(userService.getUserById).mockResolvedValue(mockGetUser);

        await getUserByIdController(req, res);

        expect(userService.getUserById).toHaveBeenCalledWith(id);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith(mockGetUser);
    })

    it('should response with an error', async () => {
        const req = getMockReq();
        const errorResponse = {error: 'Database error'};
        vi.mocked(userService.getUserById).mockRejectedValue(errorResponse);
        await getUserByIdController(req, res);

        expect(userService.getUserById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith(defaultServerError);
    })
})

describe('deleteUserController', () => {
    const {res, mockClear} = getMockRes();

    beforeEach(() => {
        mockClear();
        vi.clearAllMocks();
    });

    it('should delete user', async () => {
        const mockUserData = {
            name: 'John',
            email: 'john@mail.com',
            password: 'password123',
            role: UserRole.CLIENT,
        };
        const mockDeleteUser = {
            id: '123',
            ...mockUserData,
            
        };
        const req = getMockReq({
            body: mockUserData,
            params: {id:"123"}
        });
        const {id} = req.params
        vi.mocked(userService.deleteUser).mockResolvedValue(mockDeleteUser);

        await deleteUserController(req, res);

        expect(userService.deleteUser).toHaveBeenCalledWith(id);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith(mockDeleteUser);
    })

    it('should response with an error', async () => {
        const req = getMockReq();
        const errorResponse = {error: 'Database error'};
        vi.mocked(userService.deleteUser).mockRejectedValue(errorResponse);
        await deleteUserController(req, res);

        expect(userService.deleteUser).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith(defaultServerError);
    })
})

describe('updateDrivingLicenseController', () => {
    const {res, mockClear} = getMockRes();

    beforeEach(() => {
        mockClear();
        vi.clearAllMocks();
    });

    it('should update driving licenseuser to user ', async () => {
        const mockUserData = {   
            number: "DL-123456789",
            issueDate: "2020-01-15T00:00:00.000Z",
            expiryDate: "2030-01-15T00:00:00.000Z"
        };
        const mockUpdatedUser = {
            id: '123',
            name: 'John',
            email: 'john@mail.com',
            password: 'password123',
            role: UserRole.CLIENT,
            ...mockUserData,
            
        };
        const req = getMockReq({
            body: mockUserData,
            params: {id:"123"}
        });
        const {id} = req.params
        vi.mocked(userService.updateDrivingLicenseToUser).mockResolvedValue(mockUpdatedUser);

        await updateDrivingLicenseController(req, res);

        expect(userService.updateDrivingLicenseToUser).toHaveBeenCalledWith(id, mockUserData);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith(mockUpdatedUser);
    })

    it('should response with an error', async () => {
        const req = getMockReq();
        const errorResponse = {error: 'Database error'};
        vi.mocked(userService.updateDrivingLicenseToUser).mockRejectedValue(errorResponse);
        await updateDrivingLicenseController(req, res);

        expect(userService.updateDrivingLicenseToUser).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith(defaultServerError);
    })
})

describe('updateFavoriteCarsIdController', () => {
    const {res, mockClear} = getMockRes();

    beforeEach(() => {
        mockClear();
        vi.clearAllMocks();
    });

    it('should update favorite Cars Id to user ', async () => {
        const mockUserData = {
            favoriteCarsId: ["car1", "car2", "car3"]
        };
        const mockUpdatedUser = {
            id: '123',
            name: 'John',
            email: 'john@mail.com',
            password: 'password123',
            role: UserRole.CLIENT,
            ...mockUserData,
            
        };
        const req = getMockReq({
            body: mockUserData,
            params: {id:"123"}
        });
        const {id} = req.params
        vi.mocked(userService.updateFavoriteCarsIdToUser).mockResolvedValue(mockUpdatedUser);

        await updateFavoriteCarsId(req, res);

        expect(userService.updateFavoriteCarsIdToUser).toHaveBeenCalledWith(id, mockUserData);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith(mockUpdatedUser);
    })

    it('should response with an error', async () => {
        const req = getMockReq();
        const errorResponse = {error: 'Database error'};
        vi.mocked(userService.updateFavoriteCarsIdToUser).mockRejectedValue(errorResponse);
        await updateFavoriteCarsId(req, res);

        expect(userService.updateFavoriteCarsIdToUser).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith(defaultServerError);
    })
})