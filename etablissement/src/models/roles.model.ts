// Modèles pour la gestion des rôles et permissions

export type Role = "administrateur" | "gestionnaire" | "professeur" | "eleve" | "parent";

export interface PermissionsParRole {
  administrateur: PermissionsAdministrateur;
  gestionnaire: PermissionsGestionnaire;
  professeur: PermissionsProfesseur;
}

export interface PermissionsAdministrateur {
  configurerEcole: boolean;
  gererUtilisateurs: boolean;
  personnaliserBranding: boolean;
  voirRapports: boolean;
  voirAnalytics: boolean;
}

export interface PermissionsGestionnaire {
  gererProfs: boolean;
  gererClasses: boolean;
  voirRapports: boolean;
  gererEmploiDuTemps: boolean;
  gererEvaluations: boolean;
}

export interface PermissionsProfesseur {
  gererNotes: boolean;
  communiquer: boolean;
  planifierCours: boolean;
  voirClasses: boolean;
  gererRessources: boolean;
}

export interface ConfigurationRole {
  role: Role;
  label: string;
  description: string;
  couleur: string;
  icone: string;
  permissions: string[];
  fonctionnalites: string[];
}

// Configuration des rôles
export const ROLES_CONFIG: Record<Role, ConfigurationRole> = {
  administrateur: {
    role: "administrateur",
    label: "Administrateur",
    description: "Gestion complète de l'établissement",
    couleur: "purple",
    icone: "Shield",
    permissions: [
      "configurerEcole",
      "gererUtilisateurs", 
      "personnaliserBranding",
      "voirRapports",
      "voirAnalytics"
    ],
    fonctionnalites: [
      "Configuration de l'établissement",
      "Gestion des utilisateurs",
      "Personnalisation du branding",
      "Accès aux rapports complets"
    ]
  },
  gestionnaire: {
    role: "gestionnaire",
    label: "Gestionnaire",
    description: "Gestion pédagogique et administrative",
    couleur: "blue",
    icone: "Users",
    permissions: [
      "gererProfs",
      "gererClasses",
      "voirRapports",
      "gererEmploiDuTemps",
      "gererEvaluations"
    ],
    fonctionnalites: [
      "Gestion des professeurs",
      "Gestion des classes",
      "Emplois du temps",
      "Suivi des évaluations",
      "Rapports pédagogiques"
    ]
  },
  professeur: {
    role: "professeur",
    label: "Professeur",
    description: "Enseignement et suivi pédagogique",
    couleur: "green",
    icone: "BookOpen",
    permissions: [
      "gererNotes",
      "communiquer",
      "planifierCours",
      "voirClasses",
      "gererRessources"
    ],
    fonctionnalites: [
      "Gestion des notes",
      "Communication",
      "Planification des cours",
      "Suivi des classes",
      "Gestion des ressources"
    ]
  },
  eleve: {
    role: "eleve",
    label: "Élève",
    description: "Consultation des résultats et ressources",
    couleur: "orange",
    icone: "GraduationCap",
    permissions: [
      "voirNotes",
      "voirEmploiDuTemps",
      "voirDevoirs",
      "communiquerProfs"
    ],
    fonctionnalites: [
      "Consultation des notes",
      "Emploi du temps",
      "Devoirs et ressources",
      "Communication avec les professeurs"
    ]
  },
  parent: {
    role: "parent",
    label: "Parent",
    description: "Suivi de la scolarité de l'enfant",
    couleur: "teal",
    icone: "Heart",
    permissions: [
      "voirNotesEnfant",
      "voirEmploiDuTempsEnfant",
      "communiquerEcole",
      "voirAbsences"
    ],
    fonctionnalites: [
      "Suivi des résultats de l'enfant",
      "Emploi du temps de l'enfant",
      "Communication avec l'école",
      "Suivi des absences"
    ]
  }
};

// Fonctions utilitaires
export const getAvailableRoles = (): Role[] => {
  return Object.keys(ROLES_CONFIG) as Role[];
};

export const getRoleLabel = (role: Role): string => {
  return ROLES_CONFIG[role]?.label || role;
};

export const getRolePermissions = (role: Role): string[] => {
  return ROLES_CONFIG[role]?.permissions || [];
};

export const hasPermission = (userRole: Role, permission: string): boolean => {
  return getRolePermissions(userRole).includes(permission);
};