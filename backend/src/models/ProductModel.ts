import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String },
    preco: { type: Number, required: true },
    custo: { type: Number, required: false },
    estoque: { type: Number, required: true, default: 0 },
    imagem_url: { type: String },
    categoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'category',
        required: false 
    },
    ativo: { type: Boolean, default: true },
    destaque: { type: Boolean, default: false },
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant',
        required: true,
        index: true
    }
}, { timestamps: true });

const Product = mongoose.model("product", productSchema);

export default Product;
