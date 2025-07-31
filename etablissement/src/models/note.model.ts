/**
 * Modèle pour les notes et évaluations
 */

// Type pour les notes de l'API
export interface ApiNote {
  id: number;
  eleve_id: number;
  cours_id: number;
  matiere_id: number;
  annee_scolaire_id: number;
  semestre: number;
  type_evaluation: string;
  note: number;
  coefficient: number;
  appreciation: string;
  date_evaluation: string;
  commentaire: string | null;
  matiere?: {
    id: number;
    nom: string;
    code: string;
  };
  cours?: {
    id: number;
    titre: string;
    matiere_id: number;
  };
  annee_scolaire?: {
    id: number;
    nom: string;
    statut: string;
  };
}

export interface Note {
  id: number;
  etudiantId: number;
  classeId: number;
  matiereId: number;
  professeurId: number;
  type: "devoir1" | "devoir2" | "composition" | "controle" | "oral" | "tp";
  valeur: number | null; // null si absent
  bareme: number;
  coefficient?: number;
  date: string;
  titre: string;
  observations?: string;
  absent?: boolean;
  rattrapage?: {
    date: string;
    valeur: number;
    observations?: string;
  };
  dateCreation: string;
  dateModification: string;
}

export interface BulletinMatiere {
  matiereId: number;
  matiere: string; // Nom de la matière pour l'affichage
  devoir1: number | null;
  devoir2: number | null;
  composition: number | null;
  moyenne: number | null;
  rang?: number;
  appreciation?: string;
  absences: number;
  coefficient: number;
}

export interface Bulletin {
  id: number;
  etudiantId: number;
  classeId: number;
  trimestre: 1 | 2 | 3;
  anneeScolaireId: number;
  matieres: BulletinMatiere[];
  moyenneGenerale: number | null;
  rangGeneral?: number;
  appreciationGenerale?: string;
  absencesTotales: number;
  retardsTotaux: number;
  dateGeneration: string;
  statut: "brouillon" | "valide" | "envoye";
}

// Types pour les statistiques de notes
export interface StatistiquesNote {
  moyenne: number;
  mediane: number;
  minimum: number;
  maximum: number;
  ecartType: number;
  nombreNotes: number;
  nombreAbsents: number;
}

export interface StatistiquesMatiere {
  matiereId: number;
  matiere: string;
  statistiques: StatistiquesNote;
  repartition: {
    tranche: string;
    nombre: number;
    pourcentage: number;
  }[];
}

// Constantes
export const TYPES_EVALUATION = {
  devoir1: "Devoir 1",
  devoir2: "Devoir 2", 
  composition: "Composition",
  controle: "Contrôle continu",
  oral: "Évaluation orale",
  tp: "Travaux pratiques"
} as const;

export const COEFFICIENTS_PAR_TYPE = {
  devoir1: 1,
  devoir2: 1,
  composition: 2,
  controle: 1,
  oral: 1,
  tp: 1
} as const;

export const BAREMES_STANDARDS = [10, 20, 100] as const;

export type TypeEvaluation = keyof typeof TYPES_EVALUATION;
export type StatutBulletin = Bulletin["statut"];