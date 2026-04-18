import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';

interface TokenPayload {
    name: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token JWT não fornecido.', 401);
    }

    // O header vem no formato "Bearer <token>"
    const [, token] = authHeader.split(' ');

    if (!token) {
        throw new AppError('Token JWT malformatado.', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const { name, email, role } = decoded as TokenPayload;

        // Adiciona dados do usuário no Request para uso posterior
        req.user = { name, email, role };

        return next();
    } catch (err) {
        throw new AppError('Token JWT inválido ou expirado.', 401);
    }
};
