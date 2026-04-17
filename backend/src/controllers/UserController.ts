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

        await userService.createUser(user.name, user.email, user.password)
        return response.status(201).json({ message: 'User created' })
    }

    getAllUsers = async (request: Request, response: Response) => {
        const userService = new UserService();
        const users = await userService.getAllUsers()
        return response.status(200).json(users)
    }

    deleteUser = async (request: Request, response: Response) => {
        const userService = new UserService();
        const user = request.body
        const result = await userService.deleteUser(user.name)
        return response.status(200).json(result)
    }
}


