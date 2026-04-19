import type { Request, Response } from "express";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

export class DashboardController {
    getStats = async (req: Request, res: Response) => {
        try {
            const [userCount, products, categoryCount] = await Promise.all([
                User.countDocuments({ ativo: true }),
                Product.find({ ativo: true }),
                Category.countDocuments({ ativo: true })
            ]);

            const inventoryValue = products.reduce((acc: number, p: any) => acc + (p.custo || 0) * p.estoque, 0);

            return res.status(200).json({
                success: true,
                data: {
                    users: userCount,
                    products: products.length,
                    categories: categoryCount,
                    inventoryValue
                }
            });
        } catch (error: any) {
            console.error("Erro ao carregar estatísticas do dashboard:", error);
            return res.status(500).json({
                success: false,
                message: "Erro ao carregar estatísticas do dashboard"
            });
        }
    }
}
