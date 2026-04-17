import { CategoryRepository } from "../repositories/CategoryRepository.js";

export class CategoryService {
    private categoryRepository = new CategoryRepository();

    createCategory = async (categoryData: any) => {
        return await this.categoryRepository.save(categoryData);
    }

    getAllCategories = async () => {
        return await this.categoryRepository.findAll();
    }

    getCategoryById = async (id: string) => {
        return await this.categoryRepository.findById(id);
    }

    deleteCategory = async (id: string) => {
        return await this.categoryRepository.delete(id);
    }

    updateCategory = async (id: string, data: any) => {
        return await this.categoryRepository.update(id, data);
    }
}
