// Modèles pour la gestion des classes

export interface ProfMatiere {
  matiere: string;
  professeurId: number;
  professeurNom: string;
  heuresParSemaine: number;
}

// Informations spécifiques à une année scolaire pour une classe
export interface ClasseAnneeScolaire {
  id: number;
  classeId: number;
  anneeScolaireId: number;
  anneeScolaireNom: string; // Ex: "2023-2024"
  
  // Élèves de cette année
  elevesIds: number[];
  effectif: number; // Calculé automatiquement depuis elevesIds
  effectifMax: number;
  
  // Professeurs de cette année
  professeurPrincipalId?: number;
  professeurPrincipalNom?: string;
  profsMatieres: ProfMatiere[]; // Matières et professeurs assignés pour cette année
  
  // Informations générales
  description?: string;
  statut: "active" | "inactive" | "archivee";
  
  // Dates
  dateCreation: string;
  dateModification?: string;
}

// Élève avec ses informations de transfert (renommé pour éviter le conflit)
export interface EleveClasseInfo {
  id: number;
  nom: string;
  prenom: string;
  moyenneAnnuelle: number;
  statut: "inscrit" | "transfere" | "redouble";
  dateInscription: string;
  dateTransfert?: string;
  classeDestination?: string; // Classe de destination si transféré
}

// Classe de base (structure permanente)
export interface Classe {
  id: number;
  nom: string; // Ex: "6ème A", "1ère S1"
  niveauId: number; // Référence au niveau
  niveauNom: string; // Ex: "6ème", "1ère"
  
  // Professeur principal
  professeurPrincipalId?: number;
  professeurPrincipalNom?: string;
  
  // Historique des années scolaires
  anneesScolaires: ClasseAnneeScolaire[];
  
  // Informations générales
  description?: string;
  dateCreation: string;
  dateModification?: string;
  statut: "active" | "inactive" | "archivee";
  
  // Propriétés ajoutées pour la compatibilité avec l'API
  effectifActuel?: number;
  effectifMax?: number;
  anneeScolaireNom?: string;
  anneeScolaireStatut?: string;
  
  // Propriétés snake_case pour la compatibilité avec l'API
  niveau_id?: number;
  effectif_max?: number;
  professeur_principal_id?: number | null;
  annee_scolaire_id?: number;
}

// Inscription d'un élève dans une classe pour une année scolaire
export interface InscriptionEleve {
  id: number;
  eleveId: number;
  eleveNom: string;
  classeId: number;
  anneeScolaireId: number;
  anneeScolaireNom: string;
  dateInscription: string;
  dateDesinscription?: string;
  statut: "inscrit" | "desinscrit" | "transfere" | "termine";
  motifDesinscription?: string;
}

// Affectation d'un professeur à une matière dans une classe pour une année scolaire
export interface AffectationProfesseur {
  id: number;
  professeurId: number;
  professeurNom: string;
  classeId: number;
  anneeScolaireId: number;
  matiereId: number;
  matiereNom: string;
  heuresParSemaine: number;
  dateAffectation: string;
  dateFinAffectation?: string;
  statut: "active" | "terminee" | "annulee";
}

// Constantes
export const STATUTS_CLASSE = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "inactive", label: "Inactive", couleur: "orange" },
  { value: "archivee", label: "Archivée", couleur: "gray" }
] as const;

export const STATUTS_INSCRIPTION = [
  { value: "inscrit", label: "Inscrit", couleur: "green" },
  { value: "desinscrit", label: "Désinscrit", couleur: "red" },
  { value: "transfere", label: "Transféré", couleur: "blue" },
  { value: "termine", label: "Terminé", couleur: "gray" }
] as const;

export const STATUTS_AFFECTATION = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "terminee", label: "Terminée", couleur: "gray" },
  { value: "annulee", label: "Annulée", couleur: "red" }
] as const;

export type StatutClasse = typeof STATUTS_CLASSE[number]["value"];
export type StatutInscription = typeof STATUTS_INSCRIPTION[number]["value"];
export type StatutAffectation = typeof STATUTS_AFFECTATION[number]["value"];

// Fonctions utilitaires
export const getClasseAnneeActuelle = (classe: Classe, anneeScolaireId: number): ClasseAnneeScolaire | undefined => {
  return classe.anneesScolaires.find(annee => annee.anneeScolaireId === anneeScolaireId);
};

export const getEffectifActuel = (classe: Classe, anneeScolaireId: number): number => {
  const anneeActuelle = getClasseAnneeActuelle(classe, anneeScolaireId);
  return anneeActuelle?.effectif || 0;
};

export const getProfesseursActuels = (classe: Classe, anneeScolaireId: number): ProfMatiere[] => {
  const anneeActuelle = getClasseAnneeActuelle(classe, anneeScolaireId);
  return anneeActuelle?.profsMatieres || [];
};

// Interface pour le formulaire de classe
export interface FormDataClasse {
  nom: string;
  niveauId: string;
  effectifMax: number;
  description: string;
  professeurPrincipalId: string;
  statut: string;
}

// Interface pour les erreurs de validation
export interface ClasseErrors {
  nom?: string;
  niveauId?: string;
  effectifMax?: string;
}

// Interface pour une matière dans un bulletin
export interface MatiereBulletin {
  nom: string;
  note1?: number;
  note2?: number;
  composition?: number;
  coefficient: number;
  moyenne: number;
  appreciation: string;
}

// Interface pour un bulletin de semestre
export interface BulletinSemestre {
  moyenne: number;
  matieres: MatiereBulletin[];
}