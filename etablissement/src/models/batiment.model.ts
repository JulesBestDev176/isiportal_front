// Modèle pour la gestion des bâtiments

export interface Batiment {
  id: number;
  nom: string; // Ex: "Bâtiment A", "Bâtiment Principal"
  code: string; // Ex: "A", "PRINCIPAL"
  description?: string;
  adresse?: string;
  nombreEtages: number;
  dateConstruction?: string;
  dateCreation: string;
  dateModification?: string;
  statut: "actif" | "inactif" | "renovation";
}

export interface FormDataBatiment {
  nom: string;
  code: string;
  description: string;
  adresse: string;
  nombreEtages: number;
  dateConstruction: string;
}

export interface BatimentErrors {
  nom?: string;
  code?: string;
  description?: string;
  adresse?: string;
  nombreEtages?: string;
  dateConstruction?: string;
}

// Constantes
export const STATUTS_BATIMENT = [
  { value: "actif", label: "Actif", couleur: "green" },
  { value: "inactif", label: "Inactif", couleur: "gray" },
  { value: "renovation", label: "En rénovation", couleur: "orange" }
] as const;

export type StatutBatiment = "actif" | "inactif" | "renovation" | "maintenance";

// Fonctions utilitaires
export const getStatutInfo = (statut: StatutBatiment) => {
  return STATUTS_BATIMENT.find(s => s.value === statut);
};

export const getBatimentColorClass = (statut: StatutBatiment): string => {
  switch (statut) {
    case "actif": return 'bg-green-100 text-green-800';
    case "inactif": return 'bg-red-100 text-red-800';
    case "maintenance": return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}; 