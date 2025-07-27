// Modèles pour la gestion des salles

export interface Salle {
  id: number;
  nom: string; // Ex: "Salle 101", "Laboratoire de Physique"
  code: string; // Ex: "S101", "LAB_PHYS"
  type: "classe" | "laboratoire" | "informatique" | "sport" | "amphitheatre" | "bibliotheque" | "autre";
  capacite: number; // Nombre maximum d'élèves
  etage?: number;
  batiment?: string;
  equipements?: string[]; // Ex: ["vidéoprojecteur", "ordinateurs", "tableau interactif"]
  description?: string;
  disponible: boolean;
  dateCreation: string;
  dateModification?: string;
  statut: "active" | "maintenance" | "inactive";
}

// Constantes pour les types de salles
export const TYPES_SALLE = [
  { value: "classe", label: "Salle de classe", icone: "School" },
  { value: "laboratoire", label: "Laboratoire", icone: "Flask" },
  { value: "informatique", label: "Salle informatique", icone: "Monitor" },
  { value: "sport", label: "Salle de sport", icone: "Dumbbell" },
  { value: "amphitheatre", label: "Amphithéâtre", icone: "Users" },
  { value: "bibliotheque", label: "Bibliothèque", icone: "BookOpen" },
  { value: "autre", label: "Autre", icone: "Building" }
] as const;

export const EQUIPEMENTS_DISPONIBLES = [
  "Vidéoprojecteur",
  "Tableau interactif",
  "Ordinateurs",
  "Tablettes",
  "Système audio",
  "Microscopes",
  "Matériel de laboratoire",
  "Équipement sportif",
  "Imprimante",
  "Scanner",
  "Caméra",
  "Climatisation"
] as const;

export const STATUTS_SALLE = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "maintenance", label: "En maintenance", couleur: "orange" },
  { value: "inactive", label: "Inactive", couleur: "gray" }
] as const;

export type TypeSalle = typeof TYPES_SALLE[number]["value"];
export type StatutSalle = typeof STATUTS_SALLE[number]["value"];
export type EquipementSalle = typeof EQUIPEMENTS_DISPONIBLES[number];