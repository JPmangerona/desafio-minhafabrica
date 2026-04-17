import type { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";

export class ProductController {
    private productService = new ProductService();

    create = async (req: Request, res: Response) => {
        try {
            const data = { ...req.body };
            
            // Converter strings enviadas pelo FormData para Números
            if (data.preco) data.preco = Number(data.preco);
            if (data.custo) data.custo = Number(data.custo);
            if (data.estoque) data.estoque = Number(data.estoque);
            if (data.destaque !== undefined) data.destaque = data.destaque === 'true';

            const imagem_url = req.file
                ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
                : req.body.imagem_url;

            const product = await this.productService.createProduct({ ...data, imagem_url });
            return res.status(201).json(product);
        } catch (error: any) {
            console.error("Erro ao criar produto:", error);
            return res.status(400).json({ message: error.message });
        }
    }

    list = async (req: Request, res: Response) => {
        const products = await this.productService.getAllProducts();
        return res.status(200).json(products);
    }

    listByCategory = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const products = await this.productService.getProductsByCategory(id);
        return res.status(200).json(products);
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        await this.productService.deleteProduct(id);
        return res.status(200).json({ message: "Produto removido (Soft Delete)" });
    }

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const data = { ...req.body };
            
            // Converter strings enviadas pelo FormData para Números
            if (data.preco) data.preco = Number(data.preco);
            if (data.custo) data.custo = Number(data.custo);
            if (data.estoque) data.estoque = Number(data.estoque);
            if (data.destaque !== undefined) data.destaque = data.destaque === 'true';

            if (req.file) {
                data.imagem_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }

            const product = await this.productService.updateProduct(id, data);
            return res.status(200).json(product);
        } catch (error: any) {
            console.error("Erro ao atualizar produto:", error);
            return res.status(400).json({ message: error.message });
        }
    }
}
