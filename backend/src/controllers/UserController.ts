import type { Request, Response } from "express";
import { UserService } from "../services/UserServices.js";



export class UserController {
    createUser = async (request: Request, response: Response) => {
        console.log("--> Recebi uma requisição POST em /user!")
        const userService = new UserService();
        const user = request.body

        if (!user.name || !user.email || !user.password) {
            return response.status(400).json({ message: 'Bad request! nome, email e password obrigatorios' })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            return response.status(400).json({ message: 'Formato de email inválido! O email deve conter "@" e um domínio válido.' })
        }

        await userService.createUser(user)
        return response.status(201).json({ message: 'User created' })
    }

    getAllUsers = async (request: Request, response: Response) => {
        const userService = new UserService();
        const users = await userService.getAllUsers()
        return response.status(200).json(users)
    }

    deleteUser = async (request: Request, response: Response) => {
        const userService = new UserService();
        const { name } = request.body;
        
        try {
            const result = await userService.deleteUser(name);
            return response.status(200).json(result);
        } catch (error: any) {
            return response.status(403).json({ message: error.message });
        }
    }

    updateUser = async (request: Request, response: Response) => {
        const { id } = request.params;
        const userData = request.body;
        const userService = new UserService();

        try {
            if (userData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(userData.email)) {
                    return response.status(400).json({ message: 'Formato de email inválido! O email deve conter "@" e um domínio válido.' });
                }
            }
            const updatedUser = await userService.updateUser(id, userData);
            if (!updatedUser) {
                return response.status(404).json({ message: 'User not found' });
            }
            return response.status(200).json(updatedUser);
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error', error });
        }
    }
}


