import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String },
    imagem_url: { type: String },
    ativo: { type: Boolean, default: true },
    ordem: { type: Number, default: 0 }
}, { timestamps: true });

const Category = mongoose.model("category", categorySchema);

export default Category;
