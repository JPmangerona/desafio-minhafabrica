import Category from "../models/CategoryModel.js";

export class CategoryRepository {
    save = async (categoryData: any) => {
        const newCategory = new Category(categoryData);
        return await newCategory.save();
    }

    findAll = async () => {
        return await Category.find().sort({ ordem: 1 });
    }

    findAllActive = async () => {
        return await Category.find({ ativo: true }).sort({ ordem: 1 });
    }

    findByOrder = async (ordem: number) => {
        return await Category.findOne({ ordem });
    }

    findById = async (id: string) => {
        return await Category.findById(id);
    }

    update = async (id: string, categoryData: any) => {
        return await Category.findByIdAndUpdate(id, categoryData, { new: true });
    }

    delete = async (id: string) => {
        return await Category.findByIdAndDelete(id);
    }
}
