import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor, forneça um endereço de email válido'] 
    },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['admin', 'cliente', 'visualizador', 'editor'], 
        default: 'cliente' 
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
