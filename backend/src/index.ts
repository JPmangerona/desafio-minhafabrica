import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import { router } from './routes.js';
import { connectDB } from './config/database.js';

connectDB();

const server = express();
server.use(cors());
server.use(express.json());

server.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] Recebi um ${req.method} em ${req.url}`);
    next();
});

server.use(router)

server.get('/', (request: Request, response: Response) => {
    return response.status(200).json({ message: 'Hello World!' });
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});