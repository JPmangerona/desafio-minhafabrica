import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { UserService } from '../services/UserServices.js';

export class LoginController {
    login = async (request: Request, response: Response) => {
        const { email, password } = request.body;
        const userService = new UserService();

        const token = await userService.getToken(email, password);

        if (!token) {
            return response.status(401).json({ message: 'Email ou senha inválidos' });
        }

        return response.status(200).json({ token });
    }
}
