import { buildApiUrl, getAuthHeaders, API_CONFIG } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      nom: string;
      prenom: string;
      email: string;
      role: string;
      doitChangerMotDePasse: boolean;
    };
    token: string;
    refresh_token: string;
  };
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Service d'authentification
export const authService = {
  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(buildApiUrl('/auth/login'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de connexion');
    }

    // Stocker le token
    if (data.data?.token) {
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('refresh_token', data.data.refresh_token);
    }

    return data;
  },

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await fetch(buildApiUrl('/auth/logout'), {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Déconnexion de tous les appareils
  async logoutFromAllDevices(): Promise<void> {
    try {
      await fetch(buildApiUrl('/auth/logout-all'), {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Rafraîchir le token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('Aucun token de rafraîchissement disponible');
    }

    const response = await fetch(buildApiUrl('/auth/refresh'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur de rafraîchissement du token');
    }

    // Mettre à jour les tokens
    if (data.data?.token) {
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('refresh_token', data.data.refresh_token);
    }

    return data;
  },

  // Obtenir le profil utilisateur
  async getProfile(): Promise<AuthResponse> {
    const response = await fetch(buildApiUrl('/auth/profile'), {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    return response.json();
  },

  // Changer le mot de passe
  async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    const response = await fetch(buildApiUrl('/auth/change-password'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Erreur lors du changement de mot de passe');
    }

    return responseData;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  // Obtenir le token actuel
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // Obtenir le rôle de l'utilisateur
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  },

  // Obtenir l'utilisateur actuel depuis le localStorage
  getCurrentUser(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub || payload.id,
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.email,
        role: payload.role,
        doitChangerMotDePasse: payload.doitChangerMotDePasse || false
      };
    } catch {
      return null;
    }
  }
};

// Intercepteur pour rafraîchir automatiquement le token
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await originalFetch(input, init);
  
  if (response.status === 401) {
    try {
      await authService.refreshToken();
      // Réessayer la requête originale avec le nouveau token
      return originalFetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          ...getAuthHeaders()
        }
      });
    } catch {
      // Si le rafraîchissement échoue, rediriger vers la page de connexion
      authService.logout();
      window.location.href = '/login';
    }
  }
  
  return response;
};