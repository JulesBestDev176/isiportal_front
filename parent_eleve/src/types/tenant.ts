// Types pour la gestion multi-tenant d'un établissement scolaire SaaS

export interface ConfigurationEtablissement {
  nom: string;
  adresse: string;
  logo: string;
  couleurs: CouleursTheme;
  emailContact: string;
}

export interface CreationAdmin {
  email: string;
  motDePasse: string;
  prenom: string;
  nom: string;
}

export interface OptionsBranding {
  logo: string;
  couleurs: CouleursTheme;
  favicon: string;
}

export interface DetailsAbonnement {
  id: string;
  nom: string;
  fonctionnalites: string[];
  limites: LimitesAbonnement;
}

export interface OnboardingEcole {
  configurationInitiale: {
    infosEcole: ConfigurationEtablissement;
    admin: CreationAdmin;
    branding: OptionsBranding;
    abonnement: DetailsAbonnement;
  };
  premiereConnexion: {
    reinitialisationMotDePasse: boolean;
    etapesAssistant: EtapeAssistant[];
    configurationDomaine: string;
  };
}

export interface ConfigurationTenant {
  nom: string;
  idEcole: string;
  sousDomaine: string;
  domainePersonnalise?: string;
  branding: OptionsBranding;
  fonctionnalites: DrapeauxFonctionnalites;
  limites: LimitesAbonnement;
  emailContact: string;
}

export interface CouleursTheme {
  primaire: string;
  secondaire: string;
  fond: string;
  texte: string;
}

export interface DrapeauxFonctionnalites {
  [fonctionnalite: string]: boolean;
}

export interface LimitesAbonnement {
  utilisateurs: number;
  stockage: number; // en Mo
  [cle: string]: number;
}

export interface EtapeAssistant {
  etape: string;
  terminee: boolean;
} 