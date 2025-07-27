// Modèle pour les règles de transfert automatique des élèves

export interface ReglesTransfert {
  id: number;
  moyenneMinimale: number;
  statutRequis: "inscrit" | "desinscrit" | "transfere" | "termine";
  transfertDirect: boolean; // Si true, 6ème A → 5ème A, sinon répartition équitable
  desactiverAnneeApresTransfert: boolean;
  actif: boolean;
  dateCreation: string;
  dateModification?: string;
  creePar: number; // ID de l'administrateur qui a créé ces règles
}

// Règles de transfert par défaut
export const reglesTransfertDefaut: ReglesTransfert = {
  id: 1,
  moyenneMinimale: 8,
  statutRequis: "inscrit",
  transfertDirect: true,
  desactiverAnneeApresTransfert: true,
  actif: true,
  dateCreation: new Date().toISOString(),
  creePar: 1 // ID de l'admin par défaut
};

// Mapping des niveaux pour les transferts
export const NIVEAUX_SUPERIEURS = {
  "6ème": "5ème",
  "5ème": "4ème", 
  "4ème": "3ème",
  "3ème": "2nde",
  "2nde": "1ère",
  "1ère": "Terminale"
} as const;

export type NiveauSuperieur = typeof NIVEAUX_SUPERIEURS[keyof typeof NIVEAUX_SUPERIEURS];

// Fonctions utilitaires pour les règles de transfert
export const getNiveauSuperieur = (niveauActuel: string): string | null => {
  return NIVEAUX_SUPERIEURS[niveauActuel as keyof typeof NIVEAUX_SUPERIEURS] || null;
};

export const estEligibleTransfert = (
  eleve: { moyenneAnnuelle: number; statut: string },
  regles: ReglesTransfert
): boolean => {
  return eleve.moyenneAnnuelle >= regles.moyenneMinimale && 
         eleve.statut === regles.statutRequis;
};

export const getClasseDestination = (
  classeSource: { nom: string; niveauNom: string },
  classesNiveauSuperieur: Array<{ nom: string; niveauNom: string }>,
  transfertDirect: boolean
): { nom: string; niveauNom: string } | null => {
  if (classesNiveauSuperieur.length === 0) return null;

  if (transfertDirect) {
    // Transfert direct : 6ème A → 5ème A
    const lettreClasse = classeSource.nom.split(' ').pop(); // Prend la dernière partie (A, B, etc.)
    return classesNiveauSuperieur.find(c => c.nom.includes(lettreClasse || '')) || classesNiveauSuperieur[0];
  } else {
    // Répartition équitable - retourne la première classe disponible
    return classesNiveauSuperieur[0];
  }
};

// Mock data pour les règles de transfert
export const reglesTransfertMock: ReglesTransfert[] = [
  {
    id: 1,
    moyenneMinimale: 8,
    statutRequis: "inscrit",
    transfertDirect: true,
    desactiverAnneeApresTransfert: true,
    actif: true,
    dateCreation: "2024-01-15T08:00:00Z",
    creePar: 1
  },
  {
    id: 2,
    moyenneMinimale: 10,
    statutRequis: "inscrit",
    transfertDirect: false,
    desactiverAnneeApresTransfert: false,
    actif: false,
    dateCreation: "2024-01-10T10:00:00Z",
    dateModification: "2024-01-12T14:30:00Z",
    creePar: 1
  }
]; 