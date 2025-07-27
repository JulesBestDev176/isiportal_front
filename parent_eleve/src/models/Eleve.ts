import { Utilisateur } from "./Utilisateur";

export interface Eleve extends Utilisateur {
  dateNaissance: string;
  classeId: string;
  parentsIds: string[];
  dossierScolaire?: string;
  notes?: Record<string, number>;
  absences?: Array<{ date: string; motif: string }>;
} 