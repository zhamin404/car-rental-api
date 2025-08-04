import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUri = process.env.DB_CONNECTION_STRING;

if (!dbUri) {
    console.error('DB URI is not defined in .env');
    process.exit(1);
}

mongoose.connect(dbUri)
    .then(() => {
        console.log('db connected');
    })
    .catch((error) => {
        console.error('error connect:', error);
        process.exit(1);
    });
