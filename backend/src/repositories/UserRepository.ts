import User from "../models/UserModel.js";

export class UserRepository {
    saveUser = async (name: string, email: string, password: string) => {
        const newUser = new User({
            name,
            email,
            password
        });
        return await newUser.save();
    }

    findAll = async () => {
        return await User.find();
    }

    deleteByName = async (name: string): Promise<{ deletedCount?: number }> => {
        return await User.deleteOne({ name });
    }

    getUserByEmailAndPassword = async (email: string, password: string) => {
        return await User.findOne({ email, password });
    }
}
