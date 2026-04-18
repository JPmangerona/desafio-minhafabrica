import api from './api';

export const categoryService = {
  async getAllAdmin() {
    const response = await api.get('/admin/categories');
    return response.data.data;
  },

  async getAllPublic() {
    const response = await api.get('/categories');
    return response.data.data;
  },

  async create(formData: FormData) {
    const response = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async update(id: string, formData: FormData) {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data.data;
  }
};
