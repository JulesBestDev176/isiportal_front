import axios from 'axios';

// Configuration de base pour l'API
const API_BASE_URL = 'http://localhost:8000/api';

// Instance axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      // Token expiré, essayer de le rafraîchir
      try {
        const refreshResponse = await apiClient.post('/auth/refresh');
        const newToken = refreshResponse.data.data.token;
        localStorage.setItem('auth_token', newToken);
        
        // Retry la requête originale avec le nouveau token
        if (error.config && error.config.headers) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return apiClient.request(error.config);
        }
      } catch (refreshError) {
        // Échec du refresh, déconnecter l'utilisateur
        localStorage.removeItem('auth_token');
        localStorage.removeItem('utilisateur');
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(error);
  }
);

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      nom: string;
      prenom: string;
      email: string;
      role: string;
      full_name: string;
    };
    token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

// Service d'authentification
export class AuthService {
  
  /**
   * Connexion utilisateur
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data.success) {
        // Stocker le token et les infos utilisateur
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('utilisateur', JSON.stringify({
          id: response.data.data.user.id.toString(),
          email: response.data.data.user.email,
          role: response.data.data.user.role,
          prenom: response.data.data.user.prenom,
          nom: response.data.data.user.nom
        }));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la connexion'
      );
    }
  }

  /**
   * Déconnexion
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem('auth_token');
      localStorage.removeItem('utilisateur');
    }
  }

  /**
   * Obtenir le profil utilisateur
   */
  static async getProfile(): Promise<any> {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération du profil'
      );
    }
  }

  /**
   * Rafraîchir le token
   */
  static async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post('/auth/refresh');
      const newToken = response.data.data.token;
      localStorage.setItem('auth_token', newToken);
      return newToken;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors du rafraîchissement du token'
      );
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('utilisateur');
    return !!(token && user);
  }

  /**
   * Obtenir le token actuel
   */
  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  static getCurrentUser(): any | null {
    const userStr = localStorage.getItem('utilisateur');
    return userStr ? JSON.parse(userStr) : null;
  }
}

// Export de l'instance axios pour d'autres services
export { apiClient };