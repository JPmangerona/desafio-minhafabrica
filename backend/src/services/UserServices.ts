import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from "../repositories/UserRepository.js";
import { AppError } from "../shared/errors/AppError.js";

export class UserService {
    private userRepository = new UserRepository();

    // [MULTI-TENANT] Agora recebe tenantId para vincular o usuário criado à loja correta
    createUser = async (userData: any, tenantId?: string) => {
        const { name, email, password } = userData;

        if (!name || !email || !password) {
            throw new AppError('Nome, email e senha são obrigatórios', 400);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppError('Formato de email inválido', 400);
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError('Este email já está em uso', 400);
        }

        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(password, salt);

        // [MULTI-TENANT] Se o tenantId foi passado, vincula o novo usuário a essa loja
        if (tenantId) {
            userData.tenant_id = tenantId;
        }
        
        await this.userRepository.saveUser(userData);
    }

    // [MULTI-TENANT] Recebe tenantId opcional:
    //   - Se for admin de loja: lista apenas os usuários da SUA loja
    //   - Se for superadmin (sem tenantId): lista TODOS os usuários de TODAS as lojas
    getAllUsers = async (tenantId?: string) => {
        return await this.userRepository.findAll(tenantId);
    }

    deleteUser = async (id: string) => {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        if (user.role === 'admin') {
            throw new AppError('Não é permitido excluir usuários com a função de administrador.', 403);
        }

        await this.userRepository.deleteById(id);
        return { message: 'Usuário excluído com sucesso' };
    }

    getAuthenticatedUser = async (email: string, password: string) => {
        const user = await this.userRepository.findByEmailWithPassword(email);

        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        return user;
    }

    // [MULTI-TENANT] O token JWT agora inclui id e tenant_id do usuário
    getToken = async (email: string, password: string) => {
        const user = await this.getAuthenticatedUser(email, password);

        if (!user) {
            throw new AppError('Email ou senha inválidos', 401);
        }

        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign(
            { 
                id: user._id.toString(),
                name: user.name, 
                email: user.email, 
                role: user.role,
                permissions: user.permissions || [],
                // [MULTI-TENANT] Se o usuário pertence a uma loja, inclui o tenant_id no token
                tenant_id: user.tenant_id ? user.tenant_id.toString() : undefined
            }, 
            secret, 
            { expiresIn: '1d' }
        );

        return token;
    }

    updateUser = async (id: string, userData: any) => {
        const users = await this.userRepository.findAll();
        const user = users.find((u: any) => u._id.toString() === id);

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        if (user.role === 'admin' && userData.ativo === false) {
            throw new AppError('Não é permitido desativar um usuário com a função de administrador.', 403);
        }

        if (userData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new AppError('Formato de email inválido', 400);
            }
        }

        // Se uma nova senha for fornecida, faz o hashing dela
        if (userData.password && userData.password.length > 0) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        return await this.userRepository.updateUser(id, userData);
    }
}
