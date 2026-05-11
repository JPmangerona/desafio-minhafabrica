import Category from "../models/CategoryModel.js";

export class CategoryRepository {
    save = async (categoryData: any) => {
        // O categoryData já deve vir com o tenant_id incluído pelo Controller
        const newCategory = new Category(categoryData);
        return await newCategory.save();
    }

    // [MULTI-TENANT] Agora recebe tenantId para filtrar apenas as categorias da loja logada
    findAll = async (tenantId: string) => {
        return await Category.find({ tenant_id: tenantId }).sort({ ordem: 1 });
    }

    // [MULTI-TENANT] Filtra categorias ativas APENAS da loja logada
    findAllActive = async (tenantId: string) => {
        return await Category.find({ ativo: true, tenant_id: tenantId }).sort({ ordem: 1 });
    }

    // [MULTI-TENANT] Verifica se a ordem já existe DENTRO da mesma loja (não globalmente)
    findByOrder = async (ordem: number, tenantId: string) => {
        return await Category.findOne({ ordem, tenant_id: tenantId });
    }

    // [MULTI-TENANT] Busca por ID + tenantId para garantir que o admin não acesse categoria de outra loja
    findById = async (id: string, tenantId: string) => {
        return await Category.findOne({ _id: id, tenant_id: tenantId });
    }

    // [MULTI-TENANT] Atualiza apenas se a categoria pertencer à loja do admin logado
    update = async (id: string, categoryData: any, tenantId: string) => {
        return await Category.findOneAndUpdate(
            { _id: id, tenant_id: tenantId },  // Filtro: ID + Loja
            categoryData, 
            { new: true }
        );
    }

    // [MULTI-TENANT] Deleta apenas se a categoria pertencer à loja do admin logado
    delete = async (id: string, tenantId: string) => {
        return await Category.findOneAndDelete({ _id: id, tenant_id: tenantId });
    }
}
