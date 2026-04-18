import type { Request, Response } from "express";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

export class SearchController {
    search = async (req: Request, res: Response) => {
        try {
            const query = req.query.q as string;

            if (!query || query.length < 2) {
                return res.status(200).json({ products: [], categories: [] });
            }

            // Busca por regex (case-insensitive)
            const regex = new RegExp(query, 'i');

            const [products, categories] = await Promise.all([
                Product.find({ 
                    nome: { $regex: regex }, 
                    ativo: true 
                }).limit(5).populate('categoria'),
                Category.find({ 
                    nome: { $regex: regex }, 
                    ativo: true 
                }).limit(3)
            ]);

            return res.status(200).json({ products, categories });
        } catch (error: any) {
            console.error("Erro na busca global:", error);
            return res.status(500).json({ message: "Erro ao realizar busca" });
        }
    }
}
