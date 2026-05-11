import { ProductRepository } from "../repositories/ProductRepository.js";
import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { AppError } from "../shared/errors/AppError.js";

export class ProductService {
    private productRepository = new ProductRepository();
    private categoryRepository = new CategoryRepository();

    // [MULTI-TENANT] Agora recebe o tenantId para vincular o produto à loja correta
    createProduct = async (productData: any, tenantId: string) => {
        if (productData.preco < 0) {
            throw new AppError("O preço do produto não pode ser negativo.", 400);
        }
        
        if (productData.estoque < 0) {
            throw new AppError("O estoque inicial não pode ser negativo.", 400);
        }

        // Se a categoria vier vazia ou como placeholder, removemos para evitar erro de cast do MongoDB
        if (!productData.categoria || productData.categoria.includes("COLE_O_ID")) {
            delete productData.categoria;
        }

        // [MULTI-TENANT] Injeta o tenant_id nos dados antes de salvar
        productData.tenant_id = tenantId;
        
        return await this.productRepository.save(productData);
    }

    // [MULTI-TENANT] Lista todos os produtos APENAS da loja do admin logado
    getAllProductsForAdmin = async (tenantId: string) => {
        return await this.productRepository.findAll(tenantId);
    }

    // [MULTI-TENANT] Lista produtos ativos APENAS da loja (para a vitrine pública)
    getActiveProductsForPublic = async (tenantId: string) => {
        return await this.productRepository.findAllActive(tenantId);
    }

    // [MULTI-TENANT] Lista produtos de uma categoria DENTRO da loja
    getProductsByCategory = async (categoryId: string, tenantId: string) => {
        return await this.productRepository.findByCategory(categoryId, tenantId);
    }

    getProductById = async (id: string, tenantId: string) => {
        const product = await this.productRepository.findById(id, tenantId);
        if (!product) {
            throw new AppError("Produto não encontrado.", 404);
        }
        return product;
    }

    deleteProduct = async (id: string, tenantId: string) => {
        const product = await this.productRepository.findById(id, tenantId);
        if (!product) {
            throw new AppError("Produto não encontrado para exclusão.", 404);
        }
        return await this.productRepository.delete(id, tenantId);
    }

    updateProduct = async (id: string, data: any, tenantId: string) => {
        if (data.preco !== undefined && data.preco < 0) {
            throw new AppError("O preço do produto não pode ser negativo.", 400);
        }
        
        if (data.estoque !== undefined && data.estoque < 0) {
            throw new AppError("O estoque não pode ser negativo.", 400);
        }

        if (!data.categoria || data.categoria.includes("COLE_O_ID")) {
            delete data.categoria;
        }
        
        const updated = await this.productRepository.update(id, data, tenantId);
        if (!updated) {
            throw new AppError("Produto não encontrado para atualização.", 404);
        }
        return updated;
    }

    /**
     * Decrementa o estoque de forma atômica para evitar race conditions no checkout.
     * @param id ID do produto
     * @param quantity Quantidade a ser removida
     * @param tenantId ID da loja (tenant)
     */
    decrementStock = async (id: string, quantity: number, tenantId: string) => {
        if (quantity <= 0) {
            throw new AppError("A quantidade a ser removida deve ser maior que zero.", 400);
        }

        // [MULTI-TENANT] Adicionamos tenant_id no filtro para garantir que só decremente estoque da loja correta
        const product = await (this.productRepository as any).getModel().findOneAndUpdate(
            { _id: id, tenant_id: tenantId, estoque: { $gte: quantity } }, // Filtro: ID + Loja + estoque suficiente
            { $inc: { estoque: -quantity } },          // Ação: Decrementar quantidade
            { new: true }                              // Opção: Retornar o documento atualizado
        );

        if (!product) {
            throw new AppError("Estoque insuficiente ou produto não encontrado.", 400);
        }

        return product;
    }
}
