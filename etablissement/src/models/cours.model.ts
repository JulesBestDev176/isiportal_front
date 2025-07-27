// Modèles pour la gestion des cours

export interface Cours {
  id: number;
  titre: string;
  description: string;
  matiereId: number; // Référence à la matière
  niveauId: number; // Référence au niveau (6ème, 5ème, etc.)
  professeurId: number; // Référence au professeur
  anneeScolaireId: number; // Référence à l'année scolaire
  semestresIds: number[]; // Un ou deux semestres (1 ou 2 éléments max)
  dateCreation: string;
  dateModification?: string;
  statut: "planifie" | "en_cours" | "termine" | "annule";
  coefficient?: number;
  heuresParSemaine: number;
  ressources?: Ressource[];
  
  // Champs calculés pour l'affichage
  matiereNom?: string;
  niveauNom?: string;
  professeurNom?: string;
  anneeScolaireNom?: string;
}

export interface Ressource {
  id: number;
  nom: string;
  type: "pdf" | "video" | "audio" | "image" | "lien";
  url: string;
  taille?: string;
  obligatoire: boolean;
  dateAjout: string;
}

// Constantes
export const STATUTS_COURS = [
  { value: "planifie", label: "Planifié", couleur: "blue" },
  { value: "en_cours", label: "En cours", couleur: "green" },
  { value: "termine", label: "Terminé", couleur: "gray" },
  { value: "annule", label: "Annulé", couleur: "red" }
] as const;

export const TYPES_RESSOURCE = [
  { value: "pdf", label: "PDF", icone: "FileText" },
  { value: "video", label: "Vidéo", icone: "Video" },
  { value: "audio", label: "Audio", icone: "Volume2" },
  { value: "image", label: "Image", icone: "Image" },
  { value: "lien", label: "Lien", icone: "Link" }
] as const;

export type StatutCours = typeof STATUTS_COURS[number]["value"];
export type TypeRessource = typeof TYPES_RESSOURCE[number]["value"];

// Interface pour les données de formulaire
export interface FormDataCours {
  titre: string;
  description: string;
  matiereId: string;
  niveauId: string;
  professeurId: string;
  anneeScolaireId: string;
  heuresParSemaine: number;
  coefficient?: number;
  statut: string;
}

// Interface pour les erreurs de validation
export interface CoursErrors {
  titre?: string;
  description?: string;
  matiereId?: string;
  niveauId?: string;
  professeurId?: string;
  anneeScolaireId?: string;
  heuresParSemaine?: string;
}