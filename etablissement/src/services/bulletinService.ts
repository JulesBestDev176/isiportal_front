import { ApiResponse, PaginationParams, PaginatedResponse } from '../types/common.types';
import { MatiereBulletin, BulletinSemestre } from '../models/classe.model';

export interface Bulletin {
  id: number;
  eleveId: number;
  anneeScolaire: string;
  semestre: number;
  matieres: MatiereBulletin[];
  moyenneGenerale: number;
  rang?: number;
  appreciation?: string;
  dateCreation: string;
}

export interface BulletinSemestreData {
  semestre: number;
  matieres: MatiereBulletin[];
  moyenneSemestre: number;
  appreciation?: string;
}

// Service pour les bulletins
export const bulletinService = {
  // Récupérer tous les bulletins
  async getBulletins(params?: PaginationParams): Promise<PaginatedResponse<Bulletin>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(`/api/bulletins?${queryParams}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des bulletins');
    return response.json();
  },

  // Récupérer un bulletin par ID
  async getBulletin(id: number): Promise<ApiResponse<Bulletin>> {
    const response = await fetch(`/api/bulletins/${id}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération du bulletin');
    return response.json();
  },

  // Récupérer les bulletins d'un élève
  async getBulletinsByEleve(eleveId: number): Promise<ApiResponse<Bulletin[]>> {
    const response = await fetch(`/api/eleves/${eleveId}/bulletins`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des bulletins de l\'élève');
    return response.json();
  },

  // Alias pour getBulletinsByEleve (pour compatibilité)
  async getBulletinsEleve(eleveId: number): Promise<ApiResponse<Bulletin[]>> {
    return this.getBulletinsByEleve(eleveId);
  },

  // Récupérer les bulletins d'une classe
  async getBulletinsByClasse(classeId: number, anneeScolaire?: string): Promise<ApiResponse<Bulletin[]>> {
    const params = anneeScolaire ? `?annee_scolaire=${anneeScolaire}` : '';
    const response = await fetch(`/api/classes/${classeId}/bulletins${params}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des bulletins de la classe');
    return response.json();
  },

  // Créer un bulletin
  async createBulletin(data: Omit<Bulletin, 'id' | 'dateCreation'>): Promise<ApiResponse<Bulletin>> {
    const response = await fetch('/api/bulletins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création du bulletin');
    return response.json();
  },

  // Mettre à jour un bulletin
  async updateBulletin(id: number, data: Partial<Bulletin>): Promise<ApiResponse<Bulletin>> {
    const response = await fetch(`/api/bulletins/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du bulletin');
    return response.json();
  },

  // Supprimer un bulletin
  async deleteBulletin(id: number): Promise<ApiResponse<void>> {
    const response = await fetch(`/api/bulletins/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression du bulletin');
    return response.json();
  },

  // Calculer la moyenne d'un bulletin
  async calculateMoyenne(bulletinId: number): Promise<ApiResponse<{ moyenne: number }>> {
    const response = await fetch(`/api/bulletins/${bulletinId}/calculate-moyenne`);
    if (!response.ok) throw new Error('Erreur lors du calcul de la moyenne');
    return response.json();
  }
}; 