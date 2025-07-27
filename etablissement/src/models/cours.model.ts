// Modèles pour la gestion des cours

export interface Creneau {
  id: number;
  jour: "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi";
  heureDebut: string; // Format "HH:MM"
  heureFin: string; // Format "HH:MM"
  salleId: number; // Référence à la salle
  salleNom?: string; // Nom de la salle pour l'affichage
  classeId: number;
  professeurId: number;
  classeNom?: string;
  professeurNom?: string;
}

export interface Cours {
  id: number;
  titre: string;
  description: string;
  matiereId: number; // Référence à la matière
  niveauId: number; // Référence au niveau (6ème, 5ème, etc.)
  anneeScolaireId: number; // Référence à l'année scolaire
  semestresIds: number[]; // Un ou deux semestres (1 ou 2 éléments max)
  dateCreation: string;
  dateModification?: string;
  statut: "planifie" | "en_cours" | "termine" | "annule";
  coefficient?: number;
  heuresParSemaine: number;
  ressources?: Ressource[];
  creneaux?: Creneau[]; // Créneaux horaires par classe
  
  // Champs calculés pour l'affichage
  matiereNom?: string;
  niveauNom?: string;
  anneeScolaireNom?: string;
  
  // Assignations par classe (remplace professeurId unique)
  assignations?: AssignationCoursClasse[];
}

export interface AssignationCoursClasse {
  id: number;
  classeId: number;
  professeurId: number;
  classeNom?: string;
  professeurNom?: string;
  statut: "active" | "inactive";
}

export interface Ressource {
  id: number;
  type: "document" | "video" | "lien" | "image";
  titre: string;
  url?: string;
  description?: string;
  dateAjout: string;
}

// Interface pour les données du formulaire
export interface FormDataCours {
  titre: string;
  description: string;
  matiereId: string;
  niveauId: string;
  anneeScolaireId: string;
  semestresIds: number[];
  heuresParSemaine: number;
  statut: "planifie" | "en_cours" | "termine" | "annule";
  coefficient: number;
  creneaux?: Creneau[];
}

// Interface pour les erreurs de validation
export interface CoursErrors {
  titre?: string;
  description?: string;
  matiereId?: string;
  niveauId?: string;
  anneeScolaireId?: string;
  heuresParSemaine?: string;
  coefficient?: string;
  semestresIds?: string;
  assignations?: string;
  creneaux?: string;
}

// Constantes
export const STATUTS_COURS = [
  { value: "planifie", label: "Planifié", couleur: "blue" },
  { value: "en_cours", label: "En cours", couleur: "green" },
  { value: "termine", label: "Terminé", couleur: "gray" },
  { value: "annule", label: "Annulé", couleur: "red" }
] as const;

export const TYPES_RESSOURCE = [
  { value: "document", label: "Document", icone: "FileText" },
  { value: "video", label: "Vidéo", icone: "Video" },
  { value: "lien", label: "Lien", icone: "Link" },
  { value: "image", label: "Image", icone: "Image" }
] as const;

export const JOURS_SEMAINE = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" }
] as const;

export type StatutCours = typeof STATUTS_COURS[number]["value"];
export type TypeRessource = typeof TYPES_RESSOURCE[number]["value"];
export type JourSemaine = typeof JOURS_SEMAINE[number]["value"];

// Interface pour l'assignation d'un cours à une classe
export interface AssignationCours {
  id: number;
  coursId: number;
  classeId: number;
  professeurId: number;
  classeNom: string;
  professeurNom: string;
  dateDebut: string;
  dateFin?: string;
  statut: "active" | "terminee" | "annulee";
}

// Interface pour la progression d'une séance
export interface ProgressionSeance {
  id: number;
  coursId: number;
  classeId: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  objectifs: string[];
  activites: string[];
  evaluation: string;
  remarques: string;
  statut: "planifiee" | "en_cours" | "terminee" | "annulee";
}