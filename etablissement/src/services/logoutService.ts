// Service pour la déconnexion
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LogoutOptions {
  logoutFromAllDevices?: boolean;
  reason?: string;
}

export class LogoutService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/auth') {
    this.baseUrl = baseUrl;
  }

  /**
   * Déconnecte l'utilisateur actuel
   */
  async logout(options?: LogoutOptions): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options || {}),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la déconnexion'
      };
    }
  }

  /**
   * Déconnecte l'utilisateur de tous les appareils
   */
  async logoutFromAllDevices(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/logout-all-devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la déconnexion de tous les appareils'
      };
    }
  }

  /**
   * Vérifie si l'utilisateur est toujours connecté
   */
  async checkAuthStatus(): Promise<ApiResponse<{ isAuthenticated: boolean; user?: any }>> {
    try {
      const response = await fetch(`${this.baseUrl}/check-auth`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la vérification du statut d\'authentification'
      };
    }
  }

  /**
   * Rafraîchit le token d'authentification
   */
  async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du rafraîchissement du token'
      };
    }
  }

  /**
   * Récupère les sessions actives de l'utilisateur
   */
  async getActiveSessions(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/active-sessions`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des sessions actives'
      };
    }
  }

  /**
   * Termine une session spécifique
   */
  async terminateSession(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/terminate-session/${sessionId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la terminaison de la session'
      };
    }
  }
}

export const logoutService = new LogoutService(); 