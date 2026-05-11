import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { AppError } from "../shared/errors/AppError.js";
import Product from "../models/ProductModel.js";

export class CategoryService {
    private categoryRepository = new CategoryRepository();

    // [MULTI-TENANT] Agora recebe o tenantId para vincular a categoria à loja correta
    createCategory = async (categoryData: any, tenantId: string) => {
        // Validação de número positivo
        if (categoryData.ordem !== undefined && categoryData.ordem <= 0) {
            throw new AppError("A ordem deve ser um número maior que zero.", 400);
        }

        // Validação de unicidade (DENTRO da mesma loja, não globalmente)
        if (categoryData.ordem !== undefined) {
            const existing = await this.categoryRepository.findByOrder(categoryData.ordem, tenantId);
            if (existing) {
                throw new AppError(`A ordem #${categoryData.ordem} já está em uso por outra categoria.`, 400);
            }
        }

        // [MULTI-TENANT] Injeta o tenant_id nos dados antes de salvar
        categoryData.tenant_id = tenantId;

        return await this.categoryRepository.save(categoryData);
    }

    // [MULTI-TENANT] Lista todas as categorias APENAS da loja do admin logado
    getAllCategoriesForAdmin = async (tenantId: string) => {
        return await this.categoryRepository.findAll(tenantId);
    }

    // [MULTI-TENANT] Lista categorias ativas APENAS da loja (para a vitrine pública)
    getActiveCategoriesForPublic = async (tenantId: string) => {
        return await this.categoryRepository.findAllActive(tenantId);
    }

    getCategoryById = async (id: string, tenantId: string) => {
        return await this.categoryRepository.findById(id, tenantId);
    }

    deleteCategory = async (id: string, tenantId: string) => {
        // Verificar se existem produtos vinculados (DENTRO da mesma loja)
        const productsCount = await Product.countDocuments({ categoria: id, tenant_id: tenantId });
        
        if (productsCount > 0) {
            throw new AppError(`Não é possível excluir: existem ${productsCount} produtos vinculados a este catálogo. Primeiro, mova ou exclua esses produtos.`, 400);
        }

        return await this.categoryRepository.delete(id, tenantId);
    }

    updateCategory = async (id: string, data: any, tenantId: string) => {
        // Validação de número positivo
        if (data.ordem !== undefined && data.ordem <= 0) {
            throw new AppError("A ordem deve ser um número maior que zero.", 400);
        }

        // Validação de unicidade (ignora a própria categoria, DENTRO da mesma loja)
        if (data.ordem !== undefined) {
            const existing = await this.categoryRepository.findByOrder(data.ordem, tenantId);
            if (existing && existing._id.toString() !== id) {
                throw new AppError(`A ordem #${data.ordem} já está em uso por outra categoria.`, 400);
            }
        }

        return await this.categoryRepository.update(id, data, tenantId);
    }
}
