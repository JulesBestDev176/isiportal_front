// Modèles pour les composants UI et interfaces

export interface MenuItem {
  titre: string;
  lien: string;
  icone: React.ReactNode;
  badge?: number;
  sousMenus?: MenuItem[];
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  menuItems: MenuItem[];
}

export interface HeaderProps {
  utilisateur: any;
  onToggleSidebar: () => void;
  notifications: NotificationHeader[];
}

export interface NotificationHeader {
  id: number;
  titre: string;
  message: string;
  lu: boolean;
  type: "info" | "alerte" | "urgence";
  date: string;
}

export interface PropsCarteTableauDeBord {
  titre: string;
  valeur: string | number;
  icone: React.ReactNode;
  couleur: string;
  tendance?: {
    valeur: number;
    type: "hausse" | "baisse" | "stable";
  };
  description?: string;
}

export interface Activity {
  id: string;
  type: "connexion" | "message" | "cours" | "note" | "absence";
  utilisateur: string;
  description: string;
  timestamp: string;
  icone: React.ReactNode;
  couleur: string;
}

export interface QuickAction {
  titre: string;
  description: string;
  icone: React.ReactNode;
  couleur: string;
  lien: string;
  badge?: number;
}

export interface RouteProtegeeProps {
  children: React.ReactNode;
  rolesAutorises?: string[];
  redirectTo?: string;
}

export interface ProfilData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance?: string;
  photo?: string;
}

export interface MotDePasseData {
  motDePasseActuel: string;
  nouveauMotDePasse: string;
  confirmerMotDePasse: string;
}

// Types pour les modals et formulaires
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// Constantes UI
export const COULEURS_BADGES = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-orange-100 text-orange-800",
  error: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-800"
} as const;

export const TAILLES_MODAL = {
  sm: "max-w-md",
  md: "max-w-lg", 
  lg: "max-w-2xl",
  xl: "max-w-4xl"
} as const;