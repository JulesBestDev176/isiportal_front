// Modèle Utilisateur pour tous les rôles (hors superAdmin)

export type RoleUtilisateur =
  | "adminEcole"
  | "gestionnaire"
  | "professeur"
  | "eleve"
  | "parent";

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: RoleUtilisateur;
  idTenant: string;
  actif: boolean;
  dateCreation: string;
  // Champs spécifiques pour les élèves
  dateNaissance?: string;
  classeId?: string;
  parentsIds?: string[];
  // Champs spécifiques pour les parents
  enfantsIds?: string[];
  // Champs spécifiques pour les professeurs
  matieres?: string[];
  // Champs spécifiques pour tous
  telephone?: string;
  adresse?: string;
} 