// Modèles pour la gestion des emplois du temps

export interface EmploiDuTemps {
  id: number;
  nom: string; // Ex: "Emploi du temps 6ème A - 2023/2024"
  classeId: number;
  anneeScolaireId: number;
  semestreId?: number; // Optionnel si l'emploi du temps couvre toute l'année
  creneaux: CreneauEmploiDuTemps[];
  dateCreation: string;
  dateModification?: string;
  statut: "brouillon" | "valide" | "archive";
  version: number; // Pour gérer les versions d'emplois du temps
}

export interface CreneauEmploiDuTemps {
  id: number;
  emploiDuTempsId: number;
  coursId: number; // Référence au cours
  salleId: number; // Référence à la salle
  jour: JourSemaine;
  heureDebut: string; // Format HH:MM
  heureFin: string; // Format HH:MM
  duree: number; // En minutes (max 120 minutes = 2h)
  semaines?: number[]; // Semaines concernées (1-36), si vide = toutes les semaines
  dateDebut?: string; // Date de début spécifique
  dateFin?: string; // Date de fin spécifique
  recurrence: "hebdomadaire" | "ponctuel";
  notes?: string;
  statut: "actif" | "annule" | "reporte";
}

export interface ConflitEmploiDuTemps {
  id: number;
  type: "salle" | "professeur" | "classe";
  creneauId1: number;
  creneauId2: number;
  description: string;
  gravite: "faible" | "moyenne" | "elevee";
  resolu: boolean;
  dateDetection: string;
}

export interface ModificationEmploiDuTemps {
  id: number;
  emploiDuTempsId: number;
  creneauId: number;
  typeModification: "ajout" | "suppression" | "modification" | "deplacement";
  anciennesValeurs?: Partial<CreneauEmploiDuTemps>;
  nouvellesValeurs?: Partial<CreneauEmploiDuTemps>;
  motif: string;
  dateModification: string;
  utilisateurId: number;
  valide: boolean;
}

// Constantes
export const JOURS_SEMAINE = [
  { value: "lundi", label: "Lundi", ordre: 1 },
  { value: "mardi", label: "Mardi", ordre: 2 },
  { value: "mercredi", label: "Mercredi", ordre: 3 },
  { value: "jeudi", label: "Jeudi", ordre: 4 },
  { value: "vendredi", label: "Vendredi", ordre: 5 },
  { value: "samedi", label: "Samedi", ordre: 6 }
] as const;

export const HEURES_COURS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00"
] as const;

export const DUREES_COURS = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 heure" },
  { value: 90, label: "1h30" },
  { value: 120, label: "2 heures" }
] as const;

export const STATUTS_EMPLOI_DU_TEMPS = [
  { value: "brouillon", label: "Brouillon", couleur: "gray" },
  { value: "valide", label: "Validé", couleur: "green" },
  { value: "archive", label: "Archivé", couleur: "orange" }
] as const;

export const STATUTS_CRENEAU = [
  { value: "actif", label: "Actif", couleur: "green" },
  { value: "annule", label: "Annulé", couleur: "red" },
  { value: "reporte", label: "Reporté", couleur: "orange" }
] as const;

export const TYPES_RECURRENCE = [
  { value: "hebdomadaire", label: "Hebdomadaire" },
  { value: "ponctuel", label: "Ponctuel" }
] as const;

export type JourSemaine = typeof JOURS_SEMAINE[number]["value"];
export type StatutEmploiDuTemps = typeof STATUTS_EMPLOI_DU_TEMPS[number]["value"];
export type StatutCreneau = typeof STATUTS_CRENEAU[number]["value"];
export type TypeRecurrence = typeof TYPES_RECURRENCE[number]["value"];