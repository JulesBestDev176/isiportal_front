// Service pour la gestion des élèves
import { EleveClasse, HistoriqueEleveClasse, DetailsEleve } from '../models/eleve.model';
import { Note } from '../models/note.model';
import { Absence } from '../models/absence.model';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface EleveFilters {
  classeId?: number;
  niveauId?: number;
  statut?: string;
  search?: string;
}

export interface NotesEleve {
  [eleveId: number]: {
    [anneeScolaireId: number]: {
      [semestre: string]: {
        matieres: {
          [matiereId: number]: {
            devoir1?: number;
            devoir2?: number;
            composition?: number;
            coefficient: number;
            appreciation?: string;
          };
        };
        moyenne: number;
      };
    };
  };
}

export interface AbsencesEleve {
  [eleveId: number]: {
    [anneeScolaireId: number]: Absence[];
  };
}

export class EleveService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/eleves') {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère tous les élèves
   */
  async getEleves(filters?: EleveFilters): Promise<ApiResponse<EleveClasse[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.classeId) queryParams.append('classeId', filters.classeId.toString());
      if (filters?.niveauId) queryParams.append('niveauId', filters.niveauId.toString());
      if (filters?.statut) queryParams.append('statut', filters.statut);
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des élèves'
      };
    }
  }

  /**
   * Récupère un élève par ID
   */
  async getEleve(id: number): Promise<ApiResponse<EleveClasse>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération de l\'élève'
      };
    }
  }

  /**
   * Crée un nouvel élève
   */
  async createEleve(eleve: Omit<EleveClasse, 'id' | 'dateCreation'>): Promise<ApiResponse<EleveClasse>> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eleve),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création de l\'élève'
      };
    }
  }

  /**
   * Met à jour un élève
   */
  async updateEleve(id: number, eleve: Partial<EleveClasse>): Promise<ApiResponse<EleveClasse>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eleve),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de l\'élève'
      };
    }
  }

  /**
   * Supprime un élève
   */
  async deleteEleve(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression de l\'élève'
      };
    }
  }

  /**
   * Récupère les élèves d'une classe
   */
  async getElevesByClasse(classeId: number): Promise<ApiResponse<EleveClasse[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/classe/${classeId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des élèves de la classe'
      };
    }
  }

  /**
   * Récupère l'historique d'un élève
   */
  async getEleveHistorique(eleveId: number): Promise<ApiResponse<HistoriqueEleveClasse[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/${eleveId}/historique`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération de l\'historique de l\'élève'
      };
    }
  }

  /**
   * Récupère les détails d'un élève (notes, absences, etc.)
   */
  async getEleveDetails(eleveId: number, anneeScolaireId: number): Promise<ApiResponse<DetailsEleve>> {
    try {
      const response = await fetch(`${this.baseUrl}/${eleveId}/details/${anneeScolaireId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des détails de l\'élève'
      };
    }
  }

  /**
   * Récupère les notes d'un élève
   */
  async getEleveNotes(eleveId: number, anneeScolaireId: number): Promise<ApiResponse<NotesEleve>> {
    try {
      const response = await fetch(`${this.baseUrl}/${eleveId}/notes/${anneeScolaireId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des notes de l\'élève'
      };
    }
  }

  /**
   * Récupère les absences d'un élève
   */
  async getEleveAbsences(eleveId: number, anneeScolaireId: number): Promise<ApiResponse<AbsencesEleve>> {
    try {
      const response = await fetch(`${this.baseUrl}/${eleveId}/absences/${anneeScolaireId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des absences de l\'élève'
      };
    }
  }

  /**
   * Transfère un élève vers une nouvelle classe
   */
  async transfererEleve(eleveId: number, nouvelleClasseId: number, reglesTransfert: any): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${eleveId}/transferer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nouvelleClasseId, reglesTransfert }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du transfert de l\'élève'
      };
    }
  }

  /**
   * Récupère les élèves éligibles au transfert
   */
  async getElevesEligiblesTransfert(classeId: number, reglesTransfert: any): Promise<ApiResponse<EleveClasse[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/classe/${classeId}/eleves-eligibles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reglesTransfert }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des élèves éligibles'
      };
    }
  }
}

export const eleveService = new EleveService(); 