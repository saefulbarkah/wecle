import dotenv from 'dotenv';
dotenv.config();

const DB_URL = process.env.DATABASE_URL as string;

export { DB_URL };