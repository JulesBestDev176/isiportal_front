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
  dateCreation: string;
  dateModification?: string;
  actif: boolean;
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
  sections?: ("college" | "lycee")[];
  matieres?: number[];
  cours?: number[];
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

// Mock data pour les administrateurs
export const administrateursMock: Administrateur[] = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@ecole.fr',
    role: 'administrateur',
    telephone: '01.23.45.67.89',
    adresse: '123 Rue de l\'École, 75001 Paris',
    dateCreation: '2023-01-15T08:00:00Z',
    actif: true,
    privileges: ['gestion_utilisateurs', 'gestion_classes', 'gestion_systeme'],
    historiqueConnexions: [
      {
        date: '2024-01-15T09:30:00Z',
        ip: '192.168.1.100',
        navigateur: 'Chrome 120.0',
        succes: true
      },
      {
        date: '2024-01-14T14:15:00Z',
        ip: '192.168.1.100',
        navigateur: 'Chrome 120.0',
        succes: true
      }
    ],
    dernierAcces: '2024-01-15T09:30:00Z',
    tentativesConnexionEchouees: 0,
    compteVerrouille: false
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@ecole.fr',
    role: 'administrateur',
    telephone: '01.98.76.54.32',
    adresse: '456 Avenue des Sciences, 69000 Lyon',
    dateCreation: '2023-02-20T10:00:00Z',
    actif: true,
    privileges: ['gestion_utilisateurs', 'gestion_notes', 'gestion_rapports'],
    historiqueConnexions: [
      {
        date: '2024-01-15T08:45:00Z',
        ip: '192.168.1.101',
        navigateur: 'Firefox 121.0',
        succes: true
      }
    ],
    dernierAcces: '2024-01-15T08:45:00Z',
    tentativesConnexionEchouees: 0,
    compteVerrouille: false
  }
];