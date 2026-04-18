import type { Request, Response, NextFunction } from 'express';

export const authorized = (allowedRoles: string[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) {
            return response.status(401).json({ message: 'Não autorizado: Usuário não identificado' });
        }

        if (!allowedRoles.includes(request.user.role)) {
            return response.status(403).json({ 
                message: `Acesso negado: Sua função (${request.user.role}) não tem permissão para esta ação.` 
            });
        }

        next();
    };
};
