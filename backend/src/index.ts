import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';
import type { Request, Response } from 'express';
import { router } from './routes.js';
import { connectDB } from './config/database.js';
import { errorMiddleware } from './shared/middlewares/errorMiddleware.js';

connectDB();

const server = express();
server.use(cors());
server.use(express.json());
server.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

server.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] Recebi um ${req.method} em ${req.url}`);
    next();
});

server.use(router);

server.get('/', (request: Request, response: Response) => {
    return response.status(200).json({ message: 'Hello World!' });
});

// Middleware de Erro Global (Deve vir depois das rotas)
server.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});