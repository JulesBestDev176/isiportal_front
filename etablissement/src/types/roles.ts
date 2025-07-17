// Types pour la gestion des rôles et permissions

export interface PermissionsParRole {
  superAdmin: PermissionsSuperAdmin;
  adminEcole: PermissionsAdminEcole;
  gestionnaire: PermissionsGestionnaire;
  professeur: PermissionsProfesseur;
  eleve: PermissionsEleve;
  parent: PermissionsParent;
}

export interface PermissionsSuperAdmin {
  gererEcoles: boolean;
  gererAbonnements: boolean;
  voirAnalytics: boolean;
  supportTechnique: boolean;
}

export interface PermissionsAdminEcole {
  configurerEcole: boolean;
  gererUtilisateurs: boolean;
  personnaliserBranding: boolean;
  voirRapports: boolean;
}

export interface PermissionsGestionnaire {
  gererProfs: boolean;
  gererEleves: boolean;
  gererParents: boolean;
  gererClasses: boolean;
}

export interface PermissionsProfesseur {
  gererNotes: boolean;
  suiviEleves: boolean;
  communiquer: boolean;
  planifierCours: boolean;
}

export interface PermissionsEleve {
  voirNotes: boolean;
  voirEmploiDuTemps: boolean;
  rendreDevoirs: boolean;
  communiquer: boolean;
}

export interface PermissionsParent {
  voirEnfants: boolean;
  communiquer: boolean;
  recevoirNotifications: boolean;
  prendreRendezVous: boolean;
} 