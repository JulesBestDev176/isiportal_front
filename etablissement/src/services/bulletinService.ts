import { ApiResponse, PaginationParams, PaginatedResponse } from '../types/common.types';
import { MatiereBulletin, BulletinSemestre } from '../models/classe.model';

export interface Bulletin {
  id: number;
  eleveId: number;
  anneeScolaire: string;
  semestre: number;
  moyenne: number;
  matieres: MatiereBulletin[];
  appreciation: string;
  dateCreation: string;
  dateModification?: string;
}

export interface BulletinFilters {
  eleveId?: number;
  anneeScolaire?: string;
  semestre?: number;
  classeId?: number;
}

class BulletinService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // Récupérer les bulletins d'un élève
  async getBulletinsEleve(eleveId: number, filters?: BulletinFilters): Promise<ApiResponse<Bulletin[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.anneeScolaire) params.append('annee_scolaire', filters.anneeScolaire);
      if (filters?.semestre) params.append('semestre', filters.semestre.toString());

      const response = await fetch(`${this.baseUrl}/bulletins/eleve/${eleveId}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des bulletins:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération des bulletins',
        data: []
      };
    }
  }

  // Récupérer un bulletin spécifique
  async getBulletin(id: number): Promise<ApiResponse<Bulletin>> {
    try {
      const response = await fetch(`${this.baseUrl}/bulletins/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du bulletin:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération du bulletin',
        data: null
      };
    }
  }

  // Créer un nouveau bulletin
  async createBulletin(bulletin: Omit<Bulletin, 'id' | 'dateCreation' | 'dateModification'>): Promise<ApiResponse<Bulletin>> {
    try {
      const response = await fetch(`${this.baseUrl}/bulletins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bulletin)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du bulletin:', error);
      return {
        success: false,
        message: 'Erreur lors de la création du bulletin',
        data: null
      };
    }
  }

  // Mettre à jour un bulletin
  async updateBulletin(id: number, updates: Partial<Bulletin>): Promise<ApiResponse<Bulletin>> {
    try {
      const response = await fetch(`${this.baseUrl}/bulletins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bulletin:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du bulletin',
        data: null
      };
    }
  }

  // Supprimer un bulletin
  async deleteBulletin(id: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/bulletins/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la suppression du bulletin:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression du bulletin',
        data: false
      };
    }
  }

  // Récupérer les bulletins d'une classe
  async getBulletinsClasse(classeId: number, anneeScolaire: string, semestre: number): Promise<ApiResponse<Bulletin[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/bulletins/classe/${classeId}?annee_scolaire=${anneeScolaire}&semestre=${semestre}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des bulletins de classe:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération des bulletins de classe',
        data: []
      };
    }
  }

  // Calculer la moyenne d'un élève
  async calculerMoyenneEleve(eleveId: number, anneeScolaire: string, semestre: number): Promise<ApiResponse<number>> {
    try {
      const response = await fetch(`${this.baseUrl}/bulletins/moyenne/${eleveId}?annee_scolaire=${anneeScolaire}&semestre=${semestre}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors du calcul de la moyenne:', error);
      return {
        success: false,
        message: 'Erreur lors du calcul de la moyenne',
        data: 0
      };
    }
  }
}

export const bulletinService = new BulletinService(); 