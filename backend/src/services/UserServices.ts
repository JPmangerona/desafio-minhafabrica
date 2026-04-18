import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/UserRepository.js";

export class UserService {
    private userRepository = new UserRepository();

    createUser = async (userData: any) => {
        await this.userRepository.saveUser(userData);
    }

    getAllUsers = async () => {
        return await this.userRepository.findAll();
    }

    deleteUser = async (name: string) => {
        const user = await this.userRepository.findByName(name);
        
        if (!user) {
            return { message: 'User not found' };
        }

        if (user.role === 'admin') {
            throw new Error('Não é permitido excluir usuários com a função de administrador.');
        }

        const result = await this.userRepository.deleteByName(name);
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
        const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, secret, { expiresIn: '1d' });

        return token;
    }

    updateUser = async (id: string, userData: any) => {
        return await this.userRepository.updateUser(id, userData);
    }
}