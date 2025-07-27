// Modèle pour la gestion des années scolaires

export interface AnneeScolaire {
  id: number;
  nom: string; // Ex: "2023-2024", "2024-2025"
  anneeDebut: number; // 2023
  anneeFin: number; // 2024
  dateDebut: string; // Date de début de l'année scolaire
  dateFin: string; // Date de fin de l'année scolaire
  statut: "active" | "terminee" | "planifiee";
  description?: string;
  dateCreation: string;
  dateModification?: string;
}

// Périodes dans une année scolaire (trimestres, semestres, etc.)
export interface PeriodeScolaire {
  id: number;
  anneeScolaireId: number;
  nom: string; // Ex: "1er Trimestre", "2ème Semestre"
  ordre: number; // Ordre dans l'année (1, 2, 3, etc.)
  dateDebut: string;
  dateFin: string;
  statut: "active" | "terminee" | "planifiee";
  description?: string;
}

// Constantes
export const STATUTS_ANNEE_SCOLAIRE = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "terminee", label: "Terminée", couleur: "blue" },
  { value: "planifiee", label: "Planifiée", couleur: "orange" }
] as const;

export const STATUTS_PERIODE = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "terminee", label: "Terminée", couleur: "blue" },
  { value: "planifiee", label: "Planifiée", couleur: "orange" }
] as const;

export type StatutAnneeScolaire = typeof STATUTS_ANNEE_SCOLAIRE[number]["value"];
export type StatutPeriode = typeof STATUTS_PERIODE[number]["value"];

// Fonctions utilitaires
export const getAnneeScolaireActuelle = (anneesScolaires: AnneeScolaire[]): AnneeScolaire | undefined => {
  const maintenant = new Date();
  return anneesScolaires.find(annee => {
    const debut = new Date(annee.dateDebut);
    const fin = new Date(annee.dateFin);
    return maintenant >= debut && maintenant <= fin;
  });
};

export const getAnneeScolaireParId = (anneesScolaires: AnneeScolaire[], id: number): AnneeScolaire | undefined => {
  return anneesScolaires.find(annee => annee.id === id);
};

export const formaterAnneeScolaire = (annee: AnneeScolaire): string => {
  return `${annee.anneeDebut}-${annee.anneeFin}`;
};