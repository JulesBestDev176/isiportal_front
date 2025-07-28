import axios from 'axios';

// Configuration de l'API
export const API_CONFIG = {
  // URL de base de l'API Laravel
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  
  // Timeout pour les requêtes
  TIMEOUT: 10000,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints principaux
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      LOGOUT_ALL: '/auth/logout-all',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    USERS: '/users',
    NIVEAUX: '/niveaux',
    CLASSES: '/classes',
    COURS: '/cours',
    SALLES: '/salles',
    BATIMENTS: '/batiments',
    ELEVES: '/eleves',
    MATIERES: '/matieres',
    NOTIFICATIONS: '/notifications',
    BULLETINS: '/bulletins',
    HISTORIQUE_ELEVES: '/historique-eleves',
  }
};

// Fonction pour construire une URL complète
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour obtenir les headers avec le token d'authentification
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}; 

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers la page de connexion
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 