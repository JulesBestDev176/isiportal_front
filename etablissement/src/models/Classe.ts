// Modèle Classe pour la gestion des classes

export interface ProfMatiere {
  matiere: string;
  professeurId: string;
}

export interface Classe {
  id: string;
  nom: string;
  niveau: string; // ex: CP, CE1, 6ème, 2nde
  anneeScolaire: string;
  effectif: number;
  etablissementId: string;
  // Pour primaire/élémentaire : un prof principal
  professeurPrincipalId?: string;
  // Pour collège/lycée : liste des profs par matière
  profsMatieres?: ProfMatiere[];
} 