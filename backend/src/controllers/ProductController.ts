import type { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";

export class ProductController {
    private productService = new ProductService();

    create = async (req: Request, res: Response) => {
        const data = { ...req.body };
        
        // Converter strings enviadas pelo FormData para Números
        if (data.preco) data.preco = Number(data.preco);
        if (data.custo) data.custo = Number(data.custo);
        if (data.estoque) data.estoque = Number(data.estoque);
        if (data.destaque !== undefined) data.destaque = data.destaque === 'true';
        if (data.ativo !== undefined) data.ativo = data.ativo === 'true';

        const imagem_url = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : req.body.imagem_url;

        // [MULTI-TENANT] Passa o tenantId (vindo do middleware tenantContext) para o Service
        const tenantId = req.tenantId as string;
        const product = await this.productService.createProduct({ ...data, imagem_url }, tenantId);
        
        return res.status(201).json({
            success: true,
            data: product
        });
    }

    list = async (req: Request, res: Response) => {
        // [MULTI-TENANT] Rota pública: precisa receber o tenantId via query param ou header
        // para saber de qual loja mostrar os produtos na vitrine
        const tenantId = req.query.tenant as string || req.headers['x-tenant-id'] as string;

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "É necessário informar o ID da loja (tenant) para listar os produtos."
            });
        }

        const products = await this.productService.getActiveProductsForPublic(tenantId);
        return res.status(200).json({
            success: true,
            data: products
        });
    }

    listAdmin = async (req: Request, res: Response) => {
        // [MULTI-TENANT] O tenantId vem do middleware tenantContext (extraído do JWT)
        const tenantId = req.tenantId as string;
        const products = await this.productService.getAllProductsForAdmin(tenantId);
        return res.status(200).json({
            success: true,
            data: products
        });
    }

    listByCategory = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        // [MULTI-TENANT] Rota pública: precisa receber o tenantId via query param ou header
        const tenantId = req.query.tenant as string || req.headers['x-tenant-id'] as string;

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "É necessário informar o ID da loja (tenant) para listar os produtos."
            });
        }

        const products = await this.productService.getProductsByCategory(id, tenantId);
        return res.status(200).json({
            success: true,
            data: products
        });
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        // [MULTI-TENANT] Passa o tenantId para garantir que só delete produto da própria loja
        const tenantId = req.tenantId as string;
        await this.productService.deleteProduct(id, tenantId);
        return res.status(200).json({ 
            success: true,
            message: "Produto removido permanentemente" 
        });
    }

    update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = { ...req.body };
        
        // Converter strings enviadas pelo FormData para Números
        if (data.preco) data.preco = Number(data.preco);
        if (data.custo) data.custo = Number(data.custo);
        if (data.estoque) data.estoque = Number(data.estoque);
        if (data.destaque !== undefined) data.destaque = data.destaque === 'true';
        if (data.ativo !== undefined) data.ativo = data.ativo === 'true';

        if (req.file) {
            data.imagem_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // [MULTI-TENANT] Passa o tenantId para garantir que só atualize produto da própria loja
        const tenantId = req.tenantId as string;
        const product = await this.productService.updateProduct(id, data, tenantId);
        
        return res.status(200).json({
            success: true,
            data: product
        });
    }
}
