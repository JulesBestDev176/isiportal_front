import { apiClient } from './config';

export interface DashboardStats {
  totalUtilisateurs?: number;
  classesActives?: number;
  coursProgrammes?: number;
  evenements?: number;
  elevesInscrits?: number;
  classesGerees?: number;
  professeurs?: number;
  mesClasses?: number;
  elevesTotal?: number;
  coursCetteSemaine?: number;
  devoirsACorriger?: number;
  nouvellesInscriptions?: number;
  coursActifs?: number;
  absencesNonJustifiees?: number;
  bulletinsGeneres?: number;
}

export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
}

export interface ActiviteRecente {
  id: string;
  titre: string;
  description: string;
  type: string;
  date: string;
}

class DashboardService {
  /**
   * Récupérer les statistiques du tableau de bord selon le rôle
   */
  async getDashboardStats(role: string): Promise<DashboardStats> {
    try {
      const response = await apiClient.get(`/dashboard/stats/${role}`);
      // Vérifier que la réponse contient bien des données
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        console.warn('Réponse API inattendue pour les statistiques:', response.data);
        return {};
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      // En cas d'erreur, retourner un objet vide
      return {};
    }
  }

  /**
   * Récupérer les notifications
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get('/notifications');
      console.log('Réponse API notifications complète:', response);
      
      // Vérifier que la réponse contient bien un tableau de données
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        // Si la réponse est directement un tableau
        return response.data;
      } else {
        console.warn('Réponse API inattendue pour les notifications:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      // En cas d'erreur, retourner un tableau vide
      return [];
    }
  }

  /**
   * Récupérer les activités récentes
   */
  async getActivitesRecentes(role: string): Promise<ActiviteRecente[]> {
    try {
      const response = await apiClient.get(`/dashboard/activites/${role}`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      throw error;
    }
  }

  /**
   * Récupérer les données détaillées pour l'administrateur
   */
  async getAdminDetails(): Promise<{
    nouvellesInscriptions: number;
    coursActifs: number;
    absencesNonJustifiees: number;
    bulletinsGeneres: number;
  }> {
    try {
      const response = await apiClient.get('/dashboard/admin/details');
      // Vérifier que la réponse contient bien des données
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        console.warn('Réponse API inattendue pour les détails admin:', response.data);
        return {
          nouvellesInscriptions: 0,
          coursActifs: 0,
          absencesNonJustifiees: 0,
          bulletinsGeneres: 0
        };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails admin:', error);
      // En cas d'erreur, retourner des valeurs par défaut
      return {
        nouvellesInscriptions: 0,
        coursActifs: 0,
        absencesNonJustifiees: 0,
        bulletinsGeneres: 0
      };
    }
  }
}

export const dashboardService = new DashboardService(); 