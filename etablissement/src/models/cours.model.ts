// Modèle pour les cours et leurs assignations

export interface Ressource {
  id: number;
  nom: string;
  type: "document" | "video" | "lien" | "image";
  url?: string;
  description?: string;
  taille?: number;
  dateCreation: string;
}

export interface Cours {
  id: number;
  titre: string;
  description?: string;
  matiereId: number;
  matiereNom: string;
  niveauId: number;
  niveauNom: string;
  anneeScolaireId: number;
  anneeScolaireNom: string;
  heuresParSemaine: number;
  coefficient: number;
  statut: "active" | "terminee" | "annulee" | "en_cours" | "planifie";
  dateCreation: string;
  dateModification?: string;
  professeurId?: number;
  professeurNom?: string;
  classes?: ClasseCours[];
  creneaux?: CreneauCours[];
  assignations?: AssignationCours[];
  ressources?: Ressource[];
  semestresIds?: number[];
  progression?: number;
  prochaineCeance?: string;
  salle?: string;
  notes?: string;
  dateDebut?: string;
  dateFin?: string;
}

export interface Creneau {
  id: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  salleId?: number;
  salleNom?: string;
  classeId?: number;
  classeNom?: string;
  professeurId?: number;
  professeurNom?: string;
  coursId?: number;
  coursTitre?: string;
  statut: "planifie" | "en_cours" | "termine" | "annule";
  dateCreation: string;
}

export interface AssignationCoursClasse {
  id: number;
  coursId: number;
  classeId: number;
  anneeScolaireId: number;
  heuresParSemaine: number;
  statut: "active" | "terminee" | "annulee" | "en_cours" | "planifie";
  remarques?: string;
  progression?: number;
  prochaineCeance?: string;
  salle?: string;
  notes?: string;
  creneaux?: CreneauCours[];
}

export interface AssignationCours {
  id: number;
  coursId: number;
  classeId: number;
  anneeScolaireId: number;
  heuresParSemaine: number;
  statut: "active" | "terminee" | "annulee" | "en_cours" | "planifie";
  remarques?: string;
  progression?: number;
  prochaineCeance?: string;
  salle?: string;
  notes?: string;
  creneaux?: CreneauCours[];
  professeurId?: number;
  professeurNom?: string;
  classeNom?: string;
  dateDebut?: string;
  dateFin?: string;
}

export interface ProgressionSeance {
  id: number;
  assignationId: number;
  seance: number;
  progression: number;
  date: string;
  remarques?: string;
}

export interface ClasseCours {
  id: number;
  nom: string;
  niveauNom: string;
  nombreEleves: number;
}

export interface CreneauCours {
  id: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  salleNom?: string;
  classeNom?: string;
  professeurNom?: string;
  classeId?: number;
  statut?: "planifie" | "en_cours" | "termine" | "annule";
  dateCreation?: string;
}

export interface FormDataCours {
  titre: string;
  description?: string;
  matiereId: number;
  niveauId: number;
  anneeScolaireId: number;
  heuresParSemaine: number;
  coefficient: number;
  professeurId?: number;
  creneaux?: Creneau[];
  semestresIds?: number[];
  statut?: "active" | "terminee" | "annulee" | "en_cours" | "planifie";
}

export interface CoursErrors {
  titre?: string;
  description?: string;
  matiereId?: string;
  niveauId?: string;
  anneeScolaireId?: string;
  heuresParSemaine?: string;
  coefficient?: string;
  professeurId?: string;
  semestresIds?: string;
  assignations?: string;
  creneaux?: string;
}

// Constantes
export const STATUTS_COURS = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "terminee", label: "Terminée", couleur: "blue" },
  { value: "annulee", label: "Annulée", couleur: "red" },
  { value: "en_cours", label: "En cours", couleur: "orange" },
  { value: "planifie", label: "Planifiée", couleur: "yellow" }
] as const;

export type StatutCours = typeof STATUTS_COURS[number]["value"];

// Fonctions utilitaires
export const getStatutInfo = (statut: StatutCours) => {
  return STATUTS_COURS.find(s => s.value === statut);
};

export const getCoursColorClass = (statut: StatutCours): string => {
  const statutInfo = getStatutInfo(statut);
  return statutInfo ? `bg-${statutInfo.couleur}-100 text-${statutInfo.couleur}-800` : 'bg-gray-100 text-gray-800';
};