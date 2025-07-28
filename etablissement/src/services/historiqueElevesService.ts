import { ApiResponse, PaginationParams, PaginatedResponse } from '../types/common.types';
import { EleveClasse } from '../models/eleve.model';

export interface HistoriqueEleve {
  id: number;
  eleveId: number;
  anneeScolaire: string;
  classe: string;
  statut: "reussi" | "redouble" | "transfert" | "abandon";
  moyenneGenerale: number;
  remarques?: string;
  dateCreation: string;
}

export interface TransfertStatistiques {
  totalEleves: number;
  transfertsReussis: number;
  redoublements: number;
  abandons: number;
  tauxReussite: number;
}

// Service pour l'historique des élèves
export const historiqueElevesService = {
  // Récupérer l'historique d'un élève
  async getHistoriqueEleve(eleveId: number): Promise<ApiResponse<HistoriqueEleve[]>> {
    const response = await fetch(`/api/eleves/${eleveId}/historique`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de l\'historique');
    return response.json();
  },

  // Récupérer tous les historiques
  async getHistoriques(params?: PaginationParams): Promise<PaginatedResponse<HistoriqueEleve>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(`/api/historique-eleves?${queryParams}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des historiques');
    return response.json();
  },

  // Récupérer l'historique d'une classe
  async getHistoriqueClasse(classeId: number, anneeScolaire: string): Promise<ApiResponse<HistoriqueEleve[]>> {
    const response = await fetch(`/api/classes/${classeId}/historique?annee_scolaire=${anneeScolaire}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de l\'historique de la classe');
    return response.json();
  },

  // Créer un historique
  async createHistorique(data: Omit<HistoriqueEleve, 'id' | 'dateCreation'>): Promise<ApiResponse<HistoriqueEleve>> {
    const response = await fetch('/api/historique-eleves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de l\'historique');
    return response.json();
  },

  // Mettre à jour un historique
  async updateHistorique(id: number, data: Partial<HistoriqueEleve>): Promise<ApiResponse<HistoriqueEleve>> {
    const response = await fetch(`/api/historique-eleves/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'historique');
    return response.json();
  },

  // Supprimer un historique
  async deleteHistorique(id: number): Promise<ApiResponse<void>> {
    const response = await fetch(`/api/historique-eleves/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'historique');
    return response.json();
  },

  // Obtenir les statistiques de transfert
  async getTransfertStatistiques(anneeScolaire?: string): Promise<ApiResponse<TransfertStatistiques>> {
    const params = anneeScolaire ? `?annee_scolaire=${anneeScolaire}` : '';
    const response = await fetch(`/api/historique-eleves/statistiques${params}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
    return response.json();
  }
}; 