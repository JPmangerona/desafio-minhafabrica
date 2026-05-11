import type { Request, Response } from "express";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

export class SearchController {
    search = async (req: Request, res: Response) => {
        const query = req.query.q as string;

        // [MULTI-TENANT] Rota pública: precisa receber o tenantId via query param ou header
        // para saber de qual loja buscar os resultados
        const tenantId = req.query.tenant as string || req.headers['x-tenant-id'] as string;

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "É necessário informar o ID da loja (tenant) para realizar a busca."
            });
        }

        if (!query || query.length < 2) {
            return res.status(200).json({ 
                success: true,
                data: { products: [], categories: [] } 
            });
        }

        // Busca por regex (case-insensitive)
        const regex = new RegExp(query, 'i');

        // [MULTI-TENANT] Adicionamos tenant_id nos filtros de busca
        const [products, categories] = await Promise.all([
            Product.find({ 
                nome: { $regex: regex }, 
                ativo: true,
                tenant_id: tenantId  // Filtra pela loja
            }).limit(5).populate('categoria'),
            Category.find({ 
                nome: { $regex: regex }, 
                ativo: true,
                tenant_id: tenantId  // Filtra pela loja
            }).limit(3)
        ]);

        return res.status(200).json({ 
            success: true,
            data: { products, categories } 
        });
    }
}
