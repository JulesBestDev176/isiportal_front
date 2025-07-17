import { Utilisateur } from "./Utilisateur";

export interface Gestionnaire extends Utilisateur {
  departement?: string;
  responsabilites?: string[];
  section?: "primaire" | "elementaire" | "college" | "lycee" | "administration" | "vie_scolaire";
} 