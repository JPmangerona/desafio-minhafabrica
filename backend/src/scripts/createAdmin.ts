import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Conectado ao MongoDB...');

    const email = 'joao@admin.com';
    const password = '123';
    
    // Verifica se já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Usuário já existe. Atualizando senha e garantindo que é admin...');
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(password, salt);
      existingUser.role = 'admin';
      existingUser.ativo = true;
      await existingUser.save();
      console.log('Usuário atualizado com sucesso!');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: 'Joao Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        ativo: true
      });

      await newUser.save();
      console.log('Novo usuário administrador criado com sucesso!');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  }
}

createAdmin();
