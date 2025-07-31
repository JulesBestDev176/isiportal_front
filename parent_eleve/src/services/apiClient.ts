// Configuration de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Interface pour les options de requête
interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

// Client API simple avec fetch
export const apiClient = {
  async get(url: string) {
    return this.request(url, { method: 'GET' });
  },

  async post(url: string, data?: any) {
    return this.request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put(url: string, data?: any) {
    return this.request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete(url: string) {
    return this.request(url, { method: 'DELETE' });
  },

  async request(url: string, options: RequestOptions = {}) {
    const token = localStorage.getItem('auth_token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });

      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/connexion';
        throw new Error('Non authentifié');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      return {
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },
};

export default apiClient;