import type { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService.js";

export class CategoryController {
    private categoryService = new CategoryService();

    create = async (req: Request, res: Response) => {
        try {
            const data = { ...req.body };
            if (data.ordem) data.ordem = Number(data.ordem);
            if (data.ativo !== undefined) data.ativo = data.ativo === 'true';

            const imagem_url = req.file
                ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
                : req.body.imagem_url;
            const category = await this.categoryService.createCategory({ ...data, imagem_url });
            return res.status(201).json(category);
        } catch (error: any) {
            console.error("Erro ao criar categoria:", error);
            return res.status(400).json({ message: error.message });
        }
    }

    list = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getActiveCategoriesForPublic();
        return res.status(200).json(categories);
    }

    listAdmin = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getAllCategoriesForAdmin();
        return res.status(200).json(categories);
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        await this.categoryService.deleteCategory(id);
        return res.status(200).json({ message: "Categoria removida permanentemente" });
    }

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const data = { ...req.body };
            if (data.ordem) data.ordem = Number(data.ordem);
            if (data.ativo !== undefined) data.ativo = data.ativo === 'true';

            if (req.file) {
                data.imagem_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }

            const category = await this.categoryService.updateCategory(id, data);
            return res.status(200).json(category);
        } catch (error: any) {
            console.error("Erro ao atualizar categoria:", error);
            return res.status(400).json({ message: error.message });
        }
    }
}
