import User from "../models/UserModel.js";

export class UserRepository {
    saveUser = async (userData: any) => {
        const newUser = new User(userData);
        return await newUser.save();
    }

    findAll = async () => {
        return await User.find();
    }

    findByName = async (name: string) => {
        return await User.findOne({ name });
    }

    deleteByName = async (name: string): Promise<any> => {
        // Hard delete removendo o documento permanentemente
        return await User.deleteOne({ name });
    }

    getUserByEmailAndPassword = async (email: string, password: string) => {
        return await User.findOne({ email, password, ativo: true });
    }

    findByEmail = async (email: string) => {
        return await User.findOne({ email, ativo: true });
    }

    updateUser = async (id: string, userData: any) => {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }
}
