import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

/**
 * Middleware que extrai o tenant_id do usuário autenticado (vindo do JWT)
 * e o injeta em req.tenantId para uso nos Controllers/Services/Repositories.
 * 
 * Regras:
 * - Superadmin: NÃO tem tenant_id. Ele pode ver dados gerais (apenas usuários de outros tenants).
 * - Admin/Editor/etc: DEVEM ter um tenant_id associado. Todas as operações são filtradas por ele.
 */
export const tenantContext = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new AppError('Usuário não autenticado.', 401);
    }

    // Superadmin não pertence a nenhum tenant
    if (req.user.role === 'superadmin') {
        return next();
    }

    // Para todos os outros roles, o tenant_id é obrigatório
    if (!req.user.tenant_id) {
        throw new AppError('Usuário sem loja (tenant) vinculada. Contate o administrador.', 403);
    }

    // Injeta o tenantId no request para fácil acesso nas camadas abaixo
    req.tenantId = req.user.tenant_id;

    return next();
};
