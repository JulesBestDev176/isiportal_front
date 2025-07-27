// Types pour la gestion de la communication et des notifications

export interface SystemeCommunication {
  hierarchie: HierarchieCommunication;
  canaux: CanauxCommunication;
  notifications: SystemeNotifications;
}

export interface HierarchieCommunication {
  superAdmin: CommunicationSuperAdmin;
  adminEcole: CommunicationAdminEcole;
  gestionnaires: CommunicationGestionnaire;
  professeurs: CommunicationProfesseur;
  eleves: CommunicationEleve;
  parents: CommunicationParent;
}

export interface CanauxCommunication {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  vocal: boolean;
  whatsapp: boolean;
}

export interface SystemeNotifications {
  canaux: CanauxCommunication;
  niveauxPriorite: NiveauxPrioriteNotification;
  personnalisationTenant: PersonnalisationNotificationTenant;
}

export interface NiveauxPrioriteNotification {
  urgence: boolean;
  urgent: boolean;
  normal: boolean;
  information: boolean;
}

export interface PersonnalisationNotificationTenant {
  branding: BrandingNotification;
  templates: TemplatesNotificationPersonnalises;
  langues: string[];
}

export interface BrandingNotification {
  logo: string;
  couleurs: Record<string, string>;
}

export interface TemplatesNotificationPersonnalises {
  [nomTemplate: string]: string;
}

// Exemples de types pour chaque rôle (simplifiés)
export interface CommunicationSuperAdmin {}
export interface CommunicationAdminEcole {}
export interface CommunicationGestionnaire {}
export interface CommunicationProfesseur {}
export interface CommunicationEleve {}
export interface CommunicationParent {} 