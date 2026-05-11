import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { UserService } from '../services/UserServices.js';

export class LoginController {
    login = async (request: Request, response: Response) => {
        const { email, password } = request.body;
        const userService = new UserService();

        const token = await userService.getToken(email, password);
        const user = await userService.getAuthenticatedUser(email, password);

        // O UserService.getToken já lança AppError se falhar, 
        // mas pegamos o user para retornar os dados adicionais.
        
        return response.status(200).json({
            success: true,
            data: { 
                token, 
                role: user?.role, 
                name: user?.name,
                // [MULTI-TENANT] Retorna o tenant_id para o frontend saber de qual loja é o usuário
                tenant_id: user?.tenant_id ? user.tenant_id.toString() : undefined
            }
        });
    }
}
