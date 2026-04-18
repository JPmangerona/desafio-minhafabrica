import api from './api';

export const userService = {
  async getAll() {
    const response = await api.get('/users');
    return response.data.data;
  },

  async create(userData: any) {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  async update(id: string, userData: any) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
  }
};
