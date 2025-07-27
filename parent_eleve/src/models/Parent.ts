import { Utilisateur } from "./Utilisateur";

export interface Parent extends Utilisateur {
  enfantsIds: string[];
  telephoneSecondaire?: string;
  adresseSecondaire?: string;
} 