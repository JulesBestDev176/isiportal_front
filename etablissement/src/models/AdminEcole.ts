import { Utilisateur } from "./Utilisateur";

export interface AdminEcole extends Utilisateur {
  privileges?: string[];
  historiqueConnexions?: Array<{ date: string; ip: string }>;
} 