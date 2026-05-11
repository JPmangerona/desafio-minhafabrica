import Product from "../models/ProductModel.js";

export class ProductRepository {
    save = async (productData: any) => {
        // O productData já deve vir com o tenant_id incluído pelo Controller
        const newProduct = new Product(productData);
        return await newProduct.save();
    }

    // [MULTI-TENANT] Retorna todos os produtos APENAS da loja logada
    findAll = async (tenantId: string) => {
        return await Product.find({ tenant_id: tenantId }).populate('categoria');
    }

    // [MULTI-TENANT] Retorna produtos ativos APENAS da loja logada (para a vitrine pública)
    findAllActive = async (tenantId: string) => {
        return await Product.find({ ativo: true, tenant_id: tenantId }).populate('categoria');
    }

    // [MULTI-TENANT] Filtra produtos de uma categoria específica DENTRO da loja logada
    findByCategory = async (categoryId: string, tenantId: string) => {
        return await Product.find({ categoria: categoryId, ativo: true, tenant_id: tenantId });
    }

    // [MULTI-TENANT] Busca por ID + tenantId para garantir isolamento entre lojas
    findById = async (id: string, tenantId: string) => {
        return await Product.findOne({ _id: id, tenant_id: tenantId }).populate('categoria');
    }

    // [MULTI-TENANT] Atualiza apenas se o produto pertencer à loja do admin logado
    update = async (id: string, productData: any, tenantId: string) => {
        return await Product.findOneAndUpdate(
            { _id: id, tenant_id: tenantId },  // Filtro: ID + Loja
            productData, 
            { new: true }
        );
    }

    // [MULTI-TENANT] Deleta apenas se o produto pertencer à loja do admin logado
    delete = async (id: string, tenantId: string) => {
        return await Product.findOneAndDelete({ _id: id, tenant_id: tenantId });
    }

    getModel = () => {
        return Product;
    }
}
