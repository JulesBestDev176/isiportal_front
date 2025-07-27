import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit3, Trash2, Users, User, 
  School, Mail, Phone, MapPin, Calendar, GraduationCap,
  UserCheck, AlertCircle, CheckCircle, UserPlus, List, X,
  Baby, Heart, FileText, Eye, ChevronDown, BookOpen, Settings
} from "lucide-react";

// Interfaces TypeScript
import { Classe, ClasseAnneeScolaire, ProfMatiere } from '../../models/classe.model';
import { AnneeScolaire } from '../../models/annee-scolaire.model';
import { EleveClasse } from '../../models/eleve.model';
import { ReglesTransfert, NIVEAUX_SUPERIEURS, reglesTransfertDefaut, getNiveauSuperieur, estEligibleTransfert, getClasseDestination } from '../../models/regles-transfert.model';

interface FormDataClasse {
  nom: string;
  niveauId: string;
  effectifMax: number;
  description: string;
  professeurPrincipalId: string;
  statut: string;
}

interface Errors {
  nom?: string;
  niveauId?: string;
  effectifMax?: string;
}

// Mock data - remplacez par vos vrais modèles
const anneesScolairesMock: AnneeScolaire[] = [
  {
    id: 1,
    nom: "2023-2024",
    anneeDebut: 2023,
    anneeFin: 2024,
    dateDebut: "2023-09-01",
    dateFin: "2024-07-31",
    statut: "active",
    description: "Année scolaire 2023-2024",
    dateCreation: "2023-06-01",
    dateModification: "2023-09-01"
  },
  {
    id: 2,
    nom: "2022-2023",
    anneeDebut: 2022,
    anneeFin: 2023,
    dateDebut: "2022-09-01",
    dateFin: "2023-07-31",
    statut: "terminee",
    description: "Année scolaire 2022-2023",
    dateCreation: "2022-06-01",
    dateModification: "2023-07-31"
  },
  {
    id: 3,
    nom: "2024-2025",
    anneeDebut: 2024,
    anneeFin: 2025,
    dateDebut: "2024-09-01",
    dateFin: "2025-07-31",
    statut: "planifiee",
    description: "Année scolaire 2024-2025",
    dateCreation: "2024-06-01"
  },
  {
    id: 4,
    nom: "2025-2026",
    anneeDebut: 2025,
    anneeFin: 2026,
    dateDebut: "2025-09-01",
    dateFin: "2026-07-31",
    statut: "planifiee",
    description: "Année scolaire 2025-2026",
    dateCreation: "2025-06-01"
  },
  {
    id: 5,
    nom: "2026-2027",
    anneeDebut: 2026,
    anneeFin: 2027,
    dateDebut: "2026-09-01",
    dateFin: "2027-07-31",
    statut: "planifiee",
    description: "Année scolaire 2026-2027",
    dateCreation: "2026-06-01"
  },
  {
    id: 6,
    nom: "2027-2028",
    anneeDebut: 2027,
    anneeFin: 2028,
    dateDebut: "2027-09-01",
    dateFin: "2028-07-31",
    statut: "planifiee",
    description: "Année scolaire 2027-2028",
    dateCreation: "2027-06-01"
  },
  {
    id: 7,
    nom: "2028-2029",
    anneeDebut: 2028,
    anneeFin: 2029,
    dateDebut: "2028-09-01",
    dateFin: "2029-07-31",
    statut: "planifiee",
    description: "Année scolaire 2028-2029",
    dateCreation: "2028-06-01"
  },
  {
    id: 8,
    nom: "2029-2030",
    anneeDebut: 2029,
    anneeFin: 2030,
    dateDebut: "2029-09-01",
    dateFin: "2030-07-31",
    statut: "planifiee",
    description: "Année scolaire 2029-2030",
    dateCreation: "2029-06-01"
  },
  {
    id: 9,
    nom: "2030-2031",
    anneeDebut: 2030,
    anneeFin: 2031,
    dateDebut: "2030-09-01",
    dateFin: "2031-07-31",
    statut: "planifiee",
    description: "Année scolaire 2030-2031",
    dateCreation: "2030-06-01"
  },
  {
    id: 10,
    nom: "2031-2032",
    anneeDebut: 2031,
    anneeFin: 2032,
    dateDebut: "2031-09-01",
    dateFin: "2032-07-31",
    statut: "planifiee",
    description: "Année scolaire 2031-2032",
    dateCreation: "2031-06-01"
  },
  {
    id: 11,
    nom: "2032-2033",
    anneeDebut: 2032,
    anneeFin: 2033,
    dateDebut: "2032-09-01",
    dateFin: "2033-07-31",
    statut: "planifiee",
    description: "Année scolaire 2032-2033",
    dateCreation: "2032-06-01"
  }
];

const classesMock: Classe[] = [
  {
    id: 1,
    nom: "6ème A",
    niveauId: 1,
    niveauNom: "6ème",
    anneesScolaires: [
      {
        id: 1,
        classeId: 1,
        anneeScolaireId: 1,
        anneeScolaireNom: "2023-2024",
        elevesIds: [1, 2, 3, 4, 5],
        effectif: 25,
        effectifMax: 30,
        professeurPrincipalId: 1,
        professeurPrincipalNom: "Mme Diallo",
        profsMatieres: [
          { matiere: "Mathématiques", professeurId: 1, professeurNom: "M. Fall", heuresParSemaine: 6 },
          { matiere: "Français", professeurId: 2, professeurNom: "Mme Ndiaye", heuresParSemaine: 5 },
          { matiere: "Histoire-Géo", professeurId: 3, professeurNom: "M. Sow", heuresParSemaine: 4 }
        ],
        description: "Classe de 6ème section générale",
        statut: "active",
        dateCreation: "2024-09-01"
      },
      {
        id: 2,
        classeId: 1,
        anneeScolaireId: 2,
        anneeScolaireNom: "2022-2023",
        elevesIds: [11, 12, 13, 14, 15, 16],
        effectif: 28,
        effectifMax: 30,
        professeurPrincipalId: 1,
        professeurPrincipalNom: "Mme Diallo",
        profsMatieres: [
          { matiere: "Mathématiques", professeurId: 1, professeurNom: "M. Fall", heuresParSemaine: 6 },
          { matiere: "Français", professeurId: 2, professeurNom: "Mme Ndiaye", heuresParSemaine: 5 },
          { matiere: "Histoire-Géo", professeurId: 3, professeurNom: "M. Sow", heuresParSemaine: 4 }
        ],
        description: "Classe de 6ème section générale",
        statut: "inactive",
        dateCreation: "2022-09-01"
      }
    ],
    description: "Classe de 6ème section générale",
    dateCreation: "2024-09-01",
    statut: "active"
  },
  {
    id: 2,
    nom: "5ème B",
    niveauId: 2,
    niveauNom: "5ème",
    anneesScolaires: [
      {
        id: 2,
        classeId: 2,
    anneeScolaireId: 1,
        anneeScolaireNom: "2023-2024",
    elevesIds: [6, 7, 8, 9, 10, 11, 12],
    effectif: 28,
    effectifMax: 30,
    professeurPrincipalId: 2,
    professeurPrincipalNom: "M. Sarr",
    profsMatieres: [
      { matiere: "Mathématiques", professeurId: 1, professeurNom: "M. Fall", heuresParSemaine: 5 },
      { matiere: "Physique-Chimie", professeurId: 4, professeurNom: "Mme Ba", heuresParSemaine: 3 },
      { matiere: "SVT", professeurId: 5, professeurNom: "M. Diouf", heuresParSemaine: 3 }
        ],
        description: "Classe de 5ème section scientifique",
        statut: "active",
        dateCreation: "2024-09-01"
      }
    ],
    description: "Classe de 5ème section scientifique",
    dateCreation: "2024-09-01",
    statut: "active"
  },
  {
    id: 3,
    nom: "3ème C",
    niveauId: 4,
    niveauNom: "3ème",
    anneesScolaires: [
      {
        id: 3,
        classeId: 3,
    anneeScolaireId: 1,
        anneeScolaireNom: "2023-2024",
    elevesIds: [13, 14, 15],
    effectif: 15,
    effectifMax: 25,
    professeurPrincipalId: 3,
    professeurPrincipalNom: "Mme Cissé",
    profsMatieres: [
      { matiere: "Mathématiques", professeurId: 1, professeurNom: "M. Fall", heuresParSemaine: 4 },
      { matiere: "Français", professeurId: 2, professeurNom: "Mme Ndiaye", heuresParSemaine: 4 }
        ],
        description: "Classe de 3ème préparation BFEM",
        statut: "inactive",
        dateCreation: "2024-09-01"
      }
    ],
    description: "Classe de 3ème préparation BFEM",
    dateCreation: "2024-09-01",
    statut: "inactive"
  },
  {
    id: 4,
    nom: "2nde A",
    niveauId: 5,
    niveauNom: "2nde",
    anneesScolaires: [
      {
        id: 4,
        classeId: 4,
        anneeScolaireId: 1,
        anneeScolaireNom: "2023-2024",
        elevesIds: [],
        effectif: 0,
        effectifMax: 35,
        professeurPrincipalId: 4,
        professeurPrincipalNom: "M. Traoré",
        profsMatieres: [
          { matiere: "Mathématiques", professeurId: 1, professeurNom: "M. Fall", heuresParSemaine: 4 },
          { matiere: "Français", professeurId: 2, professeurNom: "Mme Ndiaye", heuresParSemaine: 4 },
          { matiere: "Histoire-Géo", professeurId: 3, professeurNom: "M. Sow", heuresParSemaine: 3 }
        ],
        description: "Classe de 2nde générale",
        statut: "active",
        dateCreation: "2024-09-01"
      }
    ],
    description: "Classe de 2nde générale",
    dateCreation: "2024-09-01",
    statut: "active"
  }
];

// Données mock pour l'historique des élèves (années précédentes)
const historiqueElevesMock: { [classeId: number]: { [anneeScolaireId: number]: EleveClasse[] } } = {
  1: { // Classe 6ème A
    1: [ // 2023-2024 (année actuelle)
      { id: 1, nom: "Diop", prenom: "Fatou", moyenneAnnuelle: 14.5, statut: "inscrit", dateInscription: "2023-09-01" },
      { id: 2, nom: "Sow", prenom: "Moussa", moyenneAnnuelle: 12.8, statut: "inscrit", dateInscription: "2023-09-01" },
      { id: 3, nom: "Ndiaye", prenom: "Aissatou", moyenneAnnuelle: 16.2, statut: "inscrit", dateInscription: "2023-09-01" },
      { id: 4, nom: "Fall", prenom: "Omar", moyenneAnnuelle: 7.5, statut: "inscrit", dateInscription: "2023-09-01" },
      { id: 5, nom: "Diallo", prenom: "Mariama", moyenneAnnuelle: 9.3, statut: "inscrit", dateInscription: "2023-09-01" }
    ],
    2: [ // 2022-2023 (année précédente)
      { id: 11, nom: "Camara", prenom: "Aissatou", moyenneAnnuelle: 15.2, statut: "transfere", dateInscription: "2022-09-01", dateSortie: "2023-07-31", motifSortie: "Passage en 5ème" },
      { id: 12, nom: "Diagne", prenom: "Moussa", moyenneAnnuelle: 13.8, statut: "transfere", dateInscription: "2022-09-01", dateSortie: "2023-07-31", motifSortie: "Passage en 5ème" },
      { id: 13, nom: "Faye", prenom: "Omar", moyenneAnnuelle: 8.5, statut: "transfere", dateInscription: "2022-09-01", dateSortie: "2023-07-31", motifSortie: "Passage en 5ème" },
      { id: 14, nom: "Gueye", prenom: "Fatou", moyenneAnnuelle: 11.7, statut: "transfere", dateInscription: "2022-09-01", dateSortie: "2023-07-31", motifSortie: "Passage en 5ème" },
      { id: 15, nom: "Kane", prenom: "Ibrahim", moyenneAnnuelle: 9.8, statut: "transfere", dateInscription: "2022-09-01", dateSortie: "2023-07-31", motifSortie: "Passage en 5ème" },
      { id: 16, nom: "Mbaye", prenom: "Aminata", moyenneAnnuelle: 12.3, statut: "transfere", dateInscription: "2022-09-01", dateSortie: "2023-07-31", motifSortie: "Passage en 5ème" }
    ]
  },
  2: { // Classe 5ème B
    1: [ // 2023-2024 (année actuelle)
      { id: 6, nom: "Ba", prenom: "Aminata", moyenneAnnuelle: 8.5, statut: "inscrit", dateInscription: "2023-09-01" },
      { id: 7, nom: "Cissé", prenom: "Ibrahim", moyenneAnnuelle: 11.2, statut: "inscrit", dateInscription: "2023-09-01" },
      { id: 8, nom: "Traoré", prenom: "Fatoumata", moyenneAnnuelle: 13.7, statut: "inscrit", dateInscription: "2023-09-01" },
      { id: 9, nom: "Koné", prenom: "Mamadou", moyenneAnnuelle: 6.8, statut: "inscrit", dateInscription: "2023-09-01" },
      { id: 10, nom: "Sy", prenom: "Awa", moyenneAnnuelle: 15.1, statut: "inscrit", dateInscription: "2023-09-01" }
    ]
  }
};

// Données mock pour les bulletins des élèves
interface MatiereBulletin {
  nom: string;
  note1?: number;
  note2?: number;
  composition?: number;
  coefficient: number;
  moyenne: number;
  appreciation: string;
}

interface BulletinSemestre {
  moyenne: number;
  matieres: MatiereBulletin[];
}

const bulletinsMock: { [eleveId: number]: { [anneeScolaireId: number]: { [semestre: string]: BulletinSemestre } } } = {
  1: { // Élève Fatou Diop
    1: { // Année 2023-2024
      "Semestre 1": {
        moyenne: 14.5,
        matieres: [
          { nom: "Mathématiques", note1: 15, note2: 16, composition: 14, coefficient: 4, moyenne: 15.0, appreciation: "Très bon travail" },
          { nom: "Français", note1: 13, note2: 14, composition: 12, coefficient: 3, moyenne: 13.0, appreciation: "Bon niveau" },
          { nom: "Histoire-Géo", note1: 16, note2: 15, composition: 17, coefficient: 2, moyenne: 16.0, appreciation: "Excellent" },
          { nom: "Anglais", note1: 14, note2: 15, composition: 13, coefficient: 2, moyenne: 14.0, appreciation: "Bon niveau" },
          { nom: "SVT", note1: 15, note2: 16, composition: 14, coefficient: 2, moyenne: 15.0, appreciation: "Très bien" }
        ]
      },
      "Semestre 2": {
        moyenne: 14.8,
        matieres: [
          { nom: "Mathématiques", note1: 16, note2: 15, composition: 17, coefficient: 4, moyenne: 16.0, appreciation: "Excellent travail" },
          { nom: "Français", note1: 14, note2: 15, composition: 13, coefficient: 3, moyenne: 14.0, appreciation: "Bon niveau" },
          { nom: "Histoire-Géo", note1: 15, note2: 16, composition: 14, coefficient: 2, moyenne: 15.0, appreciation: "Très bien" },
          { nom: "Anglais", note1: 15, note2: 14, composition: 16, coefficient: 2, moyenne: 15.0, appreciation: "Bon niveau" },
          { nom: "SVT", note1: 16, note2: 15, composition: 17, coefficient: 2, moyenne: 16.0, appreciation: "Excellent" }
        ]
      }
    }
  },
  2: { // Élève Moussa Sow
    1: { // Année 2023-2024
      "Semestre 1": {
        moyenne: 12.8,
        matieres: [
          { nom: "Mathématiques", note1: 12, note2: 13, composition: 11, coefficient: 4, moyenne: 12.0, appreciation: "Bon travail" },
          { nom: "Français", note1: 13, note2: 12, composition: 14, coefficient: 3, moyenne: 13.0, appreciation: "Niveau correct" },
          { nom: "Histoire-Géo", note1: 14, note2: 13, composition: 15, coefficient: 2, moyenne: 14.0, appreciation: "Bon niveau" },
          { nom: "Anglais", note1: 11, note2: 12, composition: 13, coefficient: 2, moyenne: 12.0, appreciation: "Peut mieux faire" },
          { nom: "SVT", note1: 13, note2: 14, composition: 12, coefficient: 2, moyenne: 13.0, appreciation: "Bon travail" }
        ]
      },
      "Semestre 2": {
        moyenne: 13.2,
        matieres: [
          { nom: "Mathématiques", note1: 13, note2: 14, composition: 12, coefficient: 4, moyenne: 13.0, appreciation: "Progrès notables" },
          { nom: "Français", note1: 14, note2: 13, composition: 15, coefficient: 3, moyenne: 14.0, appreciation: "Bon niveau" },
          { nom: "Histoire-Géo", note1: 13, note2: 14, composition: 12, coefficient: 2, moyenne: 13.0, appreciation: "Niveau correct" },
          { nom: "Anglais", note1: 12, note2: 13, composition: 14, coefficient: 2, moyenne: 13.0, appreciation: "Amélioration" },
          { nom: "SVT", note1: 14, note2: 13, composition: 15, coefficient: 2, moyenne: 14.0, appreciation: "Bon travail" }
        ]
      }
    }
  },
  // Bulletins pour les élèves de l'historique (2022-2023)
  11: { // Élève Aissatou Camara (historique)
    2: { // Année 2022-2023
      "Semestre 1": {
        moyenne: 15.2,
        matieres: [
          { nom: "Mathématiques", note1: 16, note2: 15, composition: 17, coefficient: 4, moyenne: 16.0, appreciation: "Excellent travail" },
          { nom: "Français", note1: 14, note2: 15, composition: 13, coefficient: 3, moyenne: 14.0, appreciation: "Très bon niveau" },
          { nom: "Histoire-Géo", note1: 17, note2: 16, composition: 18, coefficient: 2, moyenne: 17.0, appreciation: "Excellent" },
          { nom: "Anglais", note1: 15, note2: 16, composition: 14, coefficient: 2, moyenne: 15.0, appreciation: "Très bien" },
          { nom: "SVT", note1: 16, note2: 15, composition: 17, coefficient: 2, moyenne: 16.0, appreciation: "Excellent" }
        ]
      },
      "Semestre 2": {
        moyenne: 15.8,
        matieres: [
          { nom: "Mathématiques", note1: 17, note2: 16, composition: 18, coefficient: 4, moyenne: 17.0, appreciation: "Excellent travail" },
          { nom: "Français", note1: 15, note2: 16, composition: 14, coefficient: 3, moyenne: 15.0, appreciation: "Très bon niveau" },
          { nom: "Histoire-Géo", note1: 16, note2: 17, composition: 15, coefficient: 2, moyenne: 16.0, appreciation: "Excellent" },
          { nom: "Anglais", note1: 16, note2: 15, composition: 17, coefficient: 2, moyenne: 16.0, appreciation: "Très bien" },
          { nom: "SVT", note1: 17, note2: 16, composition: 18, coefficient: 2, moyenne: 17.0, appreciation: "Excellent" }
        ]
      }
    }
  },
  12: { // Élève Moussa Diagne (historique)
    2: { // Année 2022-2023
      "Semestre 1": {
        moyenne: 13.8,
        matieres: [
          { nom: "Mathématiques", note1: 14, note2: 13, composition: 15, coefficient: 4, moyenne: 14.0, appreciation: "Bon travail" },
          { nom: "Français", note1: 13, note2: 14, composition: 12, coefficient: 3, moyenne: 13.0, appreciation: "Niveau correct" },
          { nom: "Histoire-Géo", note1: 15, note2: 14, composition: 16, coefficient: 2, moyenne: 15.0, appreciation: "Très bien" },
          { nom: "Anglais", note1: 12, note2: 13, composition: 14, coefficient: 2, moyenne: 13.0, appreciation: "Bon niveau" },
          { nom: "SVT", note1: 14, note2: 15, composition: 13, coefficient: 2, moyenne: 14.0, appreciation: "Bon travail" }
        ]
      },
      "Semestre 2": {
        moyenne: 14.2,
        matieres: [
          { nom: "Mathématiques", note1: 15, note2: 14, composition: 16, coefficient: 4, moyenne: 15.0, appreciation: "Progrès notables" },
          { nom: "Français", note1: 14, note2: 15, composition: 13, coefficient: 3, moyenne: 14.0, appreciation: "Bon niveau" },
          { nom: "Histoire-Géo", note1: 14, note2: 15, composition: 13, coefficient: 2, moyenne: 14.0, appreciation: "Très bien" },
          { nom: "Anglais", note1: 13, note2: 14, composition: 15, coefficient: 2, moyenne: 14.0, appreciation: "Amélioration" },
          { nom: "SVT", note1: 15, note2: 14, composition: 16, coefficient: 2, moyenne: 15.0, appreciation: "Bon travail" }
        ]
      }
    }
  },
  13: { // Élève Omar Faye (historique)
    2: { // Année 2022-2023
      "Semestre 1": {
        moyenne: 8.5,
        matieres: [
          { nom: "Mathématiques", note1: 7, note2: 8, composition: 6, coefficient: 4, moyenne: 7.0, appreciation: "Doit travailler davantage" },
          { nom: "Français", note1: 9, note2: 8, composition: 10, coefficient: 3, moyenne: 9.0, appreciation: "Niveau fragile" },
          { nom: "Histoire-Géo", note1: 10, note2: 9, composition: 11, coefficient: 2, moyenne: 10.0, appreciation: "Peut mieux faire" },
          { nom: "Anglais", note1: 8, note2: 9, composition: 7, coefficient: 2, moyenne: 8.0, appreciation: "Doit s'améliorer" },
          { nom: "SVT", note1: 9, note2: 8, composition: 10, coefficient: 2, moyenne: 9.0, appreciation: "Niveau fragile" }
        ]
      },
      "Semestre 2": {
        moyenne: 9.2,
        matieres: [
          { nom: "Mathématiques", note1: 8, note2: 9, composition: 7, coefficient: 4, moyenne: 8.0, appreciation: "Légère amélioration" },
          { nom: "Français", note1: 10, note2: 9, composition: 11, coefficient: 3, moyenne: 10.0, appreciation: "Progrès" },
          { nom: "Histoire-Géo", note1: 9, note2: 10, composition: 8, coefficient: 2, moyenne: 9.0, appreciation: "Peut mieux faire" },
          { nom: "Anglais", note1: 9, note2: 8, composition: 10, coefficient: 2, moyenne: 9.0, appreciation: "Amélioration" },
          { nom: "SVT", note1: 10, note2: 9, composition: 11, coefficient: 2, moyenne: 10.0, appreciation: "Progrès" }
        ]
      }
    }
  }
};

const STATUTS_CLASSE = [
  { value: "active", label: "Active", couleur: "green" },
  { value: "inactive", label: "Inactive", couleur: "orange" },
  { value: "archivee", label: "Archivée", couleur: "gray" }
];

// Composant Modal
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: string; // Added size prop
}> = ({ isOpen, onClose, title, children, size }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${size || ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Composant formulaire classe
const FormulaireClasse: React.FC<{
  onSubmit: (classe: any) => void;
  onClose: () => void;
  classeAModifier?: Classe;
  modeEdition?: boolean;
}> = ({ onSubmit, onClose, classeAModifier, modeEdition = false }) => {
  const [formData, setFormData] = useState<FormDataClasse>({
    nom: classeAModifier?.nom || "",
    niveauId: classeAModifier?.niveauId?.toString() || "",
    effectifMax: 30, // Valeur par défaut
    description: classeAModifier?.description || "",
    professeurPrincipalId: "", // À gérer avec le nouveau modèle
    statut: classeAModifier?.statut || "active"
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const niveaux = [
    { id: 1, nom: "6ème" },
    { id: 2, nom: "5ème" },
    { id: 3, nom: "4ème" },
    { id: 4, nom: "3ème" },
    { id: 5, nom: "2nde" },
    { id: 6, nom: "1ère" },
    { id: 7, nom: "Terminale" }
  ];

  const professeurs = [
    { id: 1, nom: "Mme Diallo" },
    { id: 2, nom: "M. Sarr" },
    { id: 3, nom: "Mme Cissé" },
    { id: 4, nom: "M. Fall" },
    { id: 5, nom: "Mme Ndiaye" }
  ];

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom de la classe est requis";
    if (!formData.niveauId) newErrors.niveauId = "Le niveau est requis";
    if (!formData.effectifMax || formData.effectifMax < 1) newErrors.effectifMax = "L'effectif maximum doit être supérieur à 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Créer une année scolaire pour la classe
    const anneeScolaire: ClasseAnneeScolaire = {
      id: Date.now(),
      classeId: modeEdition && classeAModifier ? classeAModifier.id : Date.now(),
      anneeScolaireId: 1,
      anneeScolaireNom: "2023-2024",
      elevesIds: [],
      effectif: 0,
      effectifMax: formData.effectifMax,
      professeurPrincipalId: formData.professeurPrincipalId ? parseInt(formData.professeurPrincipalId) : undefined,
      professeurPrincipalNom: professeurs.find(p => p.id === parseInt(formData.professeurPrincipalId))?.nom,
      profsMatieres: [],
      description: formData.description,
      statut: formData.statut as "active" | "inactive" | "archivee",
      dateCreation: new Date().toISOString().split('T')[0]
    };

    const nouvelleClasse: Classe = {
      id: modeEdition && classeAModifier ? classeAModifier.id : Date.now(),
      nom: formData.nom,
      niveauId: parseInt(formData.niveauId),
      niveauNom: niveaux.find(n => n.id === parseInt(formData.niveauId))?.nom || "",
      anneesScolaires: [anneeScolaire],
      description: formData.description,
      dateCreation: modeEdition && classeAModifier ? classeAModifier.dateCreation : new Date().toISOString().split('T')[0],
      dateModification: modeEdition ? new Date().toISOString().split('T')[0] : undefined,
      statut: formData.statut as "active" | "inactive" | "archivee"
    };

    onSubmit(nouvelleClasse);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
          <School className="w-5 h-5" />
          Informations de la classe
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nom de la classe *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nom ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Ex: 6ème A, 1ère S1"
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Niveau *
            </label>
            <select
              value={formData.niveauId}
              onChange={(e) => setFormData({...formData, niveauId: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.niveauId ? 'border-red-500' : 'border-neutral-300'
              }`}
            >
              <option value="">Sélectionner un niveau</option>
              {niveaux.map(niveau => (
                <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
              ))}
            </select>
            {errors.niveauId && <p className="text-red-500 text-sm mt-1">{errors.niveauId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Effectif maximum *
            </label>
            <input
              type="number"
              min="1"
              value={formData.effectifMax}
              onChange={(e) => setFormData({...formData, effectifMax: parseInt(e.target.value)})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.effectifMax ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.effectifMax && <p className="text-red-500 text-sm mt-1">{errors.effectifMax}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Professeur principal
            </label>
            <select
              value={formData.professeurPrincipalId}
              onChange={(e) => setFormData({...formData, professeurPrincipalId: e.target.value})}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un professeur</option>
              {professeurs.map(prof => (
                <option key={prof.id} value={prof.id}>{prof.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Statut
          </label>
          <select
            value={formData.statut}
            onChange={(e) => setFormData({...formData, statut: e.target.value})}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUTS_CLASSE.map(statut => (
              <option key={statut.value} value={statut.value}>{statut.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description de la classe (optionnel)"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {modeEdition ? "Modification..." : "Création..."}
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              {modeEdition ? "Modifier" : "Créer"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const Classes = () => {
  const [classes, setClasses] = useState(classesMock);
  const [filteredClasses, setFilteredClasses] = useState(classesMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [activeTab, setActiveTab] = useState<"liste" | "ajout">("liste");
  const [modeEdition, setModeEdition] = useState(false);
  const [classeAModifier, setClasseAModifier] = useState<Classe | null>(null);
  const [classeDetails, setClasseDetails] = useState<Classe | null>(null);

  // Données mock pour les élèves
  const elevesMock: EleveClasse[] = [
    {
      id: 1,
      nom: "Diop",
      prenom: "Fatou",
      moyenneAnnuelle: 14.5,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 2,
      nom: "Sow",
      prenom: "Moussa",
      moyenneAnnuelle: 12.8,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 3,
      nom: "Ndiaye",
      prenom: "Aissatou",
      moyenneAnnuelle: 16.2,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 4,
      nom: "Fall",
      prenom: "Omar",
      moyenneAnnuelle: 7.5,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 5,
      nom: "Diallo",
      prenom: "Mariama",
      moyenneAnnuelle: 9.3,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 6,
      nom: "Ba",
      prenom: "Aminata",
      moyenneAnnuelle: 8.5,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 7,
      nom: "Cissé",
      prenom: "Ibrahim",
      moyenneAnnuelle: 11.2,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 8,
      nom: "Traoré",
      prenom: "Fatoumata",
      moyenneAnnuelle: 13.7,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 9,
      nom: "Koné",
      prenom: "Mamadou",
      moyenneAnnuelle: 6.8,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    },
    {
      id: 10,
      nom: "Sy",
      prenom: "Awa",
      moyenneAnnuelle: 15.1,
      statut: "inscrit",
      dateInscription: "2023-09-01"
    }
  ];

  const [elevesATransferer, setElevesATransferer] = useState<EleveClasse[]>([]);
  const [classeSource, setClasseSource] = useState<Classe | null>(null);

  // Fonctions utilitaires pour accéder aux données du nouveau modèle
  const getClasseAnneeActuelle = (classe: Classe) => {
    return classe.anneesScolaires.find(annee => annee.anneeScolaireId === 1); // Année actuelle
  };

  const getEffectifClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.effectif || 0;
  };

  const getEffectifMaxClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.effectifMax || 30;
  };

  const getProfesseurPrincipalClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.professeurPrincipalNom;
  };

  const getProfsMatieresClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.profsMatieres || [];
  };

  useEffect(() => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(classe => 
        classe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.niveauNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProfesseurPrincipalClasse(classe)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatut !== "all") {
      filtered = filtered.filter(classe => classe.statut === filterStatut);
    }

    setFilteredClasses(filtered);
  }, [classes, searchTerm, filterStatut]);

  const ajouterClasse = (nouvelleClasse: any) => {
    if (modeEdition) {
      setClasses(prev => prev.map(c => c.id === nouvelleClasse.id ? nouvelleClasse : c));
    } else {
      setClasses(prev => [...prev, nouvelleClasse]);
    }
    setActiveTab("liste");
    setModeEdition(false);
    setClasseAModifier(null);
  };

  const ajouterAnneeScolaire = (classeId: number, anneeScolaire: AnneeScolaire) => {
    setClasses(prev => prev.map(classe => {
      if (classe.id === classeId) {
        const nouvelleAnnee: ClasseAnneeScolaire = {
          id: Date.now(),
          classeId: classeId,
          anneeScolaireId: anneeScolaire.id,
          anneeScolaireNom: anneeScolaire.nom,
          elevesIds: [],
          effectif: 0,
          effectifMax: 30,
          profsMatieres: [],
          description: `Année scolaire ${anneeScolaire.nom}`,
          statut: "inactive",
          dateCreation: new Date().toISOString().split('T')[0]
        };
        
        return {
          ...classe,
          anneesScolaires: [...classe.anneesScolaires, nouvelleAnnee]
        };
      }
      return classe;
    }));
  };

  // Données mock pour les niveaux supérieurs
  const niveauxSuperieurs = NIVEAUX_SUPERIEURS;

  // Règles de transfert configurables (seulement pour admin)
  const [reglesTransfert, setReglesTransfert] = useState<ReglesTransfert>(reglesTransfertDefaut);

  // États pour les modals
  const [modalTransfert, setModalTransfert] = useState(false);
  const [modalReglesTransfert, setModalReglesTransfert] = useState(false);
  const [modalDetailsEleve, setModalDetailsEleve] = useState(false);
  const [eleveSelectionne, setEleveSelectionne] = useState<EleveClasse | null>(null);
  
  // États pour la suppression de classe
  const [modalSuppressionClasse, setModalSuppressionClasse] = useState(false);
  const [classeASupprimer, setClasseASupprimer] = useState<Classe | null>(null);

  const transfererEleve = (eleveId: number, classeDestination: string) => {
    // Mise à jour du statut de l'élève
    setClasses(prev => prev.map(classe => {
      // Retirer l'élève de la classe actuelle
      const classeModifiee = {
        ...classe,
        anneesScolaires: classe.anneesScolaires.map(annee => ({
          ...annee,
          elevesIds: annee.elevesIds.filter(id => id !== eleveId),
          effectif: annee.elevesIds.filter(id => id !== eleveId).length
        }))
      };

      // Ajouter l'élève à la classe de destination
      if (classe.nom === classeDestination) {
        return {
          ...classeModifiee,
          anneesScolaires: classeModifiee.anneesScolaires.map(annee => ({
            ...annee,
            elevesIds: [...annee.elevesIds, eleveId],
            effectif: annee.elevesIds.length + 1
          }))
        };
      }

      return classeModifiee;
    }));

    console.log(`Transfert de l'élève ${eleveId} vers ${classeDestination}`);
  };

  const transfererElevesAutomatiquement = (classeId: number) => {
    const classe = classes.find(c => c.id === classeId);
    if (!classe) return;

    const niveauSuperieur = getNiveauSuperieur(classe.niveauNom);
    if (!niveauSuperieur) {
      alert("Pas de niveau supérieur disponible pour ce niveau");
      return;
    }

    // Trouver les classes du niveau supérieur
    const classesNiveauSuperieur = classes.filter(c => c.niveauNom === niveauSuperieur);
    if (classesNiveauSuperieur.length === 0) {
      alert("Aucune classe du niveau supérieur disponible");
      return;
    }

    // Trouver les élèves éligibles selon les règles configurées
    const anneeActuelle = classe.anneesScolaires.find(annee => annee.statut === "active");
    if (!anneeActuelle) {
      alert("Aucune année scolaire active trouvée");
      return;
    }

    const elevesEligibles = elevesMock.filter(eleve => 
      anneeActuelle.elevesIds.includes(eleve.id) && 
      estEligibleTransfert(eleve, reglesTransfert)
    );

    if (elevesEligibles.length === 0) {
      alert(`Aucun élève éligible pour le transfert (moyenne >= ${reglesTransfert.moyenneMinimale}/20)`);
      return;
    }

    // Préparer les données pour le modal de confirmation
    setElevesATransferer(elevesEligibles);
    setClasseSource(classe);
    setModalTransfert(true);
  };

  const confirmerTransfertAutomatique = () => {
    if (!classeSource || elevesATransferer.length === 0) return;

    const niveauSuperieur = getNiveauSuperieur(classeSource.niveauNom);
    const classesNiveauSuperieur = classes.filter(c => c.niveauNom === niveauSuperieur);

    // Logique de transfert selon les règles
    elevesATransferer.forEach((eleve) => {
      const classeDestination = getClasseDestination(classeSource, classesNiveauSuperieur, reglesTransfert.transfertDirect);
      if (classeDestination) {
        transfererEleve(eleve.id, classeDestination.nom);
      }
    });

    // Désactiver l'année scolaire si configuré
    if (reglesTransfert.desactiverAnneeApresTransfert) {
      setClasses(prev => prev.map(classe => {
        if (classe.id === classeSource.id) {
          return {
            ...classe,
            anneesScolaires: classe.anneesScolaires.map(annee => ({
              ...annee,
              statut: annee.statut === "active" ? "inactive" : annee.statut
            }))
          };
        }
        return classe;
      }));
    }

    setModalTransfert(false);
    setElevesATransferer([]);
    setClasseSource(null);
  };

  const ouvrirModalAjout = () => {
    setActiveTab("ajout");
    setModeEdition(false);
    setClasseAModifier(null);
  };

  const ouvrirModalModification = (classe: Classe) => {
    setClasseAModifier(classe);
    setModeEdition(true);
    setActiveTab("ajout");
  };

  const ouvrirModalDetailsEleve = (eleve: EleveClasse) => {
    setEleveSelectionne(eleve);
    setModalDetailsEleve(true);
  };

  const getStatutBadge = (statut: string) => {
    const statutInfo = STATUTS_CLASSE.find(s => s.value === statut);
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-800',
      orange: 'bg-orange-100 text-orange-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[statutInfo?.couleur || 'gray']}`}>
        {statutInfo?.label || statut}
      </span>
    );
  };

  const getEffectifBadge = (effectif: number, effectifMax: number) => {
    const pourcentage = (effectif / effectifMax) * 100;
    let colorClass = 'bg-green-100 text-green-800';
    
    if (pourcentage >= 90) colorClass = 'bg-red-100 text-red-800';
    else if (pourcentage >= 75) colorClass = 'bg-orange-100 text-orange-800';
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
        {effectif}/{effectifMax}
      </span>
    );
  };

  // Fonction de suppression de classe
  const supprimerClasse = () => {
    if (classeASupprimer) {
      setClasses(prev => prev.filter(c => c.id !== classeASupprimer.id));
      setClasseASupprimer(null);
      setModalSuppressionClasse(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestion des Classes</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les classes, leurs effectifs et professeurs principaux
          </p>
        </div>
        
        {/* Bouton règles de transfert (admin seulement) */}
        <button
          onClick={() => setModalReglesTransfert(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          title="Gérer les règles de transfert automatique"
        >
          <Settings className="w-4 h-4" />
          Règles de transfert
        </button>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("liste")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "liste"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <School className="w-4 h-4" />
                Liste des classes
              </div>
            </button>
            <button
              onClick={() => setActiveTab("ajout")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "ajout"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter/Modifier
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "liste" ? (
        <div>
          {/* Filtres et recherche */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom de classe, niveau ou professeur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  {STATUTS_CLASSE.map(statut => (
                    <option key={statut.value} value={statut.value}>{statut.label}</option>
                  ))}
                </select>
              </div>

              {/* Bouton Nouvelle Classe */}
              <button
                onClick={ouvrirModalAjout}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouvelle Classe
              </button>
            </div>
          </div>

          {/* Tableau des classes */}
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Effectif
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Professeur Principal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredClasses.map((classe, index) => (
                <motion.tr
                  key={classe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-neutral-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <School className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{classe.nom}</p>
                        <p className="text-sm text-neutral-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Créée le {classe.dateCreation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-neutral-900">{classe.niveauNom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getEffectifBadge(getEffectifClasse(classe), getEffectifMaxClasse(classe))}
                    <p className="text-xs text-neutral-500 mt-1">
                      {getEffectifClasse(classe)} élève{getEffectifClasse(classe) > 1 ? 's' : ''} inscrit{getEffectifClasse(classe) > 1 ? 's' : ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getProfesseurPrincipalClasse(classe) ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        <span className="text-neutral-900">{getProfesseurPrincipalClasse(classe)}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatutBadge(classe.statut)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setClasseDetails(classe)}
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => ouvrirModalModification(classe)}
                        className="p-2 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setClasseASupprimer(classe);
                          setModalSuppressionClasse(true);
                        }}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <School className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Aucune classe trouvée
            </h3>
            <p className="text-neutral-500">
              Essayez de modifier vos critères de recherche ou créez une nouvelle classe.
            </p>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Classes",
            value: classes.length,
            icon: <School className="w-5 h-5" />,
            color: "bg-blue-500"
          },
          {
            title: "Classes Actives",
            value: classes.filter(c => c.statut === "active").length,
            icon: <CheckCircle className="w-5 h-5" />,
            color: "bg-green-500"
          },
          {
            title: "Total Élèves",
            value: classes.reduce((sum, c) => sum + getEffectifClasse(c), 0),
            icon: <Users className="w-5 h-5" />,
            color: "bg-purple-500"
          },
          {
            title: "Capacité Moyenne",
            value: Math.round(classes.reduce((sum, c) => sum + (getEffectifClasse(c) / getEffectifMaxClasse(c) * 100), 0) / classes.length) + "%",
            icon: <AlertCircle className="w-5 h-5" />,
            color: "bg-orange-500"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg border border-neutral-200 p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              {modeEdition ? "Modifier la classe" : "Ajouter une nouvelle classe"}
            </h2>
            <FormulaireClasse
              onSubmit={ajouterClasse}
              onClose={() => {
                setActiveTab("liste");
                setClasseAModifier(null);
                setModeEdition(false);
              }}
              classeAModifier={classeAModifier || undefined}
              modeEdition={modeEdition}
            />
          </div>
        </div>
      )}

      {/* Modal détails classe */}
      {classeDetails && (
        <ModalDetailsClasse
          isOpen={!!classeDetails}
          onClose={() => setClasseDetails(null)}
          classe={classeDetails}
          anneesScolaires={anneesScolairesMock}
          eleves={elevesMock}
          onAjouterAnnee={ajouterAnneeScolaire}
          onTransfererEleve={transfererEleve}
          onTransfererElevesAutomatiquement={transfererElevesAutomatiquement}
          niveauxSuperieurs={niveauxSuperieurs}
          reglesTransfert={reglesTransfert}
          onOuvrirModalDetailsEleve={ouvrirModalDetailsEleve}
        />
      )}

      {/* Modal de confirmation de transfert automatique */}
      <Modal
        isOpen={modalTransfert}
        onClose={() => {
          setModalTransfert(false);
          setElevesATransferer([]);
          setClasseSource(null);
        }}
        title="Confirmation de transfert automatique"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              Transfert de {elevesATransferer.length} élève(s) de {classeSource?.nom}
            </h4>
            <p className="text-sm text-blue-700">
              Vers le niveau : <strong>{classeSource ? getNiveauSuperieur(classeSource.niveauNom) : ''}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Règles appliquées : Moyenne ≥ {reglesTransfert.moyenneMinimale}/20, Transfert direct : {reglesTransfert.transfertDirect ? 'Oui' : 'Non'}
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto">
            <h5 className="font-medium mb-2">Élèves à transférer :</h5>
            <div className="space-y-2">
              {elevesATransferer.map((eleve) => (
                <div key={eleve.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{eleve.prenom} {eleve.nom}</span>
                    <span className="text-sm text-gray-600 ml-2">(Moyenne: {eleve.moyenneAnnuelle}/20)</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    eleve.moyenneAnnuelle >= reglesTransfert.moyenneMinimale 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {eleve.statut}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={confirmerTransfertAutomatique}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Confirmer le transfert
            </button>
            <button
              onClick={() => {
                setModalTransfert(false);
                setElevesATransferer([]);
                setClasseSource(null);
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de gestion des règles de transfert (admin seulement) */}
      <Modal
        isOpen={modalReglesTransfert}
        onClose={() => setModalReglesTransfert(false)}
        title="Règles de transfert automatique"
        size="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moyenne minimale
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={reglesTransfert.moyenneMinimale}
                onChange={(e) => setReglesTransfert(prev => ({
                  ...prev,
                  moyenneMinimale: parseFloat(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut requis
              </label>
              <select
                value={reglesTransfert.statutRequis}
                onChange={(e) => setReglesTransfert(prev => ({
                  ...prev,
                  statutRequis: e.target.value as "inscrit" | "desinscrit" | "transfere" | "termine"
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="inscrit">Inscrit</option>
                <option value="desinscrit">Désinscrit</option>
                <option value="transfere">Transféré</option>
                <option value="termine">Terminé</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reglesTransfert.transfertDirect}
                onChange={(e) => setReglesTransfert(prev => ({
                  ...prev,
                  transfertDirect: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Transfert direct (6ème A → 5ème A)
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reglesTransfert.desactiverAnneeApresTransfert}
                onChange={(e) => setReglesTransfert(prev => ({
                  ...prev,
                  desactiverAnneeApresTransfert: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Désactiver l'année après transfert
              </span>
            </label>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setModalReglesTransfert(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              onClick={() => setModalReglesTransfert(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* Informations sur la gestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Gestion des classes
            </p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              <li>• Les effectifs sont calculés automatiquement selon les élèves inscrits</li>
              <li>• Une classe peut avoir plusieurs professeurs pour différentes matières</li>
              <li>• Le professeur principal coordonne la classe et fait le lien avec l'administration</li>
              <li>• Les classes inactives sont conservées pour l'historique</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Modal de détails de l'élève */}
      <Modal
        isOpen={modalDetailsEleve}
        onClose={() => setModalDetailsEleve(false)}
        title={`Bulletins de ${eleveSelectionne?.prenom} ${eleveSelectionne?.nom} - ${eleveSelectionne?.statut === "transfere" ? "2022-2023" : "2023-2024"}`}
        size="max-w-4xl"
      >
        {eleveSelectionne && (
          <div className="space-y-6">
            {/* Informations de l'élève */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Informations de l'élève</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nom complet</p>
                  <p className="font-medium">{eleveSelectionne.prenom} {eleveSelectionne.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Moyenne annuelle</p>
                  <p className="font-medium">{eleveSelectionne.moyenneAnnuelle}/20</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Statut</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    eleveSelectionne.statut === "inscrit" ? "bg-green-100 text-green-800" :
                    eleveSelectionne.statut === "transfere" ? "bg-blue-100 text-blue-800" :
                    eleveSelectionne.statut === "desinscrit" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {eleveSelectionne.statut === "inscrit" ? "Inscrit" :
                     eleveSelectionne.statut === "transfere" ? "Transféré" :
                     eleveSelectionne.statut === "desinscrit" ? "Désinscrit" : "Terminé"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date d'inscription</p>
                  <p className="font-medium">{new Date(eleveSelectionne.dateInscription).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {/* Bulletins par semestre */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Bulletins {eleveSelectionne.statut === "transfere" ? "2022-2023" : "2023-2024"}</h3>
              
              {["Semestre 1", "Semestre 2"].map((semestre) => {
                // Déterminer l'année scolaire selon le statut de l'élève
                const anneeScolaireId = eleveSelectionne.statut === "transfere" ? 2 : 1; // 2 = 2022-2023, 1 = 2023-2024
                const anneeNom = anneeScolaireId === 2 ? "2022-2023" : "2023-2024";
                const bulletin = bulletinsMock[eleveSelectionne.id]?.[anneeScolaireId]?.[semestre];
                if (!bulletin) return null;
                
                return (
                  <div key={semestre} className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="font-semibold text-blue-900">{semestre} - {anneeNom}</h4>
                      <p className="text-sm text-blue-700">Moyenne générale: {bulletin.moyenne}/20</p>
                    </div>
                    
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Matière
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Devoir 1
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Devoir 2
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Composition
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coef.
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Appréciation
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {bulletin.matieres.map((matiere: MatiereBulletin, index: number) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm font-medium text-gray-900">
                                  {matiere.nom}
                                </td>
                                <td className="px-3 py-2 text-sm text-center text-gray-900">
                                  {matiere.note1 || "—"}
                                </td>
                                <td className="px-3 py-2 text-sm text-center text-gray-900">
                                  {matiere.note2 || "—"}
                                </td>
                                <td className="px-3 py-2 text-sm text-center text-gray-900">
                                  {matiere.composition || "—"}
                                </td>
                                <td className="px-3 py-2 text-sm text-center text-gray-900">
                                  {matiere.coefficient}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {matiere.appreciation}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
      
      {/* Modal de confirmation de suppression de classe */}
      <Modal
        isOpen={modalSuppressionClasse}
        onClose={() => {
          setModalSuppressionClasse(false);
          setClasseASupprimer(null);
        }}
        title="Supprimer la classe"
        size="max-w-md"
      >
        {classeASupprimer && (
          <div className="space-y-4">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Êtes-vous sûr de vouloir supprimer la classe "{classeASupprimer.nom}" ?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Cette action est irréversible. Toutes les données associées à cette classe seront supprimées définitivement.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Informations de la classe</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Nom :</strong> {classeASupprimer.nom}</p>
                <p><strong>Niveau :</strong> {classeASupprimer.niveauNom}</p>
                <p><strong>Effectif actuel :</strong> {getEffectifClasse(classeASupprimer)}/{getEffectifMaxClasse(classeASupprimer)}</p>
                <p><strong>Statut :</strong> {classeASupprimer.statut}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setModalSuppressionClasse(false);
                  setClasseASupprimer(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={supprimerClasse}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Composant Modal pour les détails de classe avec années scolaires
const ModalDetailsClasse: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  classe: Classe | null;
  anneesScolaires: AnneeScolaire[];
  eleves: EleveClasse[];
  onAjouterAnnee: (classeId: number, anneeScolaire: AnneeScolaire) => void;
  onTransfererEleve: (eleveId: number, classeDestination: string) => void;
  onTransfererElevesAutomatiquement: (classeId: number) => void;
  niveauxSuperieurs: Record<string, string>;
  reglesTransfert: ReglesTransfert;
  onOuvrirModalDetailsEleve: (eleve: EleveClasse) => void;
}> = ({ isOpen, onClose, classe, anneesScolaires, eleves, onAjouterAnnee, onTransfererEleve, onTransfererElevesAutomatiquement, niveauxSuperieurs, reglesTransfert, onOuvrirModalDetailsEleve }) => {
  const [anneeSelectionnee, setAnneeSelectionnee] = useState<number | null>(null);
  const [showTransfertModal, setShowTransfertModal] = useState(false);
  const [eleveATransferer, setEleveATransferer] = useState<EleveClasse | null>(null);

  if (!classe) return null;

  const anneeActuelle = classe.anneesScolaires.find(annee => annee.statut === "active");
  const anneeSelectionneeData = anneeSelectionnee 
    ? classe.anneesScolaires.find(annee => annee.anneeScolaireId === anneeSelectionnee)
    : anneeActuelle;

  const elevesAnnee = anneeSelectionneeData 
    ? eleves.filter(eleve => anneeSelectionneeData.elevesIds.includes(eleve.id))
    : [];

  const anneesDisponibles = anneesScolaires.filter(annee => 
    !classe.anneesScolaires.some(ca => ca.anneeScolaireId === annee.id)
  );

  const elevesTransferables = elevesAnnee.filter(eleve => 
    eleve.statut === reglesTransfert.statutRequis && 
    eleve.moyenneAnnuelle >= reglesTransfert.moyenneMinimale
  );

  const handleTransfert = (eleve: EleveClasse) => {
    setEleveATransferer(eleve);
    setShowTransfertModal(true);
  };

  const confirmerTransfert = (classeDestination: string) => {
    if (eleveATransferer) {
      onTransfererEleve(eleveATransferer.id, classeDestination);
      setShowTransfertModal(false);
      setEleveATransferer(null);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Détails de la classe ${classe.nom}`}
        size="max-w-6xl"
        >
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                <p><strong>Nom :</strong> {classe.nom}</p>
                <p><strong>Niveau :</strong> {classe.niveauNom}</p>
                <p><strong>Statut :</strong> {classe.statut}</p>
                </div>
                <div>
                <p><strong>Date de création :</strong> {classe.dateCreation}</p>
                {classe.dateModification && (
                  <p><strong>Dernière modification :</strong> {classe.dateModification}</p>
                  )}
                </div>
              </div>
            {classe.description && (
                <div className="mt-4">
                  <p><strong>Description :</strong></p>
                <p className="text-neutral-600 mt-1">{classe.description}</p>
                </div>
              )}
            </div>

          {/* Sélection d'année scolaire */}
              <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Années scolaires
                </h3>
              {anneesDisponibles.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const anneeId = parseInt(e.target.value);
                      const anneeSelectionnee = anneesDisponibles.find(a => a.id === anneeId);
                      if (anneeSelectionnee) {
                        onAjouterAnnee(classe.id, anneeSelectionnee);
                      }
                    }}
                  >
                    <option value="">Sélectionner une année</option>
                    {anneesDisponibles.map(annee => (
                      <option key={annee.id} value={annee.id}>
                        {annee.nom} ({annee.anneeDebut}-{annee.anneeFin})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const select = document.querySelector('select') as HTMLSelectElement;
                      if (select && select.value) {
                        const anneeId = parseInt(select.value);
                        const anneeSelectionnee = anneesDisponibles.find(a => a.id === anneeId);
                        if (anneeSelectionnee) {
                          onAjouterAnnee(classe.id, anneeSelectionnee);
                        }
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              )}
            </div>

            {/* Liste des années */}
            <div className="flex gap-2 mb-4">
              {classe.anneesScolaires.map(annee => (
                <button
                  key={annee.anneeScolaireId}
                  onClick={() => setAnneeSelectionnee(annee.anneeScolaireId)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    (anneeSelectionnee || anneeActuelle?.anneeScolaireId) === annee.anneeScolaireId
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-blue-100'
                  }`}
                >
                  {annee.anneeScolaireNom}
                  {annee.statut === "active" && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Détails de l'année sélectionnée */}
            {anneeSelectionneeData && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-3">Année {anneeSelectionneeData.anneeScolaireNom}</h4>
                
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600">Effectif</p>
                    <p className="text-xl font-bold text-green-800">{anneeSelectionneeData.effectif}/{anneeSelectionneeData.effectifMax}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600">Élèves transférables</p>
                    <p className="text-xl font-bold text-blue-800">{elevesTransferables.length}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-600">Matières enseignées</p>
                    <p className="text-xl font-bold text-orange-800">{anneeSelectionneeData.profsMatieres.length}</p>
                  </div>
                </div>

                {/* Bouton de transfert automatique */}
                {elevesTransferables.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                      <h5 className="font-medium text-orange-800 mb-2">Transfert automatique</h5>
                      <p className="text-sm text-orange-700 mb-2">
                        {elevesTransferables.length} élève(s) éligible(s) pour le transfert vers le niveau supérieur
                      </p>
                      <div className="text-xs text-orange-600">
                        <p>• Moyenne minimale requise : {reglesTransfert.moyenneMinimale}/20</p>
                        <p>• Statut requis : {reglesTransfert.statutRequis}</p>
                        <p>• Transfert direct : {reglesTransfert.transfertDirect ? 'Oui' : 'Non'}</p>
                        <p>• Niveau de destination : {getNiveauSuperieur(classe.niveauNom) || 'Non disponible'}</p>
                        {reglesTransfert.desactiverAnneeApresTransfert && (
                          <p>• L'année sera désactivée après transfert</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onTransfererElevesAutomatiquement(classe.id)}
                      className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Transférer automatiquement {elevesTransferables.length} élève(s) vers le niveau supérieur
                    </button>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Seuls les élèves avec une moyenne ≥ {reglesTransfert.moyenneMinimale}/20 seront transférés
                    </p>
                  </div>
                )}

                {/* Liste des élèves */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Élèves de cette année</h5>
                    <span className="text-sm text-gray-500">{elevesAnnee.length} élève(s)</span>
                  </div>
                  
                  <div className="space-y-2">
                    {elevesAnnee.map(eleve => (
                      <div key={eleve.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{eleve.prenom} {eleve.nom}</p>
                            <p className="text-sm text-gray-600">
                              Moyenne: {eleve.moyenneAnnuelle}/20
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            eleve.statut === "inscrit" ? "bg-green-100 text-green-800" :
                            eleve.statut === "transfere" ? "bg-blue-100 text-blue-800" :
                            eleve.statut === "desinscrit" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {eleve.statut === "inscrit" ? "Inscrit" :
                             eleve.statut === "transfere" ? "Transféré" :
                             eleve.statut === "desinscrit" ? "Désinscrit" : "Terminé"}
                          </span>
                          <button
                            onClick={() => onOuvrirModalDetailsEleve(eleve)}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Détails
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historique des élèves des années précédentes */}
                <div className="mt-6">
                  <h5 className="font-medium mb-3">Historique des élèves</h5>
                  <div className="space-y-3">
                    {classe.anneesScolaires
                      .filter(annee => annee.statut !== "active")
                      .sort((a, b) => b.anneeScolaireId - a.anneeScolaireId)
                      .map(annee => {
                        const elevesAnneeHistorique = historiqueElevesMock[classe.id]?.[annee.anneeScolaireId] || [];
                        return (
                          <div key={annee.anneeScolaireId} className="border border-gray-200 rounded-lg">
                            <button
                              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                              onClick={() => {
                                const content = document.getElementById(`historique-${annee.anneeScolaireId}`);
                                if (content) {
                                  content.classList.toggle('hidden');
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{annee.anneeScolaireNom}</span>
                                <span className="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                  {elevesAnneeHistorique.length} élève(s)
                                </span>
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            </button>
                            <div id={`historique-${annee.anneeScolaireId}`} className="hidden">
                              <div className="p-4 space-y-2">
                                {elevesAnneeHistorique.length > 0 ? (
                                  elevesAnneeHistorique.map((eleve: EleveClasse) => (
                                    <div key={eleve.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                      <div>
                                        <p className="font-medium">{eleve.prenom} {eleve.nom}</p>
                                        <p className="text-sm text-gray-600">
                                          Moyenne: {eleve.moyenneAnnuelle}/20
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                          eleve.statut === "inscrit" ? "bg-green-100 text-green-800" :
                                          eleve.statut === "transfere" ? "bg-blue-100 text-blue-800" :
                                          eleve.statut === "desinscrit" ? "bg-red-100 text-red-800" :
                                          "bg-gray-100 text-gray-800"
                                        }`}>
                                          {eleve.statut === "inscrit" ? "Inscrit" :
                                           eleve.statut === "transfere" ? "Transféré" :
                                           eleve.statut === "desinscrit" ? "Désinscrit" : "Terminé"}
                                        </span>
                                        <button
                                          onClick={() => onOuvrirModalDetailsEleve(eleve)}
                                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                          Détails
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    <p>Aucun élève enregistré pour cette année</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

    </>
  );
};

export default Classes;