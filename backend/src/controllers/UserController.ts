import type { Request, Response } from "express";
import { UserService } from "../services/UserServices.js";



export class UserController {
    createUser = async (request: Request, response: Response) => {
        const userService = new UserService();
        const user = request.body;

        // [MULTI-TENANT] Passa o tenantId para vincular o novo usuário à loja do admin que o está criando
        const tenantId = request.tenantId;
        await userService.createUser(user, tenantId);
        
        return response.status(201).json({
            success: true,
            data: { message: 'User created' }
        });
    }

    getAllUsers = async (request: Request, response: Response) => {
        const userService = new UserService();

        // [MULTI-TENANT] Se for admin de loja, lista apenas os usuários da SUA loja
        // Se for superadmin (tenantId undefined), lista TODOS os usuários
        const tenantId = request.tenantId;
        const users = await userService.getAllUsers(tenantId);
        
        return response.status(200).json({
            success: true,
            data: users
        });
    }

    deleteUser = async (request: Request, response: Response) => {
        const userService = new UserService();
        const { id } = request.params;
        
        const result = await userService.deleteUser(id as string);
        
        return response.status(200).json({
            success: true,
            data: result
        });
    }

    updateUser = async (request: Request, response: Response) => {
        const { id } = request.params;
        const userData = request.body;
        const userService = new UserService();

        const updatedUser = await userService.updateUser(id as string, userData);
        
        return response.status(200).json({
            success: true,
            data: updatedUser
        });
    }
}


