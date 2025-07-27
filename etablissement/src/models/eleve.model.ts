// Modèle pour les élèves et leur historique dans les classes

export interface EleveClasse {
  id: number;
  nom: string;
  prenom: string;
  moyenneAnnuelle: number;
  statut: "inscrit" | "desinscrit" | "transfere" | "termine";
  dateInscription: string;
  dateSortie?: string;
  motifSortie?: string;
}

// Historique d'un élève dans une classe
export interface HistoriqueEleveClasse {
  id: number;
  eleveId: number;
  classeId: number;
  anneeScolaireId: number;
  anneeScolaireNom: string;
  statut: "inscrit" | "desinscrit" | "transfere" | "termine";
  dateInscription: string;
  dateSortie?: string;
  motifSortie?: string;
  moyenneAnnuelle?: number;
  notes?: {
    [matiere: string]: {
      note1?: number;
      note2?: number;
      composition?: number;
      coefficient: number;
      appreciation?: string;
    };
  };
  absences?: Array<{
    id: number;
    date: string;
    motif?: string;
    justifiee: boolean;
    matiere?: string;
    duree?: number;
  }>;
}

// Informations détaillées d'un élève
export interface DetailsEleve {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance?: string;
  numeroEtudiant: string;
  email: string;
  telephone?: string;
  adresse?: string;
  parentsIds: number[];
  historiqueClasses: HistoriqueEleveClasse[];
  informationsActuelles: {
    classeActuelle?: string;
    niveauActuel?: string;
    statutActuel: "inscrit" | "desinscrit" | "transfere" | "termine";
    moyenneActuelle?: number;
  };
}

export const STATUTS_ELEVE = [
  { value: "inscrit", label: "Inscrit", couleur: "green" },
  { value: "desinscrit", label: "Désinscrit", couleur: "red" },
  { value: "transfere", label: "Transféré", couleur: "blue" },
  { value: "termine", label: "Terminé", couleur: "gray" }
] as const;

export type StatutEleve = typeof STATUTS_ELEVE[number]["value"];

// Fonctions utilitaires
export const getElevesTransferables = (eleves: EleveClasse[]): EleveClasse[] => {
  return eleves.filter(eleve => 
    eleve.statut === "inscrit" && eleve.moyenneAnnuelle >= 8
  );
};

export const getStatutInfo = (statut: StatutEleve) => {
  return STATUTS_ELEVE.find(s => s.value === statut);
};

export const getMoyenneColorClass = (moyenne: number): string => {
  if (moyenne < 8) return 'bg-red-100 text-red-800';
  if (moyenne < 10) return 'bg-orange-100 text-orange-800';
  if (moyenne < 12) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}; 

// Interface pour un professeur de matière
export interface ProfMatiere {
  id: number;
  nom: string;
  prenom: string;
  matiere: string;
  email: string;
  telephone: string;
  photo?: string;
}

// Interface pour un étudiant
export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  telephone: string;
  email: string;
  classeId: number;
  classeNom: string;
  niveauNom: string;
  numeroEtudiant: string;
  statut: "actif" | "inactif" | "suspendu";
  dateInscription: string;
  moyenne: number;
  parentsIds: number[];
}

// Interface pour une note
export interface Note {
  id: number;
  eleveId: number;
  matiereId: number;
  matiereNom: string;
  type: "devoir" | "composition" | "examen";
  note: number;
  coefficient: number;
  date: string;
  appreciation?: string;
  remarques?: string;
} 