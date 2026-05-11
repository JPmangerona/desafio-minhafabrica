import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export const hasPermission = (requiredPermission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Usuario nao autenticado.', 401);
        }

        if (req.user.role === 'admin' || req.user.role === 'superadmin') {
            return next();
        }

        if (req.user.permissions?.includes(requiredPermission)) {
            return next();
        }

        throw new AppError('Acesso negado.', 403);
    };
};
