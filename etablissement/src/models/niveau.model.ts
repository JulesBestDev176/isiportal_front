// Modèle pour la gestion des niveaux

export interface MatiereNiveauNiveau {
  id: number;
  matiereId: number;
  matiereNom: string;
  niveauId: number;
  heuresParSemaine: number;
  coefficient: number;
  obligatoire: boolean;
  description?: string;
  dateCreation: string;
  dateModification?: string;
}

export interface Niveau {
  id: number;
  nom: string; // Ex: "6ème", "5ème", "1ère S"
  code: string; // Ex: "6EME", "5EME", "1ERE"
  description?: string; // Description du niveau
  cycle: "college" | "lycee"; // Cycle d'enseignement
  ordre: number; // Ordre dans le cycle (1, 2, 3, etc.)
  statut: "active" | "inactive"; // Statut du niveau
  matieres_ids: number[]; // IDs des matières enseignées dans ce niveau
  date_creation: string;
  created_at: string;
  updated_at: string;
}

export interface FormDataNiveau {
  nom: string;
  code: string;
  description: string;
  cycle: "college" | "lycee";
  position?: string; // "first", "last", ou "after_{niveauId}"
  statut: "active" | "inactive";
  matieres_ids: number[];
}

// Constantes
export const NIVEAUX_SECTIONS = [
  { value: "college", label: "Collège", couleur: "blue" },
  { value: "lycee", label: "Lycée", couleur: "green" }
] as const;

export const CYCLES = {
  college: [
    { value: "6ème", label: "6ème", ordre: 1 },
    { value: "5ème", label: "5ème", ordre: 2 },
    { value: "4ème", label: "4ème", ordre: 3 },
    { value: "3ème", label: "3ème", ordre: 4 }
  ],
  lycee: [
    { value: "2nde", label: "2nde", ordre: 1 },
    { value: "1ère", label: "1ère", ordre: 2 },
    { value: "Terminale", label: "Terminale", ordre: 3 }
  ]
} as const;

export type NiveauSectionType = typeof NIVEAUX_SECTIONS[number]["value"];
export type CycleType = typeof CYCLES.college[number]["value"] | typeof CYCLES.lycee[number]["value"];

// Fonctions utilitaires
export const getNiveauxParSection = (niveaux: Niveau[], section: NiveauSectionType): Niveau[] => {
  return niveaux.filter(niveau => niveau.cycle === section).sort((a, b) => a.ordre - b.ordre);
};

export const getMatieresParNiveau = (niveau: Niveau): number[] => {
  return niveau.matieres_ids || [];
};

export const getNiveauParId = (niveaux: Niveau[], id: number): Niveau | undefined => {
  return niveaux.find(niveau => niveau.id === id);
};