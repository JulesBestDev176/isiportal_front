// Modèles pour la gestion de la communication et notifications

export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  role: "administrateur" | "gestionnaire" | "professeur" | "eleve" | "parent";
  email: string;
  avatar?: string;
  classe?: string;
  matiere?: string;
  sectionId?: number; // Pour les gestionnaires et professeurs
}

export interface Notification {
  id: number;
  titre: string;
  contenu: string;
  type: "info" | "urgent" | "evenement" | "rappel" | "absence" | "note" | "emploi_du_temps";
  expediteurId: number; // ID de l'expéditeur
  expediteurRole: "administrateur" | "gestionnaire" | "professeur";
  destinataireType: "role" | "individuel" | "classe" | "section";
  destinataires: number[]; // IDs des destinataires
  destinataireRoles?: ("professeur" | "gestionnaire" | "administrateur" | "eleve" | "parent")[];
  classeId?: number; // Si notification pour une classe spécifique
  sectionId?: number; // Si notification pour une section spécifique
  dateCreation: string;
  dateEnvoi?: string;
  programmee?: boolean;
  dateProgrammee?: string;
  active: boolean;
  nbDestinataires: number;
  nbLues: number;
  pieceJointe?: PieceJointe;
  priorite: "normale" | "haute" | "critique";
}

export interface PieceJointe {
  nom: string;
  url: string;
  type: string;
  taille?: number;
}

export interface NotificationLue {
  id: number;
  notificationId: number;
  utilisateurId: number;
  dateLecture: string;
}

// Règles de notification selon les rôles
export interface RegleNotification {
  expediteurRole: "administrateur" | "gestionnaire" | "professeur";
  destinatairesAutorises: ("administrateur" | "gestionnaire" | "professeur" | "eleve" | "parent")[];
  description: string;
}

// Constantes
export const TYPES_NOTIFICATION = [
  { value: "info", label: "Information", icone: "Info", couleur: "blue" },
  { value: "urgent", label: "Urgent", icone: "AlertCircle", couleur: "red" },
  { value: "evenement", label: "Événement", icone: "Calendar", couleur: "purple" },
  { value: "rappel", label: "Rappel", icone: "Clock", couleur: "orange" },
  { value: "absence", label: "Absence", icone: "UserX", couleur: "red" },
  { value: "note", label: "Note", icone: "FileText", couleur: "green" },
  { value: "emploi_du_temps", label: "Emploi du temps", icone: "Calendar", couleur: "blue" }
] as const;

export const PRIORITES_NOTIFICATION = [
  { value: "normale", label: "Normale", couleur: "gray" },
  { value: "haute", label: "Haute", couleur: "orange" },
  { value: "critique", label: "Critique", couleur: "red" }
] as const;

export const REGLES_NOTIFICATION: RegleNotification[] = [
  {
    expediteurRole: "administrateur",
    destinatairesAutorises: ["administrateur", "gestionnaire", "professeur", "eleve", "parent"],
    description: "L'administrateur peut notifier tous les utilisateurs"
  },
  {
    expediteurRole: "gestionnaire", 
    destinatairesAutorises: ["gestionnaire", "professeur", "eleve", "parent"],
    description: "Le gestionnaire peut notifier les professeurs, élèves et parents de sa section"
  },
  {
    expediteurRole: "professeur",
    destinatairesAutorises: ["gestionnaire", "eleve", "parent"],
    description: "Le professeur peut notifier les gestionnaires de sa section et les élèves/parents de ses classes"
  }
];

export type TypeNotification = typeof TYPES_NOTIFICATION[number]["value"];
export type PrioriteNotification = typeof PRIORITES_NOTIFICATION[number]["value"];