import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const getToken = (request: Request): string | null => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return null;

    const scheme = parts[0];
    const token = parts[1];

    if (!scheme || !token || !/^Bearer$/i.test(scheme)) {
        return null;
    }

    return token;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                name: string;
                email: string;
                role: string;
            };
        }
    }
}

export const authenticated = (request: Request, response: Response, next: NextFunction) => {
    const token = getToken(request);
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
        return response.status(401).json({ message: 'Não autorizado: Token não fornecido ou inválido' });
    }

    try {
        const decoded = jwt.verify(token, secret) as any;
        request.user = decoded;
        next();
    } catch (error) {
        return response.status(401).json({ message: 'Não autorizado: Token inválido ou expirado' });
    }
}
