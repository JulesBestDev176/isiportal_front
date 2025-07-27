// Service pour les fonctionnalités d'administration
import { 
  Utilisateur, 
  Professeur, 
  Eleve, 
  Parent, 
  Gestionnaire, 
  Administrateur 
} from '../models/utilisateur.model';
import { Classe, ClasseAnneeScolaire } from '../models/classe.model';
import { Niveau } from '../models/niveau.model';
import { Cours } from '../models/cours.model';
import { Salle } from '../models/salle.model';
import { Batiment } from '../models/batiment.model';
import { AnneeScolaire } from '../models/annee-scolaire.model';
import { 
  MetriqueKPI, 
  DonneesTendance, 
  PerformanceClasse, 
  ActiviteUtilisateur, 
  StatistiqueRole 
} from '../models/analytics.model';

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Service principal pour l'administration
export class AdminService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/admin') {
    this.baseUrl = baseUrl;
  }

  // ===== TABLEAU DE BORD =====
  
  /**
   * Récupère les métriques KPI du tableau de bord
   */
  async getDashboardKPIs(): Promise<ApiResponse<MetriqueKPI[]>> {
    try {
      // Simulation d'appel API
      const response = await fetch(`${this.baseUrl}/dashboard/kpis`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des KPIs'
      };
    }
  }

  /**
   * Récupère les données de tendance
   */
  async getDashboardTrends(): Promise<ApiResponse<DonneesTendance[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/trends`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des tendances'
      };
    }
  }

  /**
   * Récupère les performances par classe
   */
  async getClassPerformances(): Promise<ApiResponse<PerformanceClasse[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/class-performances`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des performances'
      };
    }
  }

  /**
   * Récupère l'activité des utilisateurs
   */
  async getUserActivity(): Promise<ApiResponse<ActiviteUtilisateur[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/user-activity`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération de l\'activité'
      };
    }
  }

  /**
   * Récupère les statistiques par rôle
   */
  async getRoleStatistics(): Promise<ApiResponse<StatistiqueRole[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/role-statistics`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des statistiques'
      };
    }
  }

  // ===== UTILISATEURS =====

  /**
   * Récupère la liste paginée des utilisateurs
   */
  async getUtilisateurs(params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Utilisateur>>> {
    try {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        ...(params.search && { search: params.search }),
        ...(params.filters && { filters: JSON.stringify(params.filters) })
      });

      const response = await fetch(`${this.baseUrl}/utilisateurs?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des utilisateurs'
      };
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUtilisateur(utilisateur: Omit<Utilisateur, 'id' | 'dateCreation'>): Promise<ApiResponse<Utilisateur>> {
    try {
      const response = await fetch(`${this.baseUrl}/utilisateurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(utilisateur),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création de l\'utilisateur'
      };
    }
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUtilisateur(id: number, utilisateur: Partial<Utilisateur>): Promise<ApiResponse<Utilisateur>> {
    try {
      const response = await fetch(`${this.baseUrl}/utilisateurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(utilisateur),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de l\'utilisateur'
      };
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUtilisateur(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/utilisateurs/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression de l\'utilisateur'
      };
    }
  }

  /**
   * Active/désactive un utilisateur
   */
  async toggleUtilisateurStatus(id: number, actif: boolean): Promise<ApiResponse<Utilisateur>> {
    try {
      const response = await fetch(`${this.baseUrl}/utilisateurs/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actif }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du changement de statut'
      };
    }
  }

  /**
   * Envoie les informations de connexion par email
   */
  async envoyerInfosConnexion(utilisateurId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/utilisateurs/${utilisateurId}/envoyer-connexion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de l\'envoi des informations de connexion'
      };
    }
  }

  // ===== NIVEAUX =====

  /**
   * Récupère tous les niveaux
   */
  async getNiveaux(): Promise<ApiResponse<Niveau[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/niveaux`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des niveaux'
      };
    }
  }

  /**
   * Crée un nouveau niveau
   */
  async createNiveau(niveau: Omit<Niveau, 'id' | 'dateCreation'>): Promise<ApiResponse<Niveau>> {
    try {
      const response = await fetch(`${this.baseUrl}/niveaux`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(niveau),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création du niveau'
      };
    }
  }

  /**
   * Met à jour un niveau
   */
  async updateNiveau(id: number, niveau: Partial<Niveau>): Promise<ApiResponse<Niveau>> {
    try {
      const response = await fetch(`${this.baseUrl}/niveaux/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(niveau),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du niveau'
      };
    }
  }

  /**
   * Supprime un niveau
   */
  async deleteNiveau(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/niveaux/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression du niveau'
      };
    }
  }

  // ===== CLASSES =====

  /**
   * Récupère toutes les classes
   */
  async getClasses(): Promise<ApiResponse<Classe[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/classes`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des classes'
      };
    }
  }

  /**
   * Crée une nouvelle classe
   */
  async createClasse(classe: Omit<Classe, 'id' | 'dateCreation'>): Promise<ApiResponse<Classe>> {
    try {
      const response = await fetch(`${this.baseUrl}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classe),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création de la classe'
      };
    }
  }

  /**
   * Met à jour une classe
   */
  async updateClasse(id: number, classe: Partial<Classe>): Promise<ApiResponse<Classe>> {
    try {
      const response = await fetch(`${this.baseUrl}/classes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classe),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la classe'
      };
    }
  }

  /**
   * Supprime une classe
   */
  async deleteClasse(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/classes/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression de la classe'
      };
    }
  }

  /**
   * Transfère automatiquement les élèves d'une classe
   */
  async transfererEleves(classeId: number, reglesTransfert: any): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/classes/${classeId}/transferer-eleves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reglesTransfert),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du transfert des élèves'
      };
    }
  }

  // ===== SALLES =====

  /**
   * Récupère toutes les salles
   */
  async getSalles(): Promise<ApiResponse<Salle[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/salles`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des salles'
      };
    }
  }

  /**
   * Crée une nouvelle salle
   */
  async createSalle(salle: Omit<Salle, 'id' | 'dateCreation'>): Promise<ApiResponse<Salle>> {
    try {
      const response = await fetch(`${this.baseUrl}/salles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salle),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création de la salle'
      };
    }
  }

  /**
   * Met à jour une salle
   */
  async updateSalle(id: number, salle: Partial<Salle>): Promise<ApiResponse<Salle>> {
    try {
      const response = await fetch(`${this.baseUrl}/salles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salle),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la salle'
      };
    }
  }

  /**
   * Supprime une salle
   */
  async deleteSalle(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/salles/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression de la salle'
      };
    }
  }

  // ===== BÂTIMENTS =====

  /**
   * Récupère tous les bâtiments
   */
  async getBatiments(): Promise<ApiResponse<Batiment[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/batiments`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des bâtiments'
      };
    }
  }

  /**
   * Crée un nouveau bâtiment
   */
  async createBatiment(batiment: Omit<Batiment, 'id' | 'dateCreation'>): Promise<ApiResponse<Batiment>> {
    try {
      const response = await fetch(`${this.baseUrl}/batiments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batiment),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création du bâtiment'
      };
    }
  }

  /**
   * Met à jour un bâtiment
   */
  async updateBatiment(id: number, batiment: Partial<Batiment>): Promise<ApiResponse<Batiment>> {
    try {
      const response = await fetch(`${this.baseUrl}/batiments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batiment),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du bâtiment'
      };
    }
  }

  /**
   * Supprime un bâtiment
   */
  async deleteBatiment(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/batiments/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression du bâtiment'
      };
    }
  }

  // ===== COURS =====

  /**
   * Récupère tous les cours
   */
  async getCours(): Promise<ApiResponse<Cours[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/cours`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des cours'
      };
    }
  }

  /**
   * Crée un nouveau cours
   */
  async createCours(cours: Omit<Cours, 'id' | 'dateCreation'>): Promise<ApiResponse<Cours>> {
    try {
      const response = await fetch(`${this.baseUrl}/cours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cours),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création du cours'
      };
    }
  }

  /**
   * Met à jour un cours
   */
  async updateCours(id: number, cours: Partial<Cours>): Promise<ApiResponse<Cours>> {
    try {
      const response = await fetch(`${this.baseUrl}/cours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cours),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du cours'
      };
    }
  }

  /**
   * Supprime un cours
   */
  async deleteCours(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/cours/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression du cours'
      };
    }
  }

  // ===== ANNÉES SCOLAIRES =====

  /**
   * Récupère toutes les années scolaires
   */
  async getAnneesScolaires(): Promise<ApiResponse<AnneeScolaire[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/annees-scolaires`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des années scolaires'
      };
    }
  }

  /**
   * Crée une nouvelle année scolaire
   */
  async createAnneeScolaire(annee: Omit<AnneeScolaire, 'id' | 'dateCreation'>): Promise<ApiResponse<AnneeScolaire>> {
    try {
      const response = await fetch(`${this.baseUrl}/annees-scolaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(annee),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création de l\'année scolaire'
      };
    }
  }

  /**
   * Met à jour une année scolaire
   */
  async updateAnneeScolaire(id: number, annee: Partial<AnneeScolaire>): Promise<ApiResponse<AnneeScolaire>> {
    try {
      const response = await fetch(`${this.baseUrl}/annees-scolaires/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(annee),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de l\'année scolaire'
      };
    }
  }

  /**
   * Supprime une année scolaire
   */
  async deleteAnneeScolaire(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/annees-scolaires/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression de l\'année scolaire'
      };
    }
  }
}

// Instance par défaut du service
export const adminService = new AdminService(); 