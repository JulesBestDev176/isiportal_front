// Modèles pour la gestion des absences

export interface Absence {
  id: number;
  eleveId: number; // Référence à l'élève
  coursId: number; // Référence au cours
  creneauId: number; // Référence au créneau d'emploi du temps
  professeurId: number; // Professeur qui a fait l'appel
  classeId: number; // Classe concernée
  dateAbsence: string; // Date du cours
  heureDebut: string; // Heure de début du cours
  heureFin: string; // Heure de fin du cours
  type: "absence" | "retard" | "depart_anticipe";
  justifiee: boolean;
  motif?: string; // Motif de l'absence si justifiée
  pieceJustificative?: string; // URL du document justificatif
  dateJustification?: string; // Date de justification
  justifieePar?: number; // ID de la personne qui a justifié (parent/admin)
  commentaire?: string;
  dateCreation: string;
  dateModification?: string;
  statut: "en_attente" | "justifiee" | "non_justifiee";
}

export interface AppelClasse {
  id: number;
  coursId: number;
  creneauId: number;
  classeId: number;
  professeurId: number;
  dateAppel: string;
  heureDebut: string;
  heureFin: string;
  elevesPresents: number[]; // IDs des élèves présents
  elevesAbsents: number[]; // IDs des élèves absents
  elevesRetard: number[]; // IDs des élèves en retard
  elevesPartisAnticipe: number[]; // IDs des élèves partis en avance
  commentaire?: string;
  statut: "en_cours" | "termine" | "annule";
  dateCreation: string;
  dateModification?: string;
}

export interface StatistiqueAbsence {
  eleveId: number;
  nom: string;
  prenom: string;
  classeId: number;
  totalAbsences: number;
  absencesJustifiees: number;
  absencesNonJustifiees: number;
  retards: number;
  departsAnticipes: number;
  tauxAbsenteisme: number; // Pourcentage
  derniereMiseAJour: string;
}

export interface RapportAbsence {
  id: number;
  classeId: number;
  professeurId: number;
  periode: "jour" | "semaine" | "mois" | "trimestre";
  dateDebut: string;
  dateFin: string;
  statistiques: StatistiqueAbsence[];
  totalHeuresManquees: number;
  tauxAbsenteismeClasse: number;
  dateGeneration: string;
}

// Constantes
export const TYPES_ABSENCE = [
  { value: "absence", label: "Absence", couleur: "red", icone: "UserX" },
  { value: "retard", label: "Retard", couleur: "orange", icone: "Clock" },
  { value: "depart_anticipe", label: "Départ anticipé", couleur: "yellow", icone: "LogOut" }
] as const;

export const STATUTS_ABSENCE = [
  { value: "en_attente", label: "En attente", couleur: "orange" },
  { value: "justifiee", label: "Justifiée", couleur: "green" },
  { value: "non_justifiee", label: "Non justifiée", couleur: "red" }
] as const;

export const STATUTS_APPEL = [
  { value: "en_cours", label: "En cours", couleur: "blue" },
  { value: "termine", label: "Terminé", couleur: "green" },
  { value: "annule", label: "Annulé", couleur: "gray" }
] as const;

export const MOTIFS_ABSENCE = [
  "Maladie",
  "Rendez-vous médical",
  "Problème familial",
  "Transport",
  "Autre"
] as const;

export type TypeAbsence = typeof TYPES_ABSENCE[number]["value"];
export type StatutAbsence = typeof STATUTS_ABSENCE[number]["value"];
export type StatutAppel = typeof STATUTS_APPEL[number]["value"];
export type MotifAbsence = typeof MOTIFS_ABSENCE[number];