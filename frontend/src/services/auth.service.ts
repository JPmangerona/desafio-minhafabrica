import api from './api';

export const authService = {
  async login(credentials: any) {
    const response = await api.post('/auth/login', credentials);
    return response.data; // Retorna { success, data: { token, role, name } }
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};
