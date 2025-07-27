// Modèle Etablissement (tenant)

export interface Etablissement {
  id: string;
  nom: string;
  sousDomaine: string;
  domainePersonnalise?: string;
  logo: string;
  couleurs: {
    primaire: string;
    secondaire: string;
    fond: string;
    texte: string;
  };
  emailContact: string;
  actif: boolean;
  dateCreation: string;
} 