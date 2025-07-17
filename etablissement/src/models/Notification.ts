// Modèle Notification pour le système de notifications

export interface Notification {
  id: string;
  utilisateurId: string;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  type: "info" | "alerte" | "urgence";
} 