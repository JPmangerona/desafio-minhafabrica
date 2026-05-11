import axios from 'axios';

// Instância centralizada do Axios
const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para injetar o Token e o Tenant nas requisições (Client-side)
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // [MULTI-TENANT] Injeta o tenant_id salvo no login como header x-tenant-id
        // Isso é usado nas rotas públicas (busca, listagem de vitrine)
        const tenantId = localStorage.getItem('tenant_id');
        if (tenantId && config.headers) {
            config.headers['x-tenant-id'] = tenantId;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para respostas Globais (Tratamento de Sucesso e 401)
api.interceptors.response.use(
  (response) => {
    // Se a resposta segue o padrão { success, data }, retornamos apenas o data para simplificar no frontend
    if (response.data && response.data.success === true) {
      return response; // Mantemos o objeto da resposta, mas as chamadas usarão res.data.data
    }
    return response;
  }, 
  (error) => {
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('tenant_id'); // [MULTI-TENANT] Limpa o tenant_id também
      localStorage.removeItem('user_permissions');
      document.cookie = 'auth_token=; Max-Age=0; path=/';
      // Evita loops infinitos se já estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
