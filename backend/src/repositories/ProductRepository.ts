import Product from "../models/ProductModel.js";

export class ProductRepository {
    save = async (productData: any) => {
        const newProduct = new Product(productData);
        return await newProduct.save();
    }

    findAll = async () => {
        return await Product.find().populate('categoria');
    }

    findAllActive = async () => {
        return await Product.find({ ativo: true }).populate('categoria');
    }

    findByCategory = async (categoryId: string) => {
        return await Product.find({ categoria: categoryId, ativo: true });
    }

    findById = async (id: string) => {
        return await Product.findById(id).populate('categoria');
    }

    update = async (id: string, productData: any) => {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
    }

    delete = async (id: string) => {
        return await Product.findByIdAndDelete(id);
    }
}
