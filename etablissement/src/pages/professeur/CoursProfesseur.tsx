import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, Calendar, Clock, MapPin, Target,
  TrendingUp, CheckCircle, AlertCircle, Eye, Edit,
  FileText, PlayCircle, PauseCircle, Award, BarChart,
  Plus, Search, Filter, Download, Upload, MessageSquare,
  ChevronRight, Star, Bookmark, Settings, RefreshCw,
  UserCheck, GraduationCap, ChevronDown, Bell, X
} from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { Cours, Ressource } from "../../models/cours.model";
import { Classe } from "../../models/classe.model";

// Interfaces locales pour les fonctionnalités spécifiques au professeur
interface AssignationCours {
  id: number;
  coursId: number;
  classeId: number;
  dateDebut: string;
  dateFin?: string;
  heuresParSemaine: number;
  salle?: string;
  creneaux: Creneau[];
  progression: number;
  statut: "planifie" | "en_cours" | "termine" | "annule";
  notes?: string;
  prochaineCeance?: string;
}

interface Creneau {
  jour: "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi";
  heureDebut: string;
  heureFin: string;
  salle?: string;
}

interface ProgressionSeance {
  id: number;
  assignationId: number;
  date: string;
  sujet: string;
  objectifs: string[];
  ressourcesUtilisees: number[];
  notesProf: string;
  presences: number;
  evaluations?: {
    type: string;
    notes: number[];
    moyenne: number;
  };
}

// Données mockées
const professeurActuel = {
  id: 1,
  nom: "Diop",
  prenom: "Fatou",
  email: "f.diop@ecole.sn",
  matieres: ["Mathématiques", "Sciences"],
  statut: "actif"
};

const coursMock: Cours[] = [
  {
    id: 1,
    titre: "Les équations du premier degré",
    description: "Introduction aux équations linéaires et méthodes de résolution avec applications pratiques",
    matiereId: 1,
    classeId: 1,
    professeurId: 1,
    anneeScolaireId: 1,
    semestresIds: [1],
    heuresParSemaine: 3,
    objectifs: [
      "Résoudre une équation simple à une inconnue",
      "Identifier et isoler les inconnues",
      "Vérifier la validité d'une solution",
      "Appliquer les équations à des problèmes concrets"
    ],
    prerequis: ["Calculs avec les nombres relatifs", "Propriétés des opérations"],
    dateCreation: "2024-07-01",
    dateModification: "2024-07-15",
    statut: "en_cours",
    coefficient: 2,
    ressources: [
      {
        id: 1,
        nom: "Cours - Equations premier degré.pdf",
        type: "pdf",
        url: "#",
        taille: "2.3 MB",
        obligatoire: true,
        dateAjout: "2024-07-01"
      },
      {
        id: 2,
        nom: "Exercices d'application",
        type: "pdf",
        url: "#",
        taille: "1.8 MB",
        obligatoire: false,
        dateAjout: "2024-07-05"
      }
    ]
  },
  {
    id: 2,
    titre: "Géométrie : Les triangles",
    description: "Étude des propriétés des triangles, classification et théorèmes fondamentaux",
    matiereId: 1,
    classeId: 2,
    professeurId: 1,
    anneeScolaireId: 1,
    semestresIds: [1],
    heuresParSemaine: 4,
    objectifs: [
      "Identifier les différents types de triangles",
      "Appliquer le théorème de Pythagore",
      "Calculer périmètres et aires",
      "Résoudre des problèmes géométriques"
    ],
    dateCreation: "2024-06-20",
    statut: "en_cours",
    coefficient: 3
  },
  {
    id: 3,
    titre: "Fractions et décimaux",
    description: "Manipulation des fractions, conversion et opérations avec les nombres décimaux",
    matiereId: 1,
    classeId: 3,
    professeurId: 1,
    anneeScolaireId: 1,
    semestresIds: [1],
    heuresParSemaine: 2,
    objectifs: [
      "Convertir fractions en décimaux",
      "Effectuer les quatre opérations",
      "Comparer et ordonner les nombres"
    ],
    dateCreation: "2024-06-15",
    statut: "planifie",
    coefficient: 1
  }
];

const classesMock: Classe[] = [
  { 
    id: 1, 
    nom: "6ème A", 
    niveauId: 3, 
    niveauNom: "6ème",
    anneesScolaires: [{
      id: 1,
      classeId: 1,
      anneeScolaireId: 1,
      anneeScolaireNom: "2023-2024",
      elevesIds: [],
      effectif: 28,
      effectifMax: 30,
      professeurPrincipalId: 1,
      professeurPrincipalNom: "M. Fall",
      profsMatieres: [],
      description: "Classe de 6ème A",
      statut: "active",
      dateCreation: "2024-01-01"
    }],
    description: "Classe de 6ème A",
    dateCreation: "2024-01-01",
    statut: "active" 
  },
  { 
    id: 2, 
    nom: "5ème B", 
    niveauId: 2, 
    niveauNom: "5ème",
    anneesScolaires: [{
      id: 2,
      classeId: 2,
      anneeScolaireId: 1,
      anneeScolaireNom: "2023-2024",
      elevesIds: [],
      effectif: 25,
      effectifMax: 30,
      professeurPrincipalId: 2,
      professeurPrincipalNom: "Mme Ndiaye",
      profsMatieres: [],
      description: "Classe de 5ème B",
      statut: "active",
      dateCreation: "2024-01-01"
    }],
    description: "Classe de 5ème B",
    dateCreation: "2024-01-01",
    statut: "active" 
  },
  { 
    id: 3, 
    nom: "5ème C", 
    niveauId: 2, 
    niveauNom: "5ème",
    anneesScolaires: [{
      id: 3,
      classeId: 3,
      anneeScolaireId: 1,
      anneeScolaireNom: "2023-2024",
      elevesIds: [],
      effectif: 27,
      effectifMax: 30,
      professeurPrincipalId: 3,
      professeurPrincipalNom: "M. Diouf",
      profsMatieres: [],
      description: "Classe de 5ème C",
      statut: "active",
      dateCreation: "2024-01-01"
    }],
    description: "Classe de 5ème C",
    dateCreation: "2024-01-01",
    statut: "active" 
  }
];

const assignationsMock: AssignationCours[] = [
  {
    id: 1,
    coursId: 1,
    classeId: 1,
    dateDebut: "2024-07-15",
    dateFin: "2024-08-15",
    heuresParSemaine: 3,
    salle: "A101",
    creneaux: [
      { jour: "lundi", heureDebut: "08:00", heureFin: "09:30", salle: "A101" },
      { jour: "mercredi", heureDebut: "10:00", heureFin: "11:30", salle: "A101" }
    ],
    progression: 65,
    statut: "en_cours",
    prochaineCeance: "2024-07-22T08:00:00",
    notes: "Classe motivée, bon niveau général"
  },
  {
    id: 2,
    coursId: 2,
    classeId: 2,
    dateDebut: "2024-07-10",
    dateFin: "2024-08-20",
    heuresParSemaine: 4,
    salle: "B205",
    creneaux: [
      { jour: "mardi", heureDebut: "09:00", heureFin: "10:30", salle: "B205" },
      { jour: "jeudi", heureDebut: "14:00", heureFin: "15:30", salle: "B205" }
    ],
    progression: 40,
    statut: "en_cours",
    prochaineCeance: "2024-07-23T09:00:00",
    notes: "Quelques difficultés sur les théorèmes"
  },
  {
    id: 3,
    coursId: 1,
    classeId: 3,
    dateDebut: "2024-08-01",
    heuresParSemaine: 2,
    salle: "A103",
    creneaux: [
      { jour: "vendredi", heureDebut: "11:00", heureFin: "12:30", salle: "A103" }
    ],
    progression: 0,
    statut: "planifie",
    prochaineCeance: "2024-08-02T11:00:00"
  }
];

// Composant Carte de Cours Professeur
const CarteCoursProf: React.FC<{
  cours: Cours;
  assignations: AssignationCours[];
  classes: Classe[];
  onVoir: (cours: Cours) => void;
  onModifier?: (cours: Cours) => void;
}> = ({ cours, assignations, classes, onVoir, onModifier }) => {
  
  const assignationsCours = assignations.filter(a => a.coursId === cours.id);
  const assignationsActives = assignationsCours.filter(a => a.statut === "en_cours");
  
  const progressionMoyenne = assignationsCours.length > 0 
    ? Math.round(assignationsCours.reduce((acc, a) => acc + a.progression, 0) / assignationsCours.length)
    : 0;

  const prochaineCeance = assignationsCours
    .filter(a => a.prochaineCeance && a.statut === "en_cours")
    .sort((a, b) => new Date(a.prochaineCeance!).getTime() - new Date(b.prochaineCeance!).getTime())[0];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "en_cours": return "bg-green-100 text-green-800";
      case "planifie": return "bg-blue-100 text-blue-800";
      case "termine": return "bg-gray-100 text-gray-800";
      case "annule": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{cours.titre}</h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{cours.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Mathématiques {/* TODO: Récupérer le nom de la matière via matiereId */}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {cours.heuresParSemaine}h/sem
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {assignationsCours.length} classe{assignationsCours.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(cours.statut)}`}>
            {cours.statut === "en_cours" ? "En cours" : 
             cours.statut === "planifie" ? "Planifié" : 
             cours.statut === "termine" ? "Terminé" : "Annulé"}
          </span>
          {assignationsActives.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {assignationsActives.length} active{assignationsActives.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Progression globale */}
      {assignationsCours.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression globale</span>
            <span className="text-sm text-gray-600">{progressionMoyenne}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressionMoyenne}%` }}
            />
          </div>
        </div>
      )}

      {/* Prochaine séance */}
      {prochaineCeance && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Prochaine séance</span>
          </div>
          <div className="text-sm text-blue-700">
            {formatDate(prochaineCeance.prochaineCeance!)}
            {prochaineCeance.salle && ` - Salle ${prochaineCeance.salle}`}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Classe: {classes.find(c => c.id === prochaineCeance.classeId)?.nom}
          </div>
        </div>
      )}

      {/* Classes assignées */}
      {assignationsCours.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">
            Classes assignées ({assignationsCours.length})
          </span>
          <div className="space-y-2">
            {assignationsCours.slice(0, 3).map((assignation) => {
              const classe = classes.find(c => c.id === assignation.classeId);
              if (!classe) return null;
              
              return (
                <div key={assignation.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{classe.nom}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      assignation.statut === "en_cours" ? "bg-green-100 text-green-700" :
                      assignation.statut === "planifie" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {assignation.statut === "en_cours" ? "En cours" :
                       assignation.statut === "planifie" ? "Planifié" : "Terminé"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{assignation.progression}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full"
                        style={{ width: `${assignation.progression}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {assignationsCours.length > 3 && (
              <div className="text-xs text-gray-500">
                +{assignationsCours.length - 3} autres classes
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ressources */}
      {cours.ressources && cours.ressources.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">
            Ressources ({cours.ressources.length})
          </span>
          <div className="flex gap-1 flex-wrap">
            {cours.ressources.slice(0, 3).map(ressource => (
              <span key={ressource.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {ressource.type.toUpperCase()}
              </span>
            ))}
            {cours.ressources.length > 3 && (
              <span className="text-xs text-gray-500">+{cours.ressources.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onVoir(cours)}
          className="flex-1 py-2 px-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Voir détails
        </button>
        {onModifier && (
          <button
            onClick={() => onModifier(cours)}
            className="py-2 px-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        <button className="py-2 px-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <FileText className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Composant Planning Hebdomadaire
const PlanningHebdomadaire: React.FC<{
  assignations: AssignationCours[];
  cours: Cours[];
  classes: Classe[];
}> = ({ assignations, cours, classes }) => {
  
  const joursOrdre = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const assignationsActives = assignations.filter(a => a.statut === "en_cours");

  const creneauxParJour = joursOrdre.reduce((acc, jour) => {
    acc[jour] = [];
    assignationsActives.forEach(assignation => {
      const coursInfo = cours.find(c => c.id === assignation.coursId);
      const classeInfo = classes.find(c => c.id === assignation.classeId);
      
      assignation.creneaux
        .filter(creneau => creneau.jour === jour)
        .forEach(creneau => {
          acc[jour].push({
            assignation,
            creneau,
            cours: coursInfo,
            classe: classeInfo
          });
        });
    });
    
    // Trier par heure de début
    acc[jour].sort((a, b) => a.creneau.heureDebut.localeCompare(b.creneau.heureDebut));
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Planning de la semaine</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {joursOrdre.map(jour => (
          <div key={jour} className="space-y-2">
            <h4 className="font-medium text-gray-900 text-center py-2 bg-gray-50 rounded-lg capitalize">
              {jour}
            </h4>
            
            <div className="space-y-2 min-h-[200px]">
              {creneauxParJour[jour].length > 0 ? (
                creneauxParJour[jour].map((item, index) => (
                  <motion.div
                    key={item.assignation.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm"
                  >
                    <div className="font-medium text-blue-900 mb-1">
                      {item.creneau.heureDebut} - {item.creneau.heureFin}
                    </div>
                    <div className="text-blue-800 mb-1 line-clamp-2">
                      {item.cours?.titre}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600">{item.classe?.nom}</span>
                      {item.creneau.salle && (
                        <span className="text-blue-600">{item.creneau.salle}</span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
                  Aucun cours
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant Modal Détails Cours
const ModalDetailsCours: React.FC<{
  cours: Cours;
  assignations: AssignationCours[];
  classes: Classe[];
  onClose: () => void;
}> = ({ cours, assignations, classes, onClose }) => {
  
  const assignationsCours = assignations.filter(a => a.coursId === cours.id);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{cours.titre}</h2>
              <p className="text-gray-600 mt-1">Matière ID: {cours.matiereId} • Classe ID: {cours.classeId}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{cours.description}</p>
          </div>

          {/* Objectifs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Objectifs pédagogiques ({cours.objectifs.length})
            </h3>
            <div className="space-y-2">
              {cours.objectifs.map((objectif, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{objectif}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prérequis */}
          {cours.prerequis && cours.prerequis.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Prérequis</h3>
              <div className="space-y-2">
                {cours.prerequis.map((prerequis, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{prerequis}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ressources */}
          {cours.ressources && cours.ressources.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ressources ({cours.ressources.length})
              </h3>
              <div className="space-y-3">
                {cours.ressources.map(ressource => (
                  <div key={ressource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{ressource.nom}</div>
                        <div className="text-sm text-gray-600">
                          {ressource.type.toUpperCase()}
                          {ressource.taille && ` • ${ressource.taille}`}
                          {ressource.obligatoire && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              Obligatoire
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignations */}
          {assignationsCours.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Classes assignées ({assignationsCours.length})
              </h3>
              <div className="space-y-3">
                {assignationsCours.map(assignation => {
                  const classe = classes.find(c => c.id === assignation.classeId);
                  if (!classe) return null;
                  
                  return (
                    <div key={assignation.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{classe.nom}</h4>
                          <p className="text-sm text-gray-600">{classe.anneesScolaires[0]?.effectif || 0} élèves</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Progression</div>
                          <div className="font-medium text-gray-900">{assignation.progression}%</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${assignation.progression}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Période:</span>
                          <p className="font-medium">
                            {new Date(assignation.dateDebut).toLocaleDateString('fr-FR')}
                            {assignation.dateFin && ` - ${new Date(assignation.dateFin).toLocaleDateString('fr-FR')}`}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Volume:</span>
                          <p className="font-medium">{assignation.heuresParSemaine}h/semaine</p>
                        </div>
                      </div>

                      {assignation.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <span className="text-sm text-yellow-800">{assignation.notes}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coefficient */}
          {cours.coefficient && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Coefficient</h3>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="font-medium text-purple-900">{cours.coefficient}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Composant Tableau de Bord Rapide
const TableauBordRapide: React.FC<{
  cours: Cours[];
  assignations: AssignationCours[];
  classes: Classe[];
}> = ({ cours, assignations, classes }) => {
  
  const coursPublies = cours.filter(c => c.statut === "en_cours").length;
  const assignationsActives = assignations.filter(a => a.statut === "en_cours").length;
  const progressionMoyenne = assignations.length > 0 
    ? Math.round(assignations.reduce((acc, a) => acc + a.progression, 0) / assignations.length)
    : 0;
  
  const prochaineCeance = assignations
    .filter(a => a.prochaineCeance && a.statut === "en_cours")
    .sort((a, b) => new Date(a.prochaineCeance!).getTime() - new Date(b.prochaineCeance!).getTime())[0];

  const formatDateProchaine = (dateStr: string) => {
    const date = new Date(dateStr);
    const aujourd = new Date();
    const diffJours = Math.ceil((date.getTime() - aujourd.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffJours === 0) return "Aujourd'hui";
    if (diffJours === 1) return "Demain";
    if (diffJours < 7) return `Dans ${diffJours} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-600">Mes cours</p>
            <p className="text-2xl font-bold text-blue-900">{cours.length}</p>
            <p className="text-xs text-blue-600">{coursPublies} publiés</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-green-600">Classes actives</p>
            <p className="text-2xl font-bold text-green-900">{assignationsActives}</p>
            <p className="text-xs text-green-600">En cours</p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-purple-600">Progression</p>
            <p className="text-2xl font-bold text-purple-900">{progressionMoyenne}%</p>
            <p className="text-xs text-purple-600">Moyenne générale</p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-orange-600">Prochain cours</p>
            {prochaineCeance ? (
              <>
                <p className="text-lg font-bold text-orange-900">
                  {formatDateProchaine(prochaineCeance.prochaineCeance!)}
                </p>
                <p className="text-xs text-orange-600">
                  {classes.find(c => c.id === prochaineCeance.classeId)?.nom}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-orange-900">Aucun</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const CoursProfesseur: React.FC = () => {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const [ongletActif, setOngletActif] = useState<"apercu" | "cours" | "planning">("apercu");
  const [cours, setCours] = useState<Cours[]>(coursMock);
  const [classes, setClasses] = useState<Classe[]>(classesMock);
  const [assignations, setAssignations] = useState<AssignationCours[]>(assignationsMock);
  const [coursSelectionne, setCoursSelectionne] = useState<Cours | null>(null);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreNiveau, setFiltreNiveau] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Vérification des autorisations
  useEffect(() => {
    if (utilisateur?.role !== "professeur") {
      navigate("/dashboard", { replace: true });
    }
  }, [utilisateur, navigate]);

  // Filtrage des cours du professeur
  const coursFiltres = cours.filter(c => {
    const matchProfesseur = c.professeurId === professeurActuel.id;
    const matchTexte = c.titre.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      c.description.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchStatut = !filtreStatut || c.statut === filtreStatut;
    const matchNiveau = !filtreNiveau; // TODO: Implémenter le filtrage par niveau basé sur classeId
    
    return matchProfesseur && matchTexte && matchStatut && matchNiveau;
  });

  const handleVoirCours = (cours: Cours) => {
    setCoursSelectionne(cours);
    setShowModalDetails(true);
  };

  const handleModifierCours = (cours: Cours) => {
    // Redirection vers la page d'édition ou ouverture d'un modal d'édition
    console.log("Modifier cours:", cours);
  };

  const resetFiltres = () => {
    setRechercheTexte("");
    setFiltreStatut("");
    setFiltreNiveau("");
  };

  if (!utilisateur) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes cours</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos cours et suivez la progression de vos classes, {professeurActuel.prenom} {professeurActuel.nom}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importer
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau cours
            </button>
          </div>
        </div>

        {/* Tableau de bord rapide */}
        <TableauBordRapide 
          cours={coursFiltres}
          assignations={assignations}
          classes={classes}
        />

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setOngletActif("apercu")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                ongletActif === "apercu"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
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
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Mes cours ({coursFiltres.length})
              </div>
            </button>
            
            <button
              onClick={() => setOngletActif("planning")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                ongletActif === "planning"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
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
                  {/* Cours récents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cours récemment modifiés</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {coursFiltres
                        .sort((a, b) => new Date(b.dateModification || b.dateCreation).getTime() - 
                                       new Date(a.dateModification || a.dateCreation).getTime())
                        .slice(0, 4)
                        .map(cours => (
                          <CarteCoursProf
                            key={cours.id}
                            cours={cours}
                            assignations={assignations}
                            classes={classes}
                            onVoir={handleVoirCours}
                            onModifier={handleModifierCours}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Planning de la semaine */}
                  <PlanningHebdomadaire
                    assignations={assignations}
                    cours={cours}
                    classes={classes}
                  />
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher un cours par titre ou description..."
                          value={rechercheTexte}
                          onChange={(e) => setRechercheTexte(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={filtreStatut}
                        onChange={(e) => setFiltreStatut(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Tous les statuts</option>
                        <option value="brouillon">Brouillon</option>
                        <option value="publie">Publié</option>
                        <option value="archive">Archivé</option>
                      </select>

                      <select
                        value={filtreNiveau}
                        onChange={(e) => setFiltreNiveau(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Tous les niveaux</option>
                        {["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"].map(niveau => (
                          <option key={niveau} value={niveau}>{niveau}</option>
                        ))}
                      </select>

                      {(rechercheTexte || filtreStatut || filtreNiveau) && (
                        <button
                          onClick={resetFiltres}
                          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
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
                        <CarteCoursProf
                          key={cours.id}
                          cours={cours}
                          assignations={assignations}
                          classes={classes}
                          onVoir={handleVoirCours}
                          onModifier={handleModifierCours}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {rechercheTexte || filtreStatut || filtreNiveau 
                          ? "Aucun cours trouvé" 
                          : "Aucun cours créé"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {rechercheTexte || filtreStatut || filtreNiveau
                          ? "Aucun cours ne correspond à vos critères de recherche."
                          : "Commencez par créer votre premier cours."}
                      </p>
                      {!rechercheTexte && !filtreStatut && !filtreNiveau && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                          <Plus className="w-4 h-4" />
                          Créer mon premier cours
                        </button>
                      )}
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
                  <PlanningHebdomadaire
                    assignations={assignations}
                    cours={cours}
                    classes={classes}
                  />
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
              assignations={assignations}
              classes={classes}
              onClose={() => {
                setShowModalDetails(false);
                setCoursSelectionne(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default CoursProfesseur;