// Modèle Message pour la messagerie interne

export interface Message {
  id: string;
  expediteurId: string;
  destinataireId: string;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
  type: "texte" | "fichier" | "notification";
} 