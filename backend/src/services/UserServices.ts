import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from "../repositories/UserRepository.js";

export class UserService {
    private userRepository = new UserRepository();

    createUser = async (userData: any) => {
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }
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
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        return user;
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
        const users = await this.userRepository.findAll();
        const user = users.find((u: any) => u._id.toString() === id);

        if (user && user.role === 'admin' && userData.ativo === false) {
            throw new Error('Não é permitido desativar um usuário com a função de administrador.');
        }

        // Se uma nova senha for fornecida, faz o hashing dela
        if (userData.password && userData.password.length > 0) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        return await this.userRepository.updateUser(id, userData);
    }
}