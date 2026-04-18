import { ProductRepository } from "../repositories/ProductRepository.js";
import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { AppError } from "../shared/errors/AppError.js";

export class ProductService {
    private productRepository = new ProductRepository();
    private categoryRepository = new CategoryRepository();

    createProduct = async (productData: any) => {
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
        
        return await this.productRepository.save(productData);
    }

    getAllProductsForAdmin = async () => {
        return await this.productRepository.findAll();
    }

    getActiveProductsForPublic = async () => {
        return await this.productRepository.findAllActive();
    }

    getProductsByCategory = async (categoryId: string) => {
        return await this.productRepository.findByCategory(categoryId);
    }

    getProductById = async (id: string) => {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError("Produto não encontrado.", 404);
        }
        return product;
    }

    deleteProduct = async (id: string) => {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError("Produto não encontrado para exclusão.", 404);
        }
        return await this.productRepository.delete(id);
    }

    updateProduct = async (id: string, data: any) => {
        if (data.preco !== undefined && data.preco < 0) {
            throw new AppError("O preço do produto não pode ser negativo.", 400);
        }
        
        if (data.estoque !== undefined && data.estoque < 0) {
            throw new AppError("O estoque não pode ser negativo.", 400);
        }

        if (!data.categoria || data.categoria.includes("COLE_O_ID")) {
            delete data.categoria;
        }
        
        const updated = await this.productRepository.update(id, data);
        if (!updated) {
            throw new AppError("Produto não encontrado para atualização.", 404);
        }
        return updated;
    }

    /**
     * Decrementa o estoque de forma atômica para evitar race conditions no checkout.
     * @param id ID do produto
     * @param quantity Quantidade a ser removida
     */
    decrementStock = async (id: string, quantity: number) => {
        if (quantity <= 0) {
            throw new AppError("A quantidade a ser removida deve ser maior que zero.", 400);
        }

        const product = await (this.productRepository as any).getModel().findOneAndUpdate(
            { _id: id, estoque: { $gte: quantity } }, // Filtro: ID correto e estoque suficiente
            { $inc: { estoque: -quantity } },          // Ação: Decrementar quantidade
            { new: true }                              // Opção: Retornar o documento atualizado
        );

        if (!product) {
            throw new AppError("Estoque insuficiente ou produto não encontrado.", 400);
        }

        return product;
    }
}
