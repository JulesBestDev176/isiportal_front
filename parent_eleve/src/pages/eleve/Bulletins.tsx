// Composant principal
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, FileText, TrendingUp, Eye, Download, 
  Lock, CheckCircle, AlertCircle, BarChart,
  Clock, Star, ChevronDown,
  Search, Bell, MessageSquare, Printer, X
} from "lucide-react";

// Types mis à jour
interface Note {
  id: string;
  annee: string;
  semestre: number;
  matiere: string;
  professeur: string;
  type: string;
  note: number;
  max: number;
  coefficient: number;
  date: string;
  appreciation?: string;
  competences?: string[];
}

interface MoyenneMatiere {
  matiere: string;
  professeur: string;
  moyenne: number;
  notes: Note[];
  appreciation: string;
  couleur: string;
}

interface Bulletin {
  id: string;
  annee: string;
  semestre: number;
  periode: string;
  dateDebut: string;
  dateFin: string;
  moyenneGenerale: number;
  rang: number;
  totalEleves: number;
  appreciation: string;
  moyennesMatiere: MoyenneMatiere[];
  statut: "en_cours" | "clos" | "partage";
  datePartage?: string;
  appreciationConseilClasse?: string;
  absences: {
    justifiees: number;
    injustifiees: number;
    retards: number;
  };
}

interface AnneeScolaire {
  annee: string;
  libelle: string;
  statut: "termine" | "en_cours";
  semestres: {
    semestre1: Bulletin | null;
    semestre2: Bulletin | null;
  };
}

// Données mockées avec plusieurs années
const notesMock: Note[] = [
  // Année 2024-2025 - Semestre 1
  {
    id: "n1",
    annee: "2024-2025",
    semestre: 1,
    matiere: "Mathématiques",
    professeur: "M. Dubois",
    type: "Devoir 1",
    note: 14,
    max: 20,
    coefficient: 1,
    date: "2024-10-10",
    appreciation: "Bon travail, attention aux calculs"
  },
  {
    id: "n2",
    annee: "2024-2025",
    semestre: 1,
    matiere: "Mathématiques",
    professeur: "M. Dubois",
    type: "Devoir 2",
    note: 16,
    max: 20,
    coefficient: 1,
    date: "2024-11-15",
    appreciation: "Très bonne maîtrise des équations"
  },
  {
    id: "n3",
    annee: "2024-2025",
    semestre: 1,
    matiere: "Mathématiques",
    professeur: "M. Dubois",
    type: "Composition",
    note: 15,
    max: 20,
    coefficient: 2,
    date: "2024-12-20",
    appreciation: "Bonne compréhension générale, quelques erreurs de calcul"
  },
  {
    id: "n4",
    annee: "2024-2025",
    semestre: 1,
    matiere: "Français",
    professeur: "Mme Leroy",
    type: "Devoir 1",
    note: 13,
    max: 20,
    coefficient: 1,
    date: "2024-10-08",
    appreciation: "Expression correcte, développement à améliorer"
  },
  {
    id: "n5",
    annee: "2024-2025",
    semestre: 1,
    matiere: "Français",
    professeur: "Mme Leroy",
    type: "Devoir 2",
    note: 17,
    max: 20,
    coefficient: 1,
    date: "2024-11-12",
    appreciation: "Excellente analyse, style fluide"
  },
  {
    id: "n6",
    annee: "2024-2025",
    semestre: 1,
    matiere: "Français",
    professeur: "Mme Leroy",
    type: "Composition",
    note: 15,
    max: 20,
    coefficient: 2,
    date: "2024-12-18",
    appreciation: "Dissertation bien structurée, quelques maladresses de style"
  }
];

// Fonction pour calculer la moyenne d'une matière
const calculerMoyenneMatiere = (notes: Note[]) => {
  if (notes.length === 0) return 0;
  
  const devoirs = notes.filter(n => n.type.includes("Devoir") || n.type === "TP Noté");
  const compositions = notes.filter(n => n.type === "Composition");
  
  let moyenneDevoirs = 0;
  let moyenneCompositions = 0;
  
  if (devoirs.length > 0) {
    moyenneDevoirs = devoirs.reduce((acc, note) => acc + note.note, 0) / devoirs.length;
  }
  
  if (compositions.length > 0) {
    moyenneCompositions = compositions.reduce((acc, note) => acc + note.note, 0) / compositions.length;
  }
  
  if (compositions.length > 0 && devoirs.length > 0) {
    return (moyenneDevoirs + 2 * moyenneCompositions) / 3;
  } else if (devoirs.length > 0) {
    return moyenneDevoirs;
  } else if (compositions.length > 0) {
    return moyenneCompositions;
  }
  
  return 0;
};

// Génération des années scolaires avec bulletins
const anneesScolairesMock: AnneeScolaire[] = [
  {
    annee: "2024-2025",
    libelle: "2024-2025 (Actuelle)",
    statut: "en_cours",
    semestres: {
      semestre1: {
        id: "b1",
        annee: "2024-2025",
        semestre: 1,
        periode: "1er Semestre 2024-2025",
        dateDebut: "2024-09-01",
        dateFin: "2025-01-31",
        moyenneGenerale: 15.2,
        rang: 6,
        totalEleves: 28,
        appreciation: "Élève sérieux et impliqué. Très bon niveau général avec d'excellents résultats en sciences.",
        statut: "partage",
        datePartage: "2025-02-05",
        appreciationConseilClasse: "Félicitations pour ce très bon semestre. Continuez sur cette voie.",
        absences: { justifiees: 2, injustifiees: 0, retards: 1 },
        moyennesMatiere: [
          {
            matiere: "Mathématiques",
            professeur: "M. Dubois",
            moyenne: calculerMoyenneMatiere(notesMock.filter(n => n.annee === "2024-2025" && n.semestre === 1 && n.matiere === "Mathématiques")),
            notes: notesMock.filter(n => n.annee === "2024-2025" && n.semestre === 1 && n.matiere === "Mathématiques"),
            appreciation: "Très bon niveau, élève rigoureux. Maîtrise correcte des concepts fondamentaux",
            couleur: "bg-blue-500"
          },
          {
            matiere: "Français",
            professeur: "Mme Leroy",
            moyenne: calculerMoyenneMatiere(notesMock.filter(n => n.annee === "2024-2025" && n.semestre === 1 && n.matiere === "Français")),
            notes: notesMock.filter(n => n.annee === "2024-2025" && n.semestre === 1 && n.matiere === "Français"),
            appreciation: "Bonne expression écrite, analyse littéraire en progrès. Travaillez le style",
            couleur: "bg-green-500"
          }
        ]
      },
      semestre2: {
        id: "b2",
        annee: "2024-2025",
        semestre: 2,
        periode: "2ème Semestre 2024-2025",
        dateDebut: "2025-02-01",
        dateFin: "2025-06-30",
        moyenneGenerale: 0,
        rang: 0,
        totalEleves: 28,
        appreciation: "",
        statut: "en_cours",
        absences: { justifiees: 1, injustifiees: 0, retards: 0 },
        moyennesMatiere: []
      }
    }
  },
  {
    annee: "2023-2024",
    libelle: "2023-2024",
    statut: "termine",
    semestres: {
      semestre1: {
        id: "b3",
        annee: "2023-2024",
        semestre: 1,
        periode: "1er Semestre 2023-2024",
        dateDebut: "2023-09-01",
        dateFin: "2024-01-31",
        moyenneGenerale: 14.8,
        rang: 8,
        totalEleves: 27,
        appreciation: "Bon travail général. Quelques efforts à fournir en français.",
        statut: "partage",
        datePartage: "2024-02-10",
        appreciationConseilClasse: "Encouragements pour les progrès réalisés.",
        absences: { justifiees: 1, injustifiees: 1, retards: 2 },
        moyennesMatiere: [
          {
            matiere: "Mathématiques",
            professeur: "M. Martin",
            moyenne: 15.2,
            notes: [],
            appreciation: "Progression constante, travail sérieux. Continuez vos efforts",
            couleur: "bg-blue-500"
          },
          {
            matiere: "Français",
            professeur: "Mme Durand",
            moyenne: 13.8,
            notes: [],
            appreciation: "Expression écrite à améliorer. Participation orale satisfaisante",
            couleur: "bg-green-500"
          },
          {
            matiere: "Histoire-Géographie",
            professeur: "M. Rousseau",
            moyenne: 14.5,
            notes: [],
            appreciation: "Bonne culture générale. Méthode à consolider",
            couleur: "bg-yellow-500"
          }
        ]
      },
      semestre2: {
        id: "b4",
        annee: "2023-2024",
        semestre: 2,
        periode: "2ème Semestre 2023-2024",
        dateDebut: "2024-02-01",
        dateFin: "2024-06-30",
        moyenneGenerale: 15.5,
        rang: 5,
        totalEleves: 27,
        appreciation: "Très bonne progression au cours de l'année. Élève sérieux et volontaire.",
        statut: "partage",
        datePartage: "2024-07-05",
        appreciationConseilClasse: "Félicitations pour les progrès réalisés. Passage en classe supérieure.",
        absences: { justifiees: 0, injustifiees: 0, retards: 1 },
        moyennesMatiere: [
          {
            matiere: "Mathématiques",
            professeur: "M. Martin",
            moyenne: 16.1,
            notes: [],
            appreciation: "Excellente progression, très bon niveau atteint",
            couleur: "bg-blue-500"
          },
          {
            matiere: "Français",
            professeur: "Mme Durand",
            moyenne: 15.2,
            notes: [],
            appreciation: "Nette amélioration de l'expression écrite. Félicitations !",
            couleur: "bg-green-500"
          },
          {
            matiere: "Histoire-Géographie",
            professeur: "M. Rousseau",
            moyenne: 15.8,
            notes: [],
            appreciation: "Excellent travail. Méthode maîtrisée",
            couleur: "bg-yellow-500"
          }
        ]
      }
    }
  },
  {
    annee: "2022-2023",
    libelle: "2022-2023",
    statut: "termine",
    semestres: {
      semestre1: {
        id: "b5",
        annee: "2022-2023",
        semestre: 1,
        periode: "1er Semestre 2022-2023",
        dateDebut: "2022-09-01",
        dateFin: "2023-01-31",
        moyenneGenerale: 13.9,
        rang: 12,
        totalEleves: 26,
        appreciation: "Début d'année correct. Des efforts à poursuivre pour progresser.",
        statut: "partage",
        datePartage: "2023-02-08",
        appreciationConseilClasse: "Travail régulier à maintenir.",
        absences: { justifiees: 3, injustifiees: 1, retards: 3 },
        moyennesMatiere: [
          {
            matiere: "Mathématiques",
            professeur: "Mme Petit",
            moyenne: 14.2,
            notes: [],
            appreciation: "Bases solides. Travaillez la rapidité de calcul",
            couleur: "bg-blue-500"
          },
          {
            matiere: "Français",
            professeur: "M. Blanc",
            moyenne: 12.8,
            notes: [],
            appreciation: "Difficultés en expression écrite. Lisez davantage",
            couleur: "bg-green-500"
          }
        ]
      },
      semestre2: {
        id: "b6",
        annee: "2022-2023",
        semestre: 2,
        periode: "2ème Semestre 2022-2023",
        dateDebut: "2023-02-01",
        dateFin: "2023-06-30",
        moyenneGenerale: 14.3,
        rang: 10,
        totalEleves: 26,
        appreciation: "Bonne progression au cours de l'année. Continuez sur cette voie !",
        statut: "partage",
        datePartage: "2023-07-03",
        appreciationConseilClasse: "Progrès encourageants. Passage en classe supérieure.",
        absences: { justifiees: 2, injustifiees: 0, retards: 1 },
        moyennesMatiere: [
          {
            matiere: "Mathématiques",
            professeur: "Mme Petit",
            moyenne: 15.1,
            notes: [],
            appreciation: "Bonne progression. Continuez vos efforts",
            couleur: "bg-blue-500"
          },
          {
            matiere: "Français",
            professeur: "M. Blanc",
            moyenne: 13.8,
            notes: [],
            appreciation: "Amélioration notable. Persévérez dans la lecture",
            couleur: "bg-green-500"
          }
        ]
      }
    }
  }
];

// Composant Liste des Années Scolaires
const ListeAnneesScolaires: React.FC<{
  annees: AnneeScolaire[];
  onSelectBulletin: (bulletin: Bulletin) => void;
}> = ({ annees, onSelectBulletin }) => {
  const [anneeOuverte, setAnneeOuverte] = useState<string | null>(annees[0]?.annee || null);

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "partage": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "en_cours": return <Clock className="w-4 h-4 text-orange-500" />;
      case "clos": return <Lock className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "partage": return "Disponible";
      case "en_cours": return "En cours";
      case "clos": return "Non partagé";
      default: return "Inconnu";
    }
  };

  return (
    <div className="space-y-4">
      {annees.map((annee) => (
        <div key={annee.annee} className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setAnneeOuverte(anneeOuverte === annee.annee ? null : annee.annee)}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-neutral-900">{annee.libelle}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                annee.statut === "en_cours" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {annee.statut === "en_cours" ? "Année en cours" : "Terminée"}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${
              anneeOuverte === annee.annee ? "rotate-180" : ""
            }`} />
          </button>

          <AnimatePresence>
            {anneeOuverte === annee.annee && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-neutral-200"
              >
                <div className="p-4 bg-neutral-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Semestre 1 */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-neutral-900">1er Semestre</h4>
                        {annee.semestres.semestre1 && getStatutIcon(annee.semestres.semestre1.statut)}
                      </div>
                      
                      {annee.semestres.semestre1 ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">Période:</span>
                            <span className="font-medium">
                              {new Date(annee.semestres.semestre1.dateDebut).toLocaleDateString('fr-FR')} - 
                              {new Date(annee.semestres.semestre1.dateFin).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                          {annee.semestres.semestre1.statut === "partage" && (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-600">Moyenne:</span>
                                <span className="font-bold text-primary-600">
                                  {annee.semestres.semestre1.moyenneGenerale.toFixed(2)}/20
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-600">Rang:</span>
                                <span className="font-medium">
                                  {annee.semestres.semestre1.rang}e/{annee.semestres.semestre1.totalEleves}
                                </span>
                              </div>
                            </>
                          )}
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">Statut:</span>
                            <span className={`font-medium ${
                              annee.semestres.semestre1.statut === "partage" ? "text-green-600" :
                              annee.semestres.semestre1.statut === "en_cours" ? "text-orange-600" :
                              "text-gray-600"
                            }`}>
                              {getStatutLabel(annee.semestres.semestre1.statut)}
                            </span>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => onSelectBulletin(annee.semestres.semestre1!)}
                              className="flex-1 py-2 px-3 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              Consulter
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          Aucun bulletin disponible
                        </div>
                      )}
                    </div>

                    {/* Semestre 2 */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-neutral-900">2ème Semestre</h4>
                        {annee.semestres.semestre2 && getStatutIcon(annee.semestres.semestre2.statut)}
                      </div>
                      
                      {annee.semestres.semestre2 ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">Période:</span>
                            <span className="font-medium">
                              {new Date(annee.semestres.semestre2.dateDebut).toLocaleDateString('fr-FR')} - 
                              {new Date(annee.semestres.semestre2.dateFin).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                          {annee.semestres.semestre2.statut === "partage" && (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-600">Moyenne:</span>
                                <span className="font-bold text-primary-600">
                                  {annee.semestres.semestre2.moyenneGenerale.toFixed(2)}/20
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-600">Rang:</span>
                                <span className="font-medium">
                                  {annee.semestres.semestre2.rang}e/{annee.semestres.semestre2.totalEleves}
                                </span>
                              </div>
                            </>
                          )}
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">Statut:</span>
                            <span className={`font-medium ${
                              annee.semestres.semestre2.statut === "partage" ? "text-green-600" :
                              annee.semestres.semestre2.statut === "en_cours" ? "text-orange-600" :
                              "text-gray-600"
                            }`}>
                              {getStatutLabel(annee.semestres.semestre2.statut)}
                            </span>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => onSelectBulletin(annee.semestres.semestre2!)}
                              className="flex-1 py-2 px-3 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              Consulter
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          Aucun bulletin disponible
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// Composant Carte Note
const CarteNote: React.FC<{ note: Note; index: number }> = ({ note, index }) => {
  const getNoteColor = (note: number, max: number) => {
    const percentage = (note / max) * 100;
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200"; 
    if (percentage >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-neutral-900">{note.matiere}</h4>
          <p className="text-sm text-neutral-600">{note.type}</p>
          <p className="text-xs text-neutral-500">{note.professeur}</p>
        </div>
        <div className="text-right">
          <div className={`px-3 py-1 rounded-full text-lg font-bold border ${getNoteColor(note.note, note.max)}`}>
            {note.note}/{note.max}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Coef. {note.coefficient}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Date :</span>
          <span className="font-medium">{new Date(note.date).toLocaleDateString('fr-FR')}</span>
        </div>

        {note.appreciation && (
          <div className="p-2 bg-neutral-50 rounded text-sm text-neutral-700">
            <span className="font-medium">Appréciation : </span>
            {note.appreciation}
          </div>
        )}

        {note.competences && note.competences.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs text-neutral-600">Compétences évaluées :</span>
            <div className="flex flex-wrap gap-1"> 
              {note.competences.map((comp, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Composant Bulletin Complet au format tableau simple
const BulletinComplet: React.FC<{ bulletin: Bulletin }> = ({ bulletin }) => {
  const getMoyenneColor = (moyenne: number) => {
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600"; 
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      {/* En-tête du bulletin */}
      <div className="bg-primary-50 border-b border-primary-200 p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-primary-900">Bulletin de Notes</h2>
          <h3 className="text-xl font-semibold text-primary-800">{bulletin.periode}</h3>
        </div>

        {/* Informations élève */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-sm text-neutral-600">Nom et Prénom</p>
            <p className="text-lg font-bold text-neutral-900">Alexandre Martin</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-sm text-neutral-600">Classe</p>
            <p className="text-lg font-bold text-primary-900">3ème A</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-sm text-neutral-600">Année scolaire</p>
            <p className="text-lg font-bold text-neutral-900">{bulletin.annee}</p>
          </div>
        </div>
      </div>

      {/* Tableau des résultats - Format simple */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-sm">
                  MATIÈRES
                </th>
                <th className="border border-neutral-300 px-3 py-3 text-center font-semibold text-sm">
                  MOY<br/>DEVOIRS
                </th>
                <th className="border border-neutral-300 px-3 py-3 text-center font-semibold text-sm">
                  MOY<br/>COMPOS
                </th>
                <th className="border border-neutral-300 px-3 py-3 text-center font-semibold text-sm">
                  COEF
                </th>
                <th className="border border-neutral-300 px-3 py-3 text-center font-semibold text-sm">
                  MOYENNE<br/>MATIÈRE
                </th>
                <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-sm">
                  APPRÉCIATION
                </th>
              </tr>
            </thead>
            <tbody>
              {bulletin.moyennesMatiere.map((matiere, index) => {
                const devoirs = matiere.notes.filter(n => n.type.includes("Devoir") || n.type === "TP Noté");
                const compositions = matiere.notes.filter(n => n.type === "Composition");
                
                const moyenneDevoirs = devoirs.length > 0 
                  ? devoirs.reduce((acc, note) => acc + note.note, 0) / devoirs.length 
                  : 0;

                const moyenneCompositions = compositions.length > 0
                  ? compositions.reduce((acc, note) => acc + note.note, 0) / compositions.length
                  : 0;

                return (
                  <tr key={matiere.matiere} className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                    <td className="border border-neutral-300 px-4 py-3">
                      <div className="font-medium text-neutral-900">{matiere.matiere}</div>
                      <div className="text-xs text-neutral-600">{matiere.professeur}</div>
                    </td>
                    <td className="border border-neutral-300 px-3 py-3 text-center">
                      <span className={`font-bold text-sm ${getMoyenneColor(moyenneDevoirs)}`}>
                        {moyenneDevoirs.toFixed(2)}
                      </span>
                    </td>
                    <td className="border border-neutral-300 px-3 py-3 text-center">
                      <span className={`font-bold text-sm ${getMoyenneColor(moyenneCompositions)}`}>
                        {moyenneCompositions.toFixed(2)}
                      </span>
                    </td>
                    <td className="border border-neutral-300 px-3 py-3 text-center font-medium text-sm">
                      3
                    </td>
                    <td className="border border-neutral-300 px-3 py-3 text-center">
                      <span className={`text-base font-bold ${getMoyenneColor(matiere.moyenne)}`}>
                        {matiere.moyenne.toFixed(2)}
                      </span>
                    </td>
                    <td className="border border-neutral-300 px-4 py-3 text-xs">
                      {matiere.appreciation}
                    </td>
                  </tr>
                );
              })}
              
              {/* Ligne de total */}
              <tr className="bg-primary-100 border-t-2 border-primary-300">
                <td className="border border-neutral-300 px-4 py-3 font-bold text-sm">
                  MOYENNE GÉNÉRALE
                </td>
                <td className="border border-neutral-300 px-3 py-3 text-center text-sm">-</td>
                <td className="border border-neutral-300 px-3 py-3 text-center text-sm">-</td>
                <td className="border border-neutral-300 px-3 py-3 text-center font-bold text-sm">
                  {bulletin.moyennesMatiere.length * 3}
                </td>
                <td className="border border-neutral-300 px-3 py-3 text-center">
                  <span className={`text-lg font-bold ${getMoyenneColor(bulletin.moyenneGenerale)}`}>
                    {bulletin.moyenneGenerale.toFixed(2)}
                  </span>
                </td>
                <td className="border border-neutral-300 px-4 py-3 text-center">
                  <div className="font-bold text-sm text-primary-900">
                    Rang: {bulletin.rang}e / {bulletin.totalEleves}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Informations complémentaires */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-blue-600 font-medium">Total crédits obtenus</p>
            <p className="text-lg font-bold text-blue-900">{(bulletin.moyenneGenerale * bulletin.moyennesMatiere.length * 3 / 20).toFixed(0)}</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="text-green-600 font-medium">Absences justifiées</p>
            <p className="text-lg font-bold text-green-900">{bulletin.absences.justifiees}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <p className="text-orange-600 font-medium">Retards</p>
            <p className="text-lg font-bold text-orange-900">{bulletin.absences.retards}</p>
          </div>
        </div>
      </div>

      {/* Appréciations */}
      <div className="p-6 bg-neutral-50 border-t border-neutral-200">
        <div className="space-y-4">
          <div className="p-4 bg-white border border-neutral-200 rounded">
            <h4 className="font-semibold text-neutral-900 mb-2">Appréciation du professeur principal :</h4>
            <p className="text-sm text-neutral-700">{bulletin.appreciation}</p>
          </div>

          {bulletin.appreciationConseilClasse && (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h4 className="font-semibold text-green-900 mb-2">Décision du conseil de classe :</h4>
              <p className="text-sm text-green-800 font-medium">{bulletin.appreciationConseilClasse}</p>
            </div>
          )}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-6 border-t border-neutral-200">
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-700 mb-6">Le Directeur</p>
            <div className="border-t border-neutral-400 pt-2">
              <p className="text-xs text-neutral-500">Signature et cachet</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-700 mb-6">Le Professeur Principal</p>
            <div className="border-t border-neutral-400 pt-2">
              <p className="text-xs text-neutral-500">Signature</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-700 mb-6">Le Parent/Tuteur</p>
            <div className="border-t border-neutral-400 pt-2">
              <p className="text-xs text-neutral-500">Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Message d'attente pour bulletins non disponibles
const MessageAttenteBulletin: React.FC<{ bulletin: Bulletin }> = ({ bulletin }) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-10 h-10 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          Bulletin en préparation
        </h3>
        <p className="text-neutral-600">
          Le bulletin du {bulletin.periode} est actuellement en cours de préparation par l'équipe pédagogique.
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-orange-600 font-medium">Période :</span>
            <p className="text-orange-800">
              {new Date(bulletin.dateDebut).toLocaleDateString('fr-FR')} - 
              {new Date(bulletin.dateFin).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div>
            <span className="text-orange-600 font-medium">Statut :</span>
            <p className="text-orange-800">En cours de saisie</p>
          </div>
        </div>
      </div>

      <div className="text-sm text-neutral-600">
        <p>Vous serez automatiquement notifié dès que le bulletin sera disponible.</p>
        <p className="mt-2">En cas de question, n'hésitez pas à contacter votre professeur principal.</p>
      </div>
    </div>
  );
};

// Composant principal
const NotesEtBulletins: React.FC = () => {
  const [ongletActif, setOngletActif] = useState<"notes" | "bulletins">("bulletins");
  const [matiereFiltre, setMatiereFiltre] = useState<string>("");
  const [rechercheTexte, setRechercheTexte] = useState("");
  
  // États pour le modal des bulletins
  const [bulletinModalOuvert, setBulletinModalOuvert] = useState(false);
  const [bulletinSelectionneModal, setBulletinSelectionneModal] = useState<Bulletin | null>(null);
  
  const [notes] = useState<Note[]>(notesMock);
  const [anneesScolaires] = useState<AnneeScolaire[]>(anneesScolairesMock);

  // Fonction pour ouvrir le modal avec un bulletin
  const ouvrirBulletinModal = (bulletin: Bulletin) => {
    setBulletinSelectionneModal(bulletin);
    setBulletinModalOuvert(true);
  };

  // Fonction pour fermer le modal
  const fermerBulletinModal = () => {
    setBulletinModalOuvert(false);
    setBulletinSelectionneModal(null);
  };

  // Fonction pour imprimer le bulletin
  const imprimerBulletin = () => {
    window.print();
  };

  // Fonction pour télécharger le bulletin en PDF
  const telechargerBulletinPDF = () => {
    // Simulation du téléchargement
    const element = document.createElement('a');
    element.href = '#';
    element.download = `bulletin_${bulletinSelectionneModal?.periode?.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtrage des notes
  const notesFiltrees = notes.filter(note => {
    const matchTexte = note.matiere.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      note.type.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchMatiere = !matiereFiltre || note.matiere === matiereFiltre;
    return matchTexte && matchMatiere;
  });

  const matieres = [...new Set(notes.map(n => n.matiere))];

  // Calcul statistiques corrigé
  const moyenneGenerale = notes.length > 0 
    ? notes.reduce((acc, note) => acc + (note.note / note.max * 20 * note.coefficient), 0) / 
      notes.reduce((acc, note) => acc + note.coefficient, 0)
    : 0;

  const meilleureNote = Math.max(...notes.map(n => n.note / n.max * 20));
  const nombreEvaluations = notes.length;

  // Calcul du nombre de matières avec toutes les notes requises (min 3 notes)
  const matiereStats = matieres.map(matiere => {
    const notesMatiere = notes.filter(n => n.matiere === matiere);
    const devoirs = notesMatiere.filter(n => n.type.includes("Devoir") || n.type === "TP Noté");
    const compositions = notesMatiere.filter(n => n.type === "Composition");
    
    return {
      matiere,
      totalNotes: notesMatiere.length,
      devoirs: devoirs.length,
      compositions: compositions.length,
      complete: devoirs.length >= 2 && compositions.length >= 1
    };
  });

  const matieresCompletes = matiereStats.filter(m => m.complete).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Notes et Bulletins</h1>
          <p className="text-neutral-600 mt-1">
            Consultez vos résultats scolaires et votre progression
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-primary-600">Moyenne générale</p>
              <p className="text-2xl font-bold text-primary-900">{moyenneGenerale.toFixed(1)}</p>
              <p className="text-xs text-primary-600">Sur 20</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600">Meilleure note</p>
              <p className="text-2xl font-bold text-green-900">{meilleureNote.toFixed(1)}</p>
              <p className="text-xs text-green-600">Sur 20</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-600">Évaluations</p>
              <p className="text-2xl font-bold text-orange-900">{nombreEvaluations}</p>
              <p className="text-xs text-orange-600">Ce semestre</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Matières complètes</p>
              <p className="text-2xl font-bold text-purple-900">{matieresCompletes}</p>
              <p className="text-xs text-purple-600">/ {matieres.length} matières</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setOngletActif("notes")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              ongletActif === "notes"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Mes notes ({notesFiltrees.length})
            </div>
          </button>
          
          <button
            onClick={() => setOngletActif("bulletins")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              ongletActif === "bulletins"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bulletins
            </div>
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {ongletActif === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Filtres pour les notes */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Rechercher par matière ou type d'évaluation..."
                        value={rechercheTexte}
                        onChange={(e) => setRechercheTexte(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={matiereFiltre}
                      onChange={(e) => setMatiereFiltre(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Toutes les matières</option>
                      {matieres.map(matiere => (
                        <option key={matiere} value={matiere}>{matiere}</option>
                      ))}
                    </select>

                    {(rechercheTexte || matiereFiltre) && (
                      <button
                        onClick={() => {
                          setRechercheTexte("");
                          setMatiereFiltre("");
                        }}
                        className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </div>

                {/* Liste des notes */}
                {notesFiltrees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notesFiltrees.map((note, index) => (
                      <CarteNote key={note.id} note={note} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      {rechercheTexte || matiereFiltre ? "Aucune note trouvée" : "Aucune note disponible"}
                    </h3>
                    <p className="text-neutral-600">
                      {rechercheTexte || matiereFiltre
                        ? "Aucune note ne correspond à vos critères de recherche."
                        : "Vos notes apparaîtront ici une fois saisies par vos professeurs."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {ongletActif === "bulletins" && (
              <motion.div
                key="bulletins"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-900">Mes Bulletins</h3>
                    <p className="text-sm text-neutral-600">Cliquez sur "Consulter" pour voir un bulletin</p>
                  </div>

                  {/* Liste des années scolaires et bulletins */}
                  <ListeAnneesScolaires 
                    annees={anneesScolaires} 
                    onSelectBulletin={ouvrirBulletinModal} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal pour afficher le bulletin complet ou message d'attente */}
      {bulletinModalOuvert && bulletinSelectionneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête du modal */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  {bulletinSelectionneModal.periode}
                </h2>
                <p className="text-sm text-neutral-600">
                  {bulletinSelectionneModal.statut === "partage" 
                    ? `Moyenne générale : ${bulletinSelectionneModal.moyenneGenerale.toFixed(1)}/20 - Rang : ${bulletinSelectionneModal.rang}e / ${bulletinSelectionneModal.totalEleves}`
                    : "Bulletin en cours de préparation"
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {bulletinSelectionneModal.statut === "partage" && (
                  <>
                    <button
                      onClick={imprimerBulletin}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={telechargerBulletinPDF}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={fermerBulletinModal}
                  className="flex items-center gap-2 px-3 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-6">
              {bulletinSelectionneModal.statut === "partage" ? (
                <BulletinComplet bulletin={bulletinSelectionneModal} />
              ) : (
                <MessageAttenteBulletin bulletin={bulletinSelectionneModal} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesEtBulletins;