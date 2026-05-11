import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor, forneça um endereço de email válido'] 
    },
    password: { type: String, required: true, select: false },
    role: { 
        type: String, 
        required: true, 
        enum: ['superadmin', 'admin', 'cliente', 'visualizador', 'editor'], 
        default: 'cliente' 
    },
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant',
        required: false // superadmin não pertence a nenhum tenant
    },
    permissions: {
        type: [String],
        default: [] // Array vazio por padrão
    },
    cpf: { type: String, required: false },
    endereco: {
        rua: { type: String },
        numero: { type: String },
        cidade: { type: String },
        cep: { type: String }
    },
    ativo: { type: Boolean, default: true }
})

const User = mongoose.model("user", userSchema);

export default User;
