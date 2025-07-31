import { apiClient } from './apiClient';

export interface Cours {
  id: number;
  titre: string;
  description: string;
  matiere: {
    id: number;
    nom: string;
    code: string;
    coefficient: number;
  };
  niveau: {
    id: number;
    nom: string;
    cycle: string;
  };
  professeur?: {
    nom: string;
    prenom: string;
    nom_complet: string;
  };
  statut: string;
  statut_libelle: string;
  heures_par_semaine: number;
  coefficient: number;
  moyenne?: number;
  nombre_notes: number;
  derniere_note?: {
    note: number;
    type_evaluation: string;
    date_evaluation: string;
    appreciation?: string;
  };
  assignation?: {
    heures_par_semaine: number;
    remarques?: string;
  };
}

export interface EleveInfo {
  id: number;
  nom: string;
  prenom: string;
  nom_complet: string;
  classe: {
    id: number;
    nom: string;
    niveau: {
      id: number;
      nom: string;
    };
  };
}

export interface StatistiquesGenerales {
  total_cours: number;
  moyenne_generale?: number;
  cours_avec_notes: number;
  cours_sans_notes: number;
}

export interface MesCoursResponse {
  cours: Cours[];
  eleve: EleveInfo;
  statistiques: StatistiquesGenerales;
}

export class EleveCoursService {
  /**
   * Récupérer les cours de l'élève connecté
   */
  static async getMesCours(): Promise<MesCoursResponse> {
    try {
      const response = await apiClient.get('/parent-eleve/mes-cours');
      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des cours:', error);
      throw new Error(
        error.message || 'Erreur lors de la récupération des cours'
      );
    }
  }

  /**
   * Récupérer les détails d'un cours spécifique
   */
  static async getDetailsCours(coursId: number): Promise<any> {
    try {
      const response = await apiClient.get(`/parent-eleve/cours/${coursId}/details`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des détails du cours:', error);
      throw new Error(
        error.message || 'Erreur lors de la récupération des détails du cours'
      );
    }
  }

  /**
   * Filtrer les cours selon les critères
   */
  static filtrerCours(
    cours: Cours[], 
    filtres: {
      recherche?: string;
      matiere?: string;
      statut?: string;
    }
  ): Cours[] {
    return cours.filter(c => {
      const matchTexte = !filtres.recherche || 
        c.titre.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
        c.description.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
        c.matiere.nom.toLowerCase().includes(filtres.recherche.toLowerCase());
      
      const matchMatiere = !filtres.matiere || c.matiere.nom === filtres.matiere;
      const matchStatut = !filtres.statut || c.statut === filtres.statut;
      
      return matchTexte && matchMatiere && matchStatut;
    });
  }

  /**
   * Obtenir les matières uniques des cours
   */
  static getMatieres(cours: Cours[]): string[] {
    return [...new Set(cours.map(c => c.matiere.nom))];
  }

  /**
   * Obtenir les statuts uniques des cours
   */
  static getStatuts(cours: Cours[]): Array<{value: string, label: string}> {
    const statuts = [...new Set(cours.map(c => c.statut))];
    return statuts.map(statut => ({
      value: statut,
      label: this.getStatutLabel(statut)
    }));
  }

  /**
   * Obtenir le libellé d'un statut
   */
  static getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'planifie': 'Planifié',
      'annule': 'Annulé'
    };
    return labels[statut] || statut;
  }

  /**
   * Obtenir la couleur d'un statut
   */
  static getStatutColor(statut: string): string {
    const colors: Record<string, string> = {
      'en_cours': 'bg-blue-100 text-blue-800',
      'termine': 'bg-green-100 text-green-800',
      'planifie': 'bg-yellow-100 text-yellow-800',
      'annule': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Obtenir la couleur d'une moyenne
   */
  static getMoyenneColor(moyenne?: number): string {
    if (!moyenne) return 'text-gray-500';
    if (moyenne >= 16) return 'text-green-600';
    if (moyenne >= 12) return 'text-blue-600';
    if (moyenne >= 10) return 'text-orange-600';
    return 'text-red-600';
  }

  /**
   * Formater une moyenne pour l'affichage
   */
  static formaterMoyenne(moyenne?: number): string {
    return moyenne ? `${moyenne}/20` : '--/20';
  }
}