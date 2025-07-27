import { ApiResponse, PaginationParams, PaginatedResponse } from '../types/common.types';
import { EleveClasse } from '../models/eleve.model';

export interface HistoriqueEleve {
  id: number;
  eleveId: number;
  classeId: number;
  classeNom: string;
  anneeScolaire: string;
  niveauNom: string;
  moyenneAnnuelle: number;
  statut: "reussi" | "redouble" | "transfert" | "abandon";
  dateInscription: string;
  dateSortie?: string;
  remarques?: string;
}

export interface HistoriqueFilters {
  eleveId?: number;
  classeId?: number;
  anneeScolaire?: string;
  statut?: string;
}

class HistoriqueElevesService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // Récupérer l'historique d'un élève
  async getHistoriqueEleve(eleveId: number, filters?: HistoriqueFilters): Promise<ApiResponse<HistoriqueEleve[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.classeId) params.append('classe_id', filters.classeId.toString());
      if (filters?.anneeScolaire) params.append('annee_scolaire', filters.anneeScolaire);
      if (filters?.statut) params.append('statut', filters.statut);

      const response = await fetch(`${this.baseUrl}/historique-eleves/eleve/${eleveId}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération de l\'historique',
        data: []
      };
    }
  }

  // Récupérer l'historique d'une classe
  async getHistoriqueClasse(classeId: number, anneeScolaire: string): Promise<ApiResponse<HistoriqueEleve[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/historique-eleves/classe/${classeId}?annee_scolaire=${anneeScolaire}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique de classe:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération de l\'historique de classe',
        data: []
      };
    }
  }

  // Créer un nouvel historique
  async createHistorique(historique: Omit<HistoriqueEleve, 'id'>): Promise<ApiResponse<HistoriqueEleve>> {
    try {
      const response = await fetch(`${this.baseUrl}/historique-eleves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(historique)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'historique:', error);
      return {
        success: false,
        message: 'Erreur lors de la création de l\'historique',
        data: null
      };
    }
  }

  // Mettre à jour un historique
  async updateHistorique(id: number, updates: Partial<HistoriqueEleve>): Promise<ApiResponse<HistoriqueEleve>> {
    try {
      const response = await fetch(`${this.baseUrl}/historique-eleves/${id}`, {
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
      console.error('Erreur lors de la mise à jour de l\'historique:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour de l\'historique',
        data: null
      };
    }
  }

  // Supprimer un historique
  async deleteHistorique(id: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/historique-eleves/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'historique:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression de l\'historique',
        data: false
      };
    }
  }

  // Transférer un élève vers une nouvelle classe
  async transfererEleve(eleveId: number, nouvelleClasseId: number, anneeScolaire: string): Promise<ApiResponse<HistoriqueEleve>> {
    try {
      const response = await fetch(`${this.baseUrl}/historique-eleves/transferer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          eleveId,
          nouvelleClasseId,
          anneeScolaire
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors du transfert de l\'élève:', error);
      return {
        success: false,
        message: 'Erreur lors du transfert de l\'élève',
        data: null
      };
    }
  }

  // Obtenir les statistiques de transfert
  async getStatistiquesTransfert(classeId: number, anneeScolaire: string): Promise<ApiResponse<{
    totalEleves: number;
    transferes: number;
    redoublants: number;
    reussis: number;
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/historique-eleves/statistiques/${classeId}?annee_scolaire=${anneeScolaire}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        data: {
          totalEleves: 0,
          transferes: 0,
          redoublants: 0,
          reussis: 0
        }
      };
    }
  }
}

export const historiqueElevesService = new HistoriqueElevesService(); 