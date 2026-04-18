import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export const authorized = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Usuário não autenticado.', 401);
        }

        if (!roles.includes(req.user.role)) {
            throw new AppError('Você não tem permissão para acessar este recurso.', 403);
        }

        return next();
    };
};
