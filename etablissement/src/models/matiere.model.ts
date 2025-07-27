// Modèles pour la gestion des matières

export interface Matiere {
  id: number;
  nom: string;
  code: string; // Ex: MATH, FRAN, HIST, etc.
  description?: string;
  couleur?: string; // Pour l'affichage dans l'emploi du temps
  coefficient?: number;
  niveaux: number[]; // IDs des niveaux où cette matière est enseignée
  dateCreation: string;
  dateModification?: string;
  statut: "active" | "inactive";
}

export interface MatiereNiveau {
  id: number;
  matiereId: number;
  niveauId: number;
  heuresParSemaine: number;
  coefficient: number;
  dateCreation: string;
  dateModification?: string;
  statut: "active" | "inactive";
  
  // Champs calculés pour l'affichage
  matiereNom?: string;
  niveauNom?: string;
}

// Constantes pour les matières courantes
export const MATIERES_COURANTES = [
  { code: "MATH", nom: "Mathématiques", couleur: "#3B82F6" },
  { code: "FRAN", nom: "Français", couleur: "#EF4444" },
  { code: "HIST", nom: "Histoire-Géographie", couleur: "#F59E0B" },
  { code: "ANGL", nom: "Anglais", couleur: "#10B981" },
  { code: "ESP", nom: "Espagnol", couleur: "#F97316" },
  { code: "ALL", nom: "Allemand", couleur: "#8B5CF6" },
  { code: "PHYS", nom: "Physique-Chimie", couleur: "#06B6D4" },
  { code: "SVT", nom: "Sciences de la Vie et de la Terre", couleur: "#84CC16" },
  { code: "EPS", nom: "Éducation Physique et Sportive", couleur: "#F43F5E" },
  { code: "ART", nom: "Arts Plastiques", couleur: "#A855F7" },
  { code: "MUS", nom: "Éducation Musicale", couleur: "#EC4899" },
  { code: "TECH", nom: "Technologie", couleur: "#6B7280" },
  { code: "PHILO", nom: "Philosophie", couleur: "#1F2937" },
  { code: "ECO", nom: "Sciences Économiques et Sociales", couleur: "#059669" }
] as const;

export const STATUTS_MATIERE = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "inactive", label: "Inactive", couleur: "gray" }
] as const;

export type StatutMatiere = typeof STATUTS_MATIERE[number]["value"];
export type CodeMatiere = typeof MATIERES_COURANTES[number]["code"];

// Fonctions utilitaires
export const getStatutInfo = (statut: StatutMatiere) => {
  return STATUTS_MATIERE.find(s => s.value === statut);
};

export const getMatiereColorClass = (statut: StatutMatiere): string => {
  switch (statut) {
    case "active": return 'bg-green-100 text-green-800';
    case "inactive": return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getMatiereByCode = (code: CodeMatiere) => {
  return MATIERES_COURANTES.find(m => m.code === code);
};