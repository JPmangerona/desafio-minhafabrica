import type { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService.js";

export class CategoryController {
    private categoryService = new CategoryService();

    create = async (req: Request, res: Response) => {
        const data = { ...req.body };
        if (data.ordem) data.ordem = Number(data.ordem);
        if (data.ativo !== undefined) data.ativo = data.ativo === 'true';

        const imagem_url = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : req.body.imagem_url;

        // [MULTI-TENANT] Passa o tenantId (vindo do middleware tenantContext) para o Service
        const tenantId = req.tenantId as string;
        const category = await this.categoryService.createCategory({ ...data, imagem_url }, tenantId);
        
        return res.status(201).json({
            success: true,
            data: category
        });
    }

    list = async (req: Request, res: Response) => {
        // [MULTI-TENANT] Rota pública: precisa receber o tenantId via query param ou header
        // para saber de qual loja mostrar as categorias na vitrine
        const tenantId = req.query.tenant as string || req.headers['x-tenant-id'] as string;

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "É necessário informar o ID da loja (tenant) para listar as categorias."
            });
        }

        const categories = await this.categoryService.getActiveCategoriesForPublic(tenantId);
        return res.status(200).json({
            success: true,
            data: categories
        });
    }

    listAdmin = async (req: Request, res: Response) => {
        // [MULTI-TENANT] O tenantId vem do middleware tenantContext (extraído do JWT)
        const tenantId = req.tenantId as string;
        const categories = await this.categoryService.getAllCategoriesForAdmin(tenantId);
        return res.status(200).json({
            success: true,
            data: categories
        });
    }

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            // [MULTI-TENANT] Passa o tenantId para garantir que só delete categoria da própria loja
            const tenantId = req.tenantId as string;
            console.log(`[BACKEND] Tentando excluir categoria ID: ${id} (Loja: ${tenantId})`);
            await this.categoryService.deleteCategory(id, tenantId);
            return res.status(200).json({ 
                success: true,
                message: "Categoria removida permanentemente" 
            });
        } catch (error: any) {
            console.error(`[BACKEND ERROR] Falha ao excluir categoria:`, error);
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Erro no servidor ao excluir catálogo."
            });
        }
    }

    update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = { ...req.body };
        if (data.ordem) data.ordem = Number(data.ordem);
        if (data.ativo !== undefined) data.ativo = data.ativo === 'true';

        if (req.file) {
            data.imagem_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // [MULTI-TENANT] Passa o tenantId para garantir que só atualize categoria da própria loja
        const tenantId = req.tenantId as string;
        const category = await this.categoryService.updateCategory(id, data, tenantId);
        
        return res.status(200).json({
            success: true,
            data: category
        });
    }
}
