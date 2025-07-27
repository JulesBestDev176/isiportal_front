// Modèles pour la gestion des salles

export interface Salle {
  id: number;
  nom: string; // Ex: "Salle 101", "Laboratoire Physique"
  code: string; // Ex: "101", "LAB_PHYS"
  batimentId: number; // Référence au bâtiment
  batimentNom?: string; // Nom du bâtiment pour l'affichage
  etage: number;
  capacite: number; // Nombre de places
  type: "salle_cours" | "laboratoire" | "salle_info" | "salle_arts" | "salle_musique" | "salle_sport" | "amphitheatre" | "bureau" | "autre";
  equipements?: string[]; // Liste des équipements
  description?: string;
  dateCreation: string;
  dateModification?: string;
  statut: "active" | "inactive" | "maintenance";
}

export interface FormDataSalle {
  nom: string;
  code: string;
  batimentId: string;
  etage: number;
  capacite: number;
  type: string;
  equipements: string[];
  description: string;
  statut: string;
}

export interface SalleErrors {
  nom?: string;
  code?: string;
  batimentId?: string;
  etage?: string;
  capacite?: string;
  type?: string;
  equipements?: string;
  description?: string;
}

// Constantes
export const TYPES_SALLE = [
  { value: "salle_cours", label: "Salle de cours", icone: "BookOpen" },
  { value: "laboratoire", label: "Laboratoire", icone: "FlaskConical" },
  { value: "salle_info", label: "Salle informatique", icone: "Monitor" },
  { value: "salle_arts", label: "Salle d'arts plastiques", icone: "Palette" },
  { value: "salle_musique", label: "Salle de musique", icone: "Music" },
  { value: "salle_sport", label: "Salle de sport", icone: "Dumbbell" },
  { value: "amphitheatre", label: "Amphithéâtre", icone: "Users" },
  { value: "bureau", label: "Bureau", icone: "Briefcase" },
  { value: "autre", label: "Autre", icone: "Building" }
] as const;

export const STATUTS_SALLE = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "inactive", label: "Inactive", couleur: "gray" },
  { value: "maintenance", label: "En maintenance", couleur: "orange" }
] as const;

export type StatutSalle = "active" | "inactive" | "maintenance" | "disponible" | "occupee" | "reservee";
export type TypeSalle = typeof TYPES_SALLE[number]["value"];

// Fonctions utilitaires
export const getStatutInfo = (statut: StatutSalle) => {
  return STATUTS_SALLE.find(s => s.value === statut);
};

export const getTypeInfo = (type: TypeSalle) => {
  return TYPES_SALLE.find(t => t.value === type);
};

export const getSalleColorClass = (statut: StatutSalle): string => {
  switch (statut) {
    case "disponible": return 'bg-green-100 text-green-800';
    case "occupee": return 'bg-red-100 text-red-800';
    case "maintenance": return 'bg-yellow-100 text-yellow-800';
    case "reservee": return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};