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

  async delete(name: string) {
    // Nota: A API atual espera o nome no body para delete (conformeUserController legado)
    // Mas o PDF sugere delete por ID. Vou manter compatível com o backend atual.
    const response = await api.delete('/users', { data: { name } });
    return response.data.data;
  }
};
