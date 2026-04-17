import type { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService.js";

export class CategoryController {
    private categoryService = new CategoryService();

    create = async (req: Request, res: Response) => {
        try {
            const category = await this.categoryService.createCategory(req.body);
            return res.status(201).json(category);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    list = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getAllCategories();
        return res.status(200).json(categories);
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        await this.categoryService.deleteCategory(id);
        return res.status(200).json({ message: "Categoria removida (Soft Delete)" });
    }
}
