import { ProductRepository } from "../repositories/ProductRepository.js";
import { CategoryRepository } from "../repositories/CategoryRepository.js";

export class ProductService {
    private productRepository = new ProductRepository();
    private categoryRepository = new CategoryRepository();

    createProduct = async (productData: any) => {
        // Se a categoria vier vazia ou como placeholder, removemos para evitar erro de cast do MongoDB
        if (!productData.categoria || productData.categoria.includes("COLE_O_ID")) {
            delete productData.categoria;
        }
        return await this.productRepository.save(productData);
    }

    getAllProducts = async () => {
        return await this.productRepository.findAll();
    }

    getProductsByCategory = async (categoryId: string) => {
        return await this.productRepository.findByCategory(categoryId);
    }

    getProductById = async (id: string) => {
        return await this.productRepository.findById(id);
    }

    deleteProduct = async (id: string) => {
        return await this.productRepository.delete(id);
    }
}
