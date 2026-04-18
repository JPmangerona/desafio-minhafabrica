import mongoose from 'mongoose';
import User from './src/models/UserModel';

async function check() {
    try {
        await mongoose.connect('mongodb://localhost:27017/minhafabrica');
        const users = await User.find({}, 'name email role');
        console.log('USUARIOS NO BANCO:');
        console.log(JSON.stringify(users, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
