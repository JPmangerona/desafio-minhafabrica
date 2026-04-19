import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';

dotenv.config();

async function initCustomAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Conectado ao MongoDB para criação do novo admin...');

    const email = 'admin@gmail.com';
    const password = '8080';
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Usuário admin@gmail.com já existe. Atualizando senha...');
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(password, salt);
      existingUser.role = 'admin';
      existingUser.ativo = true;
      await existingUser.save();
      console.log('Senha atualizada com sucesso!');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: 'Sistema Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        ativo: true
      });

      await newUser.save();
      console.log('Novo usuário admin@gmail.com criado com sucesso!');
    }

    await mongoose.disconnect();
    console.log('Desconectado.');
  } catch (error) {
    console.error('Erro ao criar admin customizado:', error);
  }
}

initCustomAdmin();
