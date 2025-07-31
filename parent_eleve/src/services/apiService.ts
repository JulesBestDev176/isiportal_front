const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone?: string;
  adresse?: string;
  classe?: {
    id: number;
    nom: string;
    niveau: {
      id: number;
      nom: string;
      cycle: string;
    };
  };
  enfants?: AuthUser[];
}

interface Child {
  id: number;
  nom: string;
  prenom: string;
  classe: {
    id: number;
    nom: string;
    niveau: {
      nom: string;
      cycle: string;
    };
  };
  moyenne?: number;
}

interface Grade {
  id: number;
  note: number;
  coefficient: number;
  type_evaluation: string;
  date_evaluation: string;
  appreciation?: string;
  matiere: {
    id: number;
    nom: string;
    code: string;
  };
}

interface Notification {
  id: number;
  titre: string;
  message: string;
  lu: boolean;
  type: 'info' | 'alerte' | 'urgence';
  date: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    if (options.headers) {
      const optHeaders = new Headers(options.headers);
      optHeaders.forEach((value, key) => headers.set(key, value));
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur API');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Authentification
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    const response = await this.request<{ user: AuthUser; token: string }>('/parent-eleve/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
      return response.data;
    }

    throw new Error(response.message || 'Erreur de connexion');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/parent-eleve/logout', { method: 'POST' });
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
  }

  async checkAuth(): Promise<AuthUser> {
    const response = await this.request<AuthUser>('/parent-eleve/check-auth');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Non authentifié');
  }

  // Données du dashboard
  async getDashboardData(): Promise<any> {
    // Vérifier le rôle de l'utilisateur pour utiliser la bonne route
    try {
      const user = await this.checkAuth();
      const endpoint = user.role === 'parent' ? '/parent-eleve/parent-dashboard' : '/parent-eleve/dashboard';
      const response = await this.request(endpoint);
      if (response.success && response.data) {
        return response.data;
      }
      return {};
    } catch (error) {
      console.error('Erreur lors de la récupération du dashboard:', error);
      return {};
    }
  }

  // Notes d'un élève
  async getStudentGrades(studentId: number): Promise<Grade[]> {
    const response = await this.request<Grade[]>(`/notes/eleve/${studentId}`);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const dashboardData = await this.getDashboardData();
    return dashboardData.notifications || [];
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // Données des enfants (pour les parents)
  async getChildren(): Promise<Child[]> {
    const dashboardData = await this.getDashboardData();
    return dashboardData.enfants || [];
  }

  // Statistiques du dashboard
  async getDashboardStats(role: string) {
    const dashboardData = await this.getDashboardData();
    return dashboardData.stats || {};
  }

  // Test de connexion
  async ping(): Promise<boolean> {
    try {
      const response = await this.request('/ping');
      return response.success;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
export type { AuthUser, Child, Grade, Notification };