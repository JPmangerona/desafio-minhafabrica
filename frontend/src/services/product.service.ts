import api from './api';

export const productService = {
  async getAllAdmin() {
    const response = await api.get('/admin/products');
    return response.data.data;
  },

  async getAllPublic() {
    const response = await api.get('/products');
    return response.data.data;
  },

  async getByCategory(categoryId: string) {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data.data;
  },

  async create(formData: FormData) {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async update(id: string, formData: FormData) {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data.data;
  }
};
