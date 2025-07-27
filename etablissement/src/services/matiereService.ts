// Service pour la gestion des matières
import { Matiere, MatiereNiveau } from '../models/matiere.model';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface MatiereFilters {
  niveauId?: number;
  statut?: string;
  search?: string;
}

export class MatiereService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/matieres') {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère toutes les matières
   */
  async getMatieres(filters?: MatiereFilters): Promise<ApiResponse<Matiere[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.niveauId) queryParams.append('niveauId', filters.niveauId.toString());
      if (filters?.statut) queryParams.append('statut', filters.statut);
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des matières'
      };
    }
  }

  /**
   * Récupère une matière par ID
   */
  async getMatiere(id: number): Promise<ApiResponse<Matiere>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération de la matière'
      };
    }
  }

  /**
   * Crée une nouvelle matière
   */
  async createMatiere(matiere: Omit<Matiere, 'id' | 'dateCreation'>): Promise<ApiResponse<Matiere>> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matiere),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création de la matière'
      };
    }
  }

  /**
   * Met à jour une matière
   */
  async updateMatiere(id: number, matiere: Partial<Matiere>): Promise<ApiResponse<Matiere>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matiere),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la matière'
      };
    }
  }

  /**
   * Supprime une matière
   */
  async deleteMatiere(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression de la matière'
      };
    }
  }

  /**
   * Récupère les matières par niveau
   */
  async getMatieresByNiveau(niveauId: number): Promise<ApiResponse<MatiereNiveau[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/niveau/${niveauId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des matières par niveau'
      };
    }
  }

  /**
   * Assigne une matière à un niveau
   */
  async assignMatiereToNiveau(matiereId: number, niveauId: number, heuresParSemaine: number, coefficient: number): Promise<ApiResponse<MatiereNiveau>> {
    try {
      const response = await fetch(`${this.baseUrl}/${matiereId}/niveau/${niveauId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heuresParSemaine, coefficient }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de l\'assignation de la matière au niveau'
      };
    }
  }

  /**
   * Retire une matière d'un niveau
   */
  async removeMatiereFromNiveau(matiereId: number, niveauId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${matiereId}/niveau/${niveauId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du retrait de la matière du niveau'
      };
    }
  }

  /**
   * Met à jour les heures et coefficient d'une matière pour un niveau
   */
  async updateMatiereNiveau(matiereId: number, niveauId: number, heuresParSemaine: number, coefficient: number): Promise<ApiResponse<MatiereNiveau>> {
    try {
      const response = await fetch(`${this.baseUrl}/${matiereId}/niveau/${niveauId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heuresParSemaine, coefficient }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la matière pour ce niveau'
      };
    }
  }
}

export const matiereService = new MatiereService(); 