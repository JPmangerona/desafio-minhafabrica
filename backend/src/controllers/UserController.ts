import type { Request, Response } from "express";
import { UserService } from "../services/UserServices.js";



export class UserController {
    createUser = async (request: Request, response: Response) => {
        const userService = new UserService();
        const user = request.body;

        await userService.createUser(user);
        
        return response.status(201).json({
            success: true,
            data: { message: 'User created' }
        });
    }

    getAllUsers = async (request: Request, response: Response) => {
        const userService = new UserService();
        const users = await userService.getAllUsers();
        
        return response.status(200).json({
            success: true,
            data: users
        });
    }

    deleteUser = async (request: Request, response: Response) => {
        const userService = new UserService();
        const { id } = request.params;
        
        const result = await userService.deleteUser(id);
        
        return response.status(200).json({
            success: true,
            data: result
        });
    }

    updateUser = async (request: Request, response: Response) => {
        const { id } = request.params;
        const userData = request.body;
        const userService = new UserService();

        const updatedUser = await userService.updateUser(id, userData);
        
        return response.status(200).json({
            success: true,
            data: updatedUser
        });
    }
}


