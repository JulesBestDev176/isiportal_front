// Modèles pour la gestion des utilisateurs

export interface HistoriqueConnexion {
  date: string;
  ip: string;
  navigateur?: string;
  succes: boolean;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string; // Pour l'envoi d'email de connexion
  role: "administrateur" | "gestionnaire" | "professeur" | "eleve" | "parent";
  type_parent?: "mere" | "pere" | "tuteur"; // Nouveau champ pour les parents
  dateCreation: string;
  dateModification?: string;
  actif: boolean;
  doitChangerMotDePasse: boolean; // Nouveau champ pour forcer le changement de mot de passe
  derniereConnexion?: string;
  telephone?: string;
  adresse?: string;
}

export interface Gestionnaire extends Utilisateur {
  role: "gestionnaire";
  sections: ("college" | "lycee")[];
}

export interface Professeur extends Utilisateur {
  role: "professeur";
  sections: ("college" | "lycee")[];
  matieres: number[]; // IDs des matières
  cours: number[]; // IDs des cours assignés (peut être vide)
}

export interface Administrateur extends Utilisateur {
  role: "administrateur";
  privileges: string[];
  historiqueConnexions: HistoriqueConnexion[];
  dernierAcces?: string;
  tentativesConnexionEchouees?: number;
  compteVerrouille?: boolean;
  dateVerrouillage?: string;
}

export interface Eleve extends Utilisateur {
  role: "eleve";
  classeId?: number;
  dateNaissance: string;
  lieuNaissance?: string;
  numeroEtudiant: string;
  parentsIds: number[];
}

export interface Parent extends Utilisateur {
  role: "parent";
  type_parent: "mere" | "pere" | "tuteur"; // Type de parent obligatoire
  enfantsIds: number[];
  telephone?: string;
  adresse?: string;
}

// Formulaires
export interface FormDataUtilisateur {
  nom: string;
  prenom: string;
  email: string;
  role: "administrateur" | "gestionnaire" | "professeur" | "eleve" | "parent";
  type_parent?: "mere" | "pere" | "tuteur"; // Type de parent pour les parents
  sections?: ("college" | "lycee")[];
  matieres?: number[];
  cours?: number[];
  niveauId?: number;
  classeId?: number;
  dateNaissance?: string;
  lieuNaissance?: string;
  numeroEtudiant?: string;
  parentsIds?: number[];
  enfantsIds?: number[];
  telephone?: string;
  adresse?: string;
  profession?: string;
}

// Constantes
export const SECTIONS = ["college", "lycee"] as const;

export const MATIERES_LIST = [
  "Mathématiques",
  "Français",
  "Histoire-Géographie",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Physique-Chimie",
  "Sciences de la Vie et de la Terre",
  "Éducation Physique et Sportive",
  "Arts Plastiques",
  "Éducation Musicale",
  "Technologie",
  "Philosophie",
  "Sciences Économiques et Sociales"
];

export const CLASSES_LIST = [
  // Collège
  "6ème", "5ème", "4ème", "3ème",
  // Lycée
  "2nde", "1ère", "Terminale"
];

export type RoleUtilisateur = Utilisateur["role"];
export type SectionType = typeof SECTIONS[number];

// Privilèges disponibles pour les administrateurs
export const PRIVILEGES_ADMIN = [
  'gestion_utilisateurs',
  'gestion_classes',
  'gestion_cours',
  'gestion_notes',
  'gestion_communications',
  'gestion_rapports',
  'gestion_systeme',
  'gestion_securite'
] as const;

export type PrivilegeAdmin = typeof PRIVILEGES_ADMIN[number];

// Constantes pour les rôles
export const ROLES_UTILISATEUR = [
  { value: "administrateur", label: "Administrateur" },
  { value: "gestionnaire", label: "Gestionnaire" },
  { value: "professeur", label: "Professeur" },
  { value: "eleve", label: "Élève" },
  { value: "parent", label: "Parent" }
] as const;

// Constantes pour les types de parents
export const TYPES_PARENT = [
  { value: "mere", label: "Mère" },
  { value: "pere", label: "Père" },
  { value: "tuteur", label: "Tuteur" }
] as const;

export type TypeParent = typeof TYPES_PARENT[number]["value"];

// Fonctions utilitaires
export const getRoleInfo = (role: RoleUtilisateur) => {
  return ROLES_UTILISATEUR.find(r => r.value === role);
};

export const getRoleColorClass = (role: RoleUtilisateur): string => {
  switch (role) {
    case "administrateur": return 'bg-red-100 text-red-800';
    case "gestionnaire": return 'bg-blue-100 text-blue-800';
    case "professeur": return 'bg-green-100 text-green-800';
    case "eleve": return 'bg-yellow-100 text-yellow-800';
    case "parent": return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatutColorClass = (actif: boolean): string => {
  return actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

// Interface pour les détails d'une note
export interface NoteDetails {
  note1?: number;
  note2?: number;
  composition?: number;
  coefficient: number;
  appreciation?: string;
}

// Interface pour les notes d'un semestre
export interface SemestreNotes {
  [matiere: string]: NoteDetails;
}

// Interface pour les notes d'une année
export interface AnneeNotes {
  [semestre: string]: SemestreNotes;
}

// Interface pour les notes d'un élève
export interface NotesEleve {
  [annee: string]: AnneeNotes;
}