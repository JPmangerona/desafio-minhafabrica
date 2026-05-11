import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';
import Tenant from '../models/TenantModel.js';

dotenv.config();

/**
 * Script de inicialização (Seed) do sistema Multi-Tenant.
 */
async function seedMultiTenant() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Conectado ao MongoDB para inicialização (Seed Multi-Tenant)...');

    // ===== 1. SUPERADMIN (Dono do Software) =====
    const superadminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const superadminPassword = process.env.ADMIN_PASS || '123456';

    const existingSuperadmin = await User.findOne({ email: superadminEmail });
    if (existingSuperadmin) {
      console.log(`Superadmin "${superadminEmail}" já existe.`);
      const salt = await bcrypt.genSalt(10);
      existingSuperadmin.password = await bcrypt.hash(superadminPassword, salt);
      existingSuperadmin.role = 'superadmin';
      existingSuperadmin.ativo = true;
      existingSuperadmin.tenant_id = undefined;
      await existingSuperadmin.save();
    } else {
      console.log(`Criando Superadmin: ${superadminEmail}...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(superadminPassword, salt);
      await new User({
        name: 'Superadmin do Sistema',
        email: superadminEmail,
        password: hashedPassword,
        role: 'superadmin',
        ativo: true
      }).save();
    }

    // ===== 2. LOJAS (Tenants) =====
    
    // Loja 1: Roupas
    let tenant1 = await Tenant.findOne({ slug: 'loja-roupas' });
    if (!tenant1) {
      console.log('Criando Loja 1 (Roupas)...');
      tenant1 = await new Tenant({ name: 'Loja de Roupas Teste', slug: 'loja-roupas', active: true }).save();
    }

    // Loja 2: Calçados (NOVA LOJA PARA TESTAR ISOLAMENTO)
    let tenant2 = await Tenant.findOne({ slug: 'loja-calcados' });
    if (!tenant2) {
      console.log('Criando Loja 2 (Calçados)...');
      tenant2 = await new Tenant({ name: 'Loja de Calçados Teste', slug: 'loja-calcados', active: true }).save();
    }

    // ===== 3. ADMINS DAS LOJAS =====
    
    const admins = [
      { email: 'admin2@gmail.com', password: '8080', name: 'Admin Roupas 1', tenant: tenant1 },
      { email: 'admin3@gmail.com', password: '8080', name: 'Admin Roupas 2', tenant: tenant1 },
      { email: 'admin4@gmail.com', password: '8080', name: 'Admin Calçados', tenant: tenant2 } // <--- VINCULADO À LOJA 2
    ];

    for (const adminData of admins) {
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log(`Atualizando Admin: ${adminData.email}...`);
        const salt = await bcrypt.genSalt(10);
        existingAdmin.password = await bcrypt.hash(adminData.password, salt);
        existingAdmin.role = 'admin';
        existingAdmin.ativo = true;
        existingAdmin.tenant_id = adminData.tenant!._id;
        await existingAdmin.save();
      } else {
        console.log(`Criando Admin: ${adminData.email}...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        await new User({
          name: adminData.name,
          email: adminData.email,
          password: hashedPassword,
          role: 'admin',
          ativo: true,
          tenant_id: adminData.tenant!._id
        }).save();
      }
    }

    console.log('\n--- RESUMO DO SEED ---');
    console.log(`Superadmin: joao@admin.com / 123 (Vê todos os usuários)`);
    console.log(`Admin 2 & 3: (Loja de Roupas) - Compartilham dados entre si`);
    console.log(`Admin 4: (Loja de Calçados) - ISOLADO (Não vê nada das roupas)`);
    console.log('----------------------\n');

    await mongoose.disconnect();
    console.log('Finalizado e desconectado.');
  } catch (error) {
    console.error('Erro no Seed:', error);
  }
}

seedMultiTenant();
