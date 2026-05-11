import User from "../models/UserModel.js";

export class UserRepository {
    saveUser = async (userData: any) => {
        // O userData já deve vir com o tenant_id incluído pelo Controller/Service
        const newUser = new User(userData);
        return await newUser.save();
    }

    // [MULTI-TENANT] Lista todos os usuários de um tenant específico.
    // Se tenantId for undefined (superadmin), retorna TODOS os usuários de TODAS as lojas.
    findAll = async (tenantId?: string) => {
        const filter = tenantId ? { tenant_id: tenantId } : {};
        return await User.find(filter);
    }

    findByName = async (name: string) => {
        return await User.findOne({ name });
    }

    findById = async (id: string) => {
        return await User.findById(id);
    }

    // Hard delete removendo o documento permanentemente
    deleteByName = async (name: string): Promise<any> => {
        return await User.deleteOne({ name });
    }

    deleteById = async (id: string): Promise<any> => {
        return await User.findByIdAndDelete(id);
    }

    getUserByEmailAndPassword = async (email: string, password: string) => {
        return await User.findOne({ email, password, ativo: true });
    }

    findByEmail = async (email: string) => {
        return await User.findOne({ email, ativo: true });
    }

    findByEmailWithPassword = async (email: string) => {
        // [MULTI-TENANT] Adicionamos '+tenant_id' e '+permissions' ao select para que o JWT possa incluir ambos
        return await User.findOne({ email, ativo: true }).select('+password +tenant_id +permissions');
    }

    updateUser = async (id: string, userData: any) => {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }
}
