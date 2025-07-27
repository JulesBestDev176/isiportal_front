import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Calendar, Clock, Target, 
  TrendingUp, Eye, FileText, PlayCircle, 
  BarChart, Search, Download, MessageSquare,
  User, Award, Bookmark, X
} from "lucide-react";

// Types
interface Cours {
  id: string;
  titre: string;
  description: string;
  matiere: string;
  professeur: string;
  dureeEstimee: number;
  progression: number;
  statut: "en_cours" | "termine" | "a_venir";
  difficulte: "facile" | "moyen" | "difficile";
  prochaineCeance?: string;
  salle?: string;
  objectifs: string[];
  ressources: Ressource[];
  notes: Note[];
  moyenne?: number;
}

interface Ressource {
  id: string;
  nom: string;
  type: "pdf" | "video" | "audio" | "image" | "lien";
  url: string;
  taille?: string;
  obligatoire: boolean;
  consulte: boolean;
}

interface Note {
  id: string;
  type: string;
  note: number;
  max: number;
  date: string;
  coefficient: number;
}

interface Devoir {
  id: string;
  coursId: string;
  titre: string;
  description: string;
  dateRendu: string;
  statut: "a_faire" | "rendu" | "corrige" | "en_retard";
  note?: number;
  commentaire?: string;
}

// Données mockées
const coursMock: Cours[] = [
  {
    id: "1",
    titre: "Les équations du premier degré",
    description: "Introduction aux équations linéaires et méthodes de résolution avec applications pratiques",
    matiere: "Mathématiques",
    professeur: "M. Dubois",
    dureeEstimee: 90,
    progression: 75,
    statut: "en_cours",
    difficulte: "moyen",
    prochaineCeance: "2025-07-25T08:00:00",
    salle: "A101",
    objectifs: [
      "Résoudre une équation simple à une inconnue",
      "Identifier et isoler les inconnues",
      "Vérifier la validité d'une solution"
    ],
    ressources: [
      {
        id: "r1",
        nom: "Cours - Equations premier degré.pdf",
        type: "pdf",
        url: "#",
        taille: "2.3 MB",
        obligatoire: true,
        consulte: true
      },
      {
        id: "r2",
        nom: "Vidéo explicative - Méthodes",
        type: "video",
        url: "#",
        obligatoire: false,
        consulte: false
      }
    ],
    notes: [
      { id: "n1", type: "Contrôle", note: 16, max: 20, date: "2025-07-20", coefficient: 2 },
      { id: "n2", type: "Devoir maison", note: 14, max: 20, date: "2025-07-15", coefficient: 1 }
    ],
    moyenne: 15.3
  },
  {
    id: "2",
    titre: "Géométrie : Les triangles",
    description: "Étude des propriétés des triangles, classification et théorèmes fondamentaux",
    matiere: "Mathématiques",
    professeur: "M. Dubois",
    dureeEstimee: 120,
    progression: 45,
    statut: "en_cours",
    difficulte: "difficile",
    prochaineCeance: "2025-07-26T10:00:00",
    salle: "A101",
    objectifs: [
      "Identifier les différents types de triangles",
      "Appliquer le théorème de Pythagore",
      "Calculer périmètres et aires"
    ],
    ressources: [
      {
        id: "r3",
        nom: "Cours - Triangles.pdf",
        type: "pdf",
        url: "#",
        taille: "1.8 MB",
        obligatoire: true,
        consulte: true
      }
    ],
    notes: [
      { id: "n3", type: "Interrogation", note: 12, max: 20, date: "2025-07-18", coefficient: 1 }
    ],
    moyenne: 12
  },
  {
    id: "3",
    titre: "Littérature française",
    description: "Analyse des œuvres classiques et modernes de la littérature française",
    matiere: "Français",
    professeur: "Mme Leroy",
    dureeEstimee: 90,
    progression: 90,
    statut: "en_cours",
    difficulte: "moyen",
    prochaineCeance: "2025-07-27T14:00:00",
    salle: "B205",
    objectifs: [
      "Analyser les techniques narratives",
      "Comprendre les contextes historiques",
      "Rédiger des commentaires littéraires"
    ],
    ressources: [
      {
        id: "r4",
        nom: "Analyse - Le Petit Prince",
        type: "pdf",
        url: "#",
        obligatoire: true,
        consulte: true
      }
    ],
    notes: [
      { id: "n4", type: "Dissertation", note: 15, max: 20, date: "2025-07-19", coefficient: 3 },
      { id: "n5", type: "Récitation", note: 17, max: 20, date: "2025-07-12", coefficient: 1 }
    ],
    moyenne: 15.5
  }
];

const devoirsMock: Devoir[] = [
  {
    id: "d1",
    coursId: "1",
    titre: "Exercices équations",
    description: "Résoudre les équations 1 à 15 du manuel page 87",
    dateRendu: "2025-07-28T23:59:00",
    statut: "a_faire"
  },
  {
    id: "d2",
    coursId: "3",
    titre: "Commentaire littéraire",
    description: "Analyse du chapitre 5 du Petit Prince",
    dateRendu: "2025-07-30T23:59:00",
    statut: "rendu",
    note: 16,
    commentaire: "Très bonne analyse, style fluide"
  }
];

// Composant Carte de Cours Élève
const CarteCoursEleve: React.FC<{
  cours: Cours;
  onVoir: (cours: Cours) => void;
}> = ({ cours, onVoir }) => {
  
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "en_cours": return "bg-blue-100 text-blue-800";
      case "termine": return "bg-green-100 text-green-800";
      case "a_venir": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficulteIcon = (difficulte: string) => {
    switch (difficulte) {
      case "facile": return <span className="text-green-500">●</span>;
      case "moyen": return <span className="text-yellow-500">●●</span>;
      case "difficile": return <span className="text-red-500">●●●</span>;
      default: return <span className="text-gray-500">●</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressionColor = (progression: number) => {
    if (progression >= 80) return "bg-green-500";
    if (progression >= 50) return "bg-blue-500";
    if (progression >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMoyenneColor = (moyenne?: number) => {
    if (!moyenne) return "text-gray-500";
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600";
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-all duration-300"
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-neutral-900">{cours.titre}</h3>
            {getDifficulteIcon(cours.difficulte)}
          </div>
          <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{cours.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-neutral-600">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {cours.matiere}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {cours.professeur}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {cours.dureeEstimee}min
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(cours.statut)}`}>
            {cours.statut === "en_cours" ? "En cours" : 
             cours.statut === "termine" ? "Terminé" : "À venir"}
          </span>
          {cours.moyenne && (
            <div className="text-right">
              <span className="text-xs text-neutral-600">Moyenne</span>
              <p className={`text-lg font-bold ${getMoyenneColor(cours.moyenne)}`}>
                {cours.moyenne}/20
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progression */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">Progression</span>
          <span className="text-sm text-neutral-600">{cours.progression}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressionColor(cours.progression)}`}
            style={{ width: `${cours.progression}%` }}
          />
        </div>
      </div>

      {/* Prochaine séance */}
      {cours.prochaineCeance && cours.statut === "en_cours" && (
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-900">Prochain cours</span>
          </div>
          <div className="text-sm text-primary-700">
            {formatDate(cours.prochaineCeance)}
            {cours.salle && ` - Salle ${cours.salle}`}
          </div>
        </div>
      )}

      {/* Ressources et notes */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-neutral-600">
            <FileText className="w-4 h-4" />
            {cours.ressources.length} ressources
          </span>
          <span className="flex items-center gap-1 text-neutral-600">
            <Award className="w-4 h-4" />
            {cours.notes.length} notes
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onVoir(cours)}
          className="flex-1 py-2 px-3 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Voir détails
        </button>
        <button className="py-2 px-3 text-sm border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
          <MessageSquare className="w-4 h-4" />
        </button>
        <button className="py-2 px-3 text-sm border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Composant Modal Détails Cours
const ModalDetailsCours: React.FC<{
  cours: Cours;
  devoirs: Devoir[];
  onClose: () => void;
}> = ({ cours, devoirs, onClose }) => {
  
  const devoirsCours = devoirs.filter(d => d.coursId === cours.id);

  const getStatutDevoirColor = (statut: string) => {
    switch (statut) {
      case "a_faire": return "bg-orange-100 text-orange-800";
      case "rendu": return "bg-blue-100 text-blue-800";
      case "corrige": return "bg-green-100 text-green-800";
      case "en_retard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getNoteColor = (note: number, max: number) => {
    const percentage = (note / max) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{cours.titre}</h2>
              <p className="text-neutral-600 mt-1">{cours.matiere} • {cours.professeur}</p>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg text-center">
              <p className="text-sm text-primary-600">Progression</p>
              <p className="text-2xl font-bold text-primary-900">{cours.progression}%</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-sm text-green-600">Moyenne</p>
              <p className="text-2xl font-bold text-green-900">{cours.moyenne || '--'}/20</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <p className="text-sm text-orange-600">Devoirs</p>
              <p className="text-2xl font-bold text-orange-900">{devoirsCours.length}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Description</h3>
            <p className="text-neutral-700">{cours.description}</p>
          </div>

          {/* Objectifs */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              Objectifs pédagogiques ({cours.objectifs.length})
            </h3>
            <div className="space-y-2">
              {cours.objectifs.map((objectif, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                  <span className="text-neutral-700">{objectif}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              Ressources ({cours.ressources.length})
            </h3>
            <div className="space-y-3">
              {cours.ressources.map(ressource => (
                <div key={ressource.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{ressource.nom}</div>
                      <div className="text-sm text-neutral-600 flex items-center gap-2">
                        {ressource.type.toUpperCase()}
                        {ressource.taille && ` • ${ressource.taille}`}
                        {ressource.obligatoire && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Obligatoire
                          </span>
                        )}
                        {ressource.consulte && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Consulté
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!ressource.consulte && (
                      <button className="p-2 text-primary-600 hover:text-primary-800 rounded-lg hover:bg-primary-50">
                        <PlayCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-neutral-500 hover:text-neutral-700 rounded-lg hover:bg-neutral-100">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {cours.notes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Mes notes ({cours.notes.length})
              </h3>
              <div className="space-y-3">
                {cours.notes.map(note => (
                  <div key={note.id} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-neutral-900">{note.type}</h4>
                      <span className={`text-lg font-bold ${getNoteColor(note.note, note.max)}`}>
                        {note.note}/{note.max}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-neutral-600">
                      <span>{new Date(note.date).toLocaleDateString('fr-FR')}</span>
                      <span>Coefficient: {note.coefficient}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Devoirs */}
          {devoirsCours.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Devoirs ({devoirsCours.length})
              </h3>
              <div className="space-y-3">
                {devoirsCours.map(devoir => (
                  <div key={devoir.id} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-neutral-900">{devoir.titre}</h4>
                        <p className="text-sm text-neutral-600">{devoir.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutDevoirColor(devoir.statut)}`}>
                        {devoir.statut === "a_faire" ? "À faire" :
                         devoir.statut === "rendu" ? "Rendu" :
                         devoir.statut === "corrige" ? "Corrigé" : "En retard"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-neutral-600">
                      <span>À rendre: {new Date(devoir.dateRendu).toLocaleDateString('fr-FR')}</span>
                      {devoir.note && (
                        <span className="font-medium">Note: {devoir.note}/20</span>
                      )}
                    </div>
                    {devoir.commentaire && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                        {devoir.commentaire}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Composant Planning des cours
const PlanningCours: React.FC<{ cours: Cours[] }> = ({ cours }) => {
  const joursOrdre = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
  
  // Simulation d'un planning hebdomadaire
  const planningMock = {
    lundi: [
      { cours: cours[0], heure: "08:00-09:30", salle: "A101" },
      { cours: cours[2], heure: "14:00-15:30", salle: "B205" }
    ],
    mardi: [
      { cours: cours[1], heure: "10:00-11:30", salle: "A101" }
    ],
    mercredi: [
      { cours: cours[0], heure: "09:00-10:30", salle: "A103" }
    ],
    jeudi: [
      { cours: cours[2], heure: "08:00-09:30", salle: "B205" },
      { cours: cours[1], heure: "15:00-16:30", salle: "A101" }
    ],
    vendredi: [
      { cours: cours[0], heure: "11:00-12:30", salle: "A101" }
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {joursOrdre.map(jour => (
        <div key={jour} className="space-y-2">
          <h4 className="font-medium text-neutral-900 text-center py-2 bg-neutral-50 rounded-lg capitalize">
            {jour}
          </h4>
          
          <div className="space-y-2 min-h-[300px]">
            {planningMock[jour as keyof typeof planningMock]?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm"
              >
                <div className="font-medium text-primary-900 mb-1">
                  {item.heure}
                </div>
                <div className="text-primary-800 mb-1 line-clamp-2">
                  {item.cours.titre}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary-600">{item.cours.professeur}</span>
                  <span className="text-primary-600">{item.salle}</span>
                </div>
              </motion.div>
            )) || (
              <div className="flex items-center justify-center h-20 text-neutral-400 text-sm">
                Aucun cours
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant Tableau de Bord Rapide
const TableauBordRapide: React.FC<{ cours: Cours[]; devoirs: Devoir[] }> = ({ cours, devoirs }) => {
  const coursEnCours = cours.filter(c => c.statut === "en_cours").length;
  const moyenneGenerale = cours.filter(c => c.moyenne).reduce((acc, c) => acc + (c.moyenne || 0), 0) / cours.filter(c => c.moyenne).length;
  const devoirsAFaire = devoirs.filter(d => d.statut === "a_faire").length;
  const prochainCours = cours
    .filter(c => c.prochaineCeance && c.statut === "en_cours")
    .sort((a, b) => new Date(a.prochaineCeance!).getTime() - new Date(b.prochaineCeance!).getTime())[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-primary-600">Cours actifs</p>
            <p className="text-2xl font-bold text-primary-900">{coursEnCours}</p>
            <p className="text-xs text-primary-600">En cours</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-green-600">Moyenne générale</p>
            <p className="text-2xl font-bold text-green-900">{moyenneGenerale.toFixed(1)}</p>
            <p className="text-xs text-green-600">Sur 20</p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-orange-600">Devoirs à faire</p>
            <p className="text-2xl font-bold text-orange-900">{devoirsAFaire}</p>
            <p className="text-xs text-orange-600">En attente</p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-purple-600">Prochain cours</p>
            {prochainCours ? (
              <>
                <p className="text-lg font-bold text-purple-900">
                  {new Date(prochainCours.prochaineCeance!).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })}
                </p>
                <p className="text-xs text-purple-600">{prochainCours.matiere}</p>
              </>
            ) : (
              <p className="text-lg font-bold text-purple-900">Aucun</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const MesCours: React.FC = () => {
  const [ongletActif, setOngletActif] = useState<"apercu" | "cours" | "planning">("apercu");
  const [cours] = useState<Cours[]>(coursMock);
  const [devoirs] = useState<Devoir[]>(devoirsMock);
  const [coursSelectionne, setCoursSelectionne] = useState<Cours | null>(null);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [filtreMatiere, setFiltreMatiere] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");

  // Filtrage des cours
  const coursFiltres = cours.filter(c => {
    const matchTexte = c.titre.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      c.description.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchMatiere = !filtreMatiere || c.matiere === filtreMatiere;
    const matchStatut = !filtreStatut || c.statut === filtreStatut;
    
    return matchTexte && matchMatiere && matchStatut;
  });

  const handleVoirCours = (cours: Cours) => {
    setCoursSelectionne(cours);
    setShowModalDetails(true);
  };

  const resetFiltres = () => {
    setRechercheTexte("");
    setFiltreMatiere("");
    setFiltreStatut("");
  };

  const matieres = [...new Set(cours.map(c => c.matiere))];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mes cours</h1>
          <p className="text-neutral-600 mt-1">
            Suivez votre progression et accédez à vos ressources pédagogiques
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Contacter prof
          </button>
        </div>
      </div>

      {/* Tableau de bord rapide */}
      <TableauBordRapide cours={cours} devoirs={devoirs} />

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setOngletActif("apercu")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              ongletActif === "apercu"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Aperçu général
            </div>
          </button>
          <button
            onClick={() => setOngletActif("cours")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              ongletActif === "cours"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Tous mes cours ({coursFiltres.length})
            </div>
          </button>
          <button
            onClick={() => setOngletActif("planning")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              ongletActif === "planning"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Planning
            </div>
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {ongletActif === "apercu" && (
              <motion.div
                key="apercu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Cours en cours */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Cours en cours</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {cours
                      .filter(c => c.statut === "en_cours")
                      .slice(0, 4)
                      .map(cours => (
                        <CarteCoursEleve
                          key={cours.id}
                          cours={cours}
                          onVoir={handleVoirCours}
                        />
                      ))}
                  </div>
                </div>

                {/* Planning de la semaine */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Planning de la semaine</h3>
                  <PlanningCours cours={cours} />
                </div>

                {/* Devoirs à faire */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Devoirs à faire</h3>
                  <div className="space-y-3">
                    {devoirs
                      .filter(d => d.statut === "a_faire")
                      .map(devoir => {
                        const coursDevoir = cours.find(c => c.id === devoir.coursId);
                        return (
                          <div key={devoir.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-neutral-900">{devoir.titre}</h4>
                                <p className="text-sm text-neutral-600">{devoir.description}</p>
                                <p className="text-xs text-orange-600 mt-1">
                                  {coursDevoir?.matiere} • {coursDevoir?.professeur}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-orange-800">
                                  {new Date(devoir.dateRendu).toLocaleDateString('fr-FR')}
                                </p>
                                <p className="text-xs text-orange-600">
                                  {Math.max(0, Math.ceil((new Date(devoir.dateRendu).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} jours
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}

            {ongletActif === "cours" && (
              <motion.div
                key="cours"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Barre de recherche et filtres */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Rechercher un cours par titre ou description..."
                        value={rechercheTexte}
                        onChange={(e) => setRechercheTexte(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={filtreMatiere}
                      onChange={(e) => setFiltreMatiere(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Toutes les matières</option>
                      {matieres.map(matiere => (
                        <option key={matiere} value={matiere}>{matiere}</option>
                      ))}
                    </select>

                    <select
                      value={filtreStatut}
                      onChange={(e) => setFiltreStatut(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="en_cours">En cours</option>
                      <option value="termine">Terminé</option>
                      <option value="a_venir">À venir</option>
                    </select>

                    {(rechercheTexte || filtreMatiere || filtreStatut) && (
                      <button
                        onClick={resetFiltres}
                        className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </div>

                {/* Liste des cours */}
                {coursFiltres.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {coursFiltres.map(cours => (
                      <CarteCoursEleve
                        key={cours.id}
                        cours={cours}
                        onVoir={handleVoirCours}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      {rechercheTexte || filtreMatiere || filtreStatut 
                        ? "Aucun cours trouvé" 
                        : "Aucun cours disponible"}
                    </h3>
                    <p className="text-neutral-600">
                      {rechercheTexte || filtreMatiere || filtreStatut
                        ? "Aucun cours ne correspond à vos critères de recherche."
                        : "Vos cours apparaîtront ici une fois qu'ils seront assignés par vos professeurs."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {ongletActif === "planning" && (
              <motion.div
                key="planning"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PlanningCours cours={cours} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal détails cours */}
      <AnimatePresence>
        {showModalDetails && coursSelectionne && (
          <ModalDetailsCours
            key={coursSelectionne.id}
            cours={coursSelectionne}
            devoirs={devoirs}
            onClose={() => {
              setShowModalDetails(false);
              setCoursSelectionne(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MesCours;