// Modèle pour la gestion des niveaux

export interface MatiereNiveau {
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
  ordre: number; // Ordre dans le cycle (1, 2, 3, etc.)
  section: "college" | "lycee";
  cycle: string; // Ex: "Collège", "Lycée"
  description?: string;
  matieres: MatiereNiveau[]; // Matières enseignées dans ce niveau
  actif: boolean;
  dateCreation: string;
  dateModification?: string;
}

export interface FormDataNiveau {
  nom: string;
  ordre: number;
  section: "college" | "lycee";
  description: string;
  matieres: MatiereNiveau[];
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
  return niveaux.filter(niveau => niveau.section === section).sort((a, b) => a.ordre - b.ordre);
};

export const getMatieresParNiveau = (niveau: Niveau): MatiereNiveau[] => {
  return niveau.matieres.sort((a, b) => a.matiereNom.localeCompare(b.matiereNom));
};

export const getNiveauParId = (niveaux: Niveau[], id: number): Niveau | undefined => {
  return niveaux.find(niveau => niveau.id === id);
};