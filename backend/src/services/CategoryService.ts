import { CategoryRepository } from "../repositories/CategoryRepository.js";

export class CategoryService {
    private categoryRepository = new CategoryRepository();

    createCategory = async (categoryData: any) => {
        // Validação de número positivo
        if (categoryData.ordem !== undefined && categoryData.ordem <= 0) {
            throw new Error("A ordem deve ser um número maior que zero.");
        }

        // Validação de unicidade
        if (categoryData.ordem !== undefined) {
            const existing = await this.categoryRepository.findByOrder(categoryData.ordem);
            if (existing) {
                throw new Error(`A ordem #${categoryData.ordem} já está em uso por outra categoria.`);
            }
        }

        return await this.categoryRepository.save(categoryData);
    }

    getAllCategoriesForAdmin = async () => {
        return await this.categoryRepository.findAll();
    }

    getActiveCategoriesForPublic = async () => {
        return await this.categoryRepository.findAllActive();
    }

    getCategoryById = async (id: string) => {
        return await this.categoryRepository.findById(id);
    }

    deleteCategory = async (id: string) => {
        return await this.categoryRepository.delete(id);
    }

    updateCategory = async (id: string, data: any) => {
        // Validação de número positivo
        if (data.ordem !== undefined && data.ordem <= 0) {
            throw new Error("A ordem deve ser um número maior que zero.");
        }

        // Validação de unicidade (ignora a própria categoria)
        if (data.ordem !== undefined) {
            const existing = await this.categoryRepository.findByOrder(data.ordem);
            if (existing && existing._id.toString() !== id) {
                throw new Error(`A ordem #${data.ordem} já está em uso por outra categoria.`);
            }
        }

        return await this.categoryRepository.update(id, data);
    }
}
