import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/UserRepository.js";

export class UserService {
    private userRepository = new UserRepository();

    createUser = async (name: string, email: string, password: string) => {
        await this.userRepository.saveUser(name, email, password);
    }

    getAllUsers = async () => {
        return await this.userRepository.findAll();
    }

    deleteUser = async (name: string) => {
        const result = await this.userRepository.deleteByName(name);
        if (result.deletedCount === 0) {
            return { message: 'User not found' }
        }
        return { message: 'User deleted' }
    }

    getAuthenticatedUser = async (email: string, password: string) => {
        return await this.userRepository.getUserByEmailAndPassword(email, password);
    }

    getToken = async (email: string, password: string) => {
        const user = await this.getAuthenticatedUser(email, password);

        if (!user) {
            return null;
        }

        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign({ name: user.name, email: user.email }, secret, { expiresIn: '1d' });

        return token;
    }
}