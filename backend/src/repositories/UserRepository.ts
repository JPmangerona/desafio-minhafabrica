import User from "../models/UserModel.js";

export class UserRepository {
    saveUser = async (userData: any) => {
        const newUser = new User(userData);
        return await newUser.save();
    }

    findAll = async () => {
        return await User.find();
    }

    deleteByName = async (name: string): Promise<{ deletedCount?: number }> => {
        // Soft delete alterando para ativo: false
        return await User.updateOne({ name }, { ativo: false });
    }

    getUserByEmailAndPassword = async (email: string, password: string) => {
        return await User.findOne({ email, password, ativo: true });
    }
}
