// Types communs pour l'API

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface Message {
  id: number;
  expediteur_id: number;
  destinataire_id: number;
  sujet: string;
  contenu: string;
  lu: boolean;
  date_envoi: string;
  date_lecture?: string;
  expediteur?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  destinataire?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
}

export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: string;
  statut: string;
}

export interface Notification {
  id: number;
  user_id: number;
  titre: string;
  message: string;
  type: string;
  lu: boolean;
  date_creation: string;
  date_lecture?: string;
}

export interface NotificationLocale {
  id: string;
  titre: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duree?: number;
}

export interface ContactEtendu extends Contact {
  classe?: string;
  matieres?: string[];
  derniere_connexion?: string;
} 