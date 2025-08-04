import dotenv from 'dotenv';
import {UserRole} from "../user/user.constats";

dotenv.config();

const defaultPort = 3000;
const defaultHost = 'localhost';

export const server = {
    port: process.env.PORT || defaultPort,
    host: process.env.HOST || defaultHost,
};

declare global {
    namespace Express {
        interface Request {
            user?: { id?: string; role?: UserRole }
        }
    }
}
