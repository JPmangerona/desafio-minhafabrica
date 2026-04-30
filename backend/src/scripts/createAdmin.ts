import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Conectado ao MongoDB para inicialização (Seed)...');

    // Aqui está a mágica: Tenta buscar das variáveis de ambiente.
    // Se não existir (em último caso), ele usa um fallback padrão.
    const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const password = process.env.ADMIN_PASS || '123456';
    
    // Verifica se já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Usuário ${email} já existe. Atualizando senha e garantindo tag admin...`);
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(password, salt);
      existingUser.role = 'admin';
      existingUser.ativo = true;
      await existingUser.save();
      console.log('Usuário Master atualizado com sucesso!');
    } else {
      console.log(`Criando o usuário Master Admin: ${email}...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: 'Administrador do Sistema',
        email,
        password: hashedPassword,
        role: 'admin',
        ativo: true
      });

      await newUser.save();
      console.log('Novo usuário administrador criado com sucesso!');
    }

    await mongoose.disconnect();
    console.log('Finalizado e desconectado do banco.');
  } catch (error) {
    console.error('Erro geral ao rodar o Seeder do Admin:', error);
  }
}

createAdmin();
