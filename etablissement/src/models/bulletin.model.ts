import { Note } from './eleve.model';

export interface MatiereBulletin {
  id: number;
  nom: string;
  moyenne: number;
  coefficient: number;
  appreciation?: string;
}

export interface Bulletin {
  id: number;
  eleveId: number;
  anneeScolaireId: number;
  anneeScolaireNom?: string;
  semestre: number;
  moyenne: number;
  matieres: MatiereBulletin[];
  appreciation?: string;
  dateCreation: string;
  dateModification?: string;
  mention?: string;
  mentionCouleur?: string;
  reussi?: boolean;
  // Propriétés ajoutées dynamiquement par le backend
  notes?: Note[]; // Notes individuelles de l'élève pour ce bulletin
  moyenne_calculee?: number; // Moyenne calculée à partir des notes
}

export interface BulletinEleve {
  anneeScolaireId: number;
  anneeScolaireNom: string;
  statut: 'active' | 'terminee';
  bulletins: Bulletin[];
}

export interface BulletinResponse {
  success: boolean;
  message: string;
  data: Bulletin[] | Bulletin;
} 