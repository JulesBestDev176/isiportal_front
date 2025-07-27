// Modèles pour la gestion des sections scolaires

export interface Section {
  id: number;
  nom: string; // "Collège" ou "Lycée"
  code: string; // "COLLEGE" ou "LYCEE"
  description?: string;
  niveaux: number[]; // IDs des niveaux associés
  dateCreation: string;
  dateModification?: string;
  statut: "active" | "inactive";
}

// Constantes pour les sections
export const SECTIONS_DISPONIBLES = [
  {
    code: "COLLEGE",
    nom: "Collège",
    description: "Enseignement secondaire premier cycle (6ème à 3ème)",
    niveaux: ["6EME", "5EME", "4EME", "3EME"]
  },
  {
    code: "LYCEE",
    nom: "Lycée",
    description: "Enseignement secondaire second cycle (2nde à Terminale)",
    niveaux: ["2NDE", "1ERE", "TERM"]
  }
] as const;

export const STATUTS_SECTION = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "inactive", label: "Inactive", couleur: "gray" }
] as const;

export type StatutSection = typeof STATUTS_SECTION[number]["value"];
export type CodeSection = typeof SECTIONS_DISPONIBLES[number]["code"];