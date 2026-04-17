import type { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";

export class ProductController {
    private productService = new ProductService();

    create = async (req: Request, res: Response) => {
        try {
            const product = await this.productService.createProduct(req.body);
            return res.status(201).json(product);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    list = async (req: Request, res: Response) => {
        const products = await this.productService.getAllProducts();
        return res.status(200).json(products);
    }

    listByCategory = async (req: Request, res: Response) => {
        const { id } = req.params;
        const products = await this.productService.getProductsByCategory(id);
        return res.status(200).json(products);
    }

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.productService.deleteProduct(id);
        return res.status(200).json({ message: "Produto removido (Soft Delete)" });
    }
}
