import { Utilisateur } from "./Utilisateur";

export interface Professeur extends Utilisateur {
  matieres: string[];
  classesIds: string[];
  telephonePro?: string;
  emailPro?: string;
} 