import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit, Trash2, Users, BookOpen, 
  GraduationCap, Calendar, Save, X, Eye, ChevronDown,
  UserCheck, Clock, MapPin, AlertCircle, CheckCircle, School,
  FileText, Target, PlayCircle, PauseCircle, Zap, Award,
  ChevronRight, Globe, BarChart, TrendingUp, Bookmark,
  CheckSquare, Square
} from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { Cours, Ressource } from "../../models/cours.model";
import { Classe } from "../../models/classe.model";
import { Utilisateur } from "../../models/utilisateur.model";

// Interfaces locales pour les fonctionnalités spécifiques au gestionnaire
interface AssignationCours {
  id: number;
  coursId: number;
  classeId: number;
  dateDebut: string;
  dateFin?: string;
  heuresParSemaine: number;
  salle?: string;
  creneaux: Creneau[];
  progression: number; // 0-100
  statut: "planifie" | "en_cours" | "termine" | "annule";
  notes?: string;
}

interface Creneau {
  jour: "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi";
  heureDebut: string;
  heureFin: string;
  salle?: string;
}

// Type alias pour les professeurs
type Professeur = Utilisateur;

// Constantes
const matieresList = [
  "Mathématiques", "Français", "Histoire-Géographie", "Sciences",
  "Anglais", "Espagnol", "Allemand", "EPS", "Arts plastiques",
  "Musique", "Technologie", "SVT", "Physique-Chimie"
];

const niveauxList = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"];

const joursList: Creneau["jour"][] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

// Données mockées
const coursMock: Cours[] = [
  {
    id: 1,
    titre: "Les équations du premier degré",
    description: "Introduction aux équations linéaires et méthodes de résolution",
    matiereId: 1,
    classeId: 1,
    professeurId: 1,
    anneeScolaireId: 1,
    semestresIds: [1],
    heuresParSemaine: 3,
    objectifs: ["Résoudre une équation simple", "Identifier les inconnues", "Vérifier une solution"],
    prerequis: ["Calculs avec les nombres relatifs"],
    dateCreation: "2024-07-01",
    statut: "en_cours",
    coefficient: 2
  },
  {
    id: 2,
    titre: "La Révolution française",
    description: "Étude des causes et conséquences de la Révolution de 1789",
    matiereId: 2,
    classeId: 2,
    professeurId: 2,
    anneeScolaireId: 1,
    semestresIds: [1, 2],
    heuresParSemaine: 4,
    objectifs: ["Comprendre les causes", "Analyser les événements", "Situer dans le contexte"],
    dateCreation: "2024-06-28",
    statut: "en_cours",
    coefficient: 3
  }
];

const classesMock: Classe[] = [
  { 
    id: 1, 
    nom: "6ème A", 
    niveauId: 1, 
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
      description: "Classe de 6ème section A",
      statut: "active",
      dateCreation: "2024-01-01"
    }],
    description: "Classe de 6ème section A",
    dateCreation: "2024-01-01",
    dateModification: "2024-01-01",
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
      description: "Classe de 5ème section B",
      statut: "active",
      dateCreation: "2024-01-01"
    }],
    description: "Classe de 5ème section B",
    dateCreation: "2024-01-01",
    dateModification: "2024-01-01",
    statut: "active" 
  },
  { 
    id: 3, 
    nom: "4ème C", 
    niveauId: 3, 
    niveauNom: "4ème",
    anneesScolaires: [{
      id: 3,
      classeId: 3,
      anneeScolaireId: 1,
      anneeScolaireNom: "2023-2024",
      elevesIds: [],
      effectif: 30,
      effectifMax: 30,
      professeurPrincipalId: 3,
      professeurPrincipalNom: "M. Diouf",
      profsMatieres: [],
      description: "Classe de 4ème section C",
      statut: "active",
      dateCreation: "2024-01-01"
    }],
    description: "Classe de 4ème section C",
    dateCreation: "2024-01-01",
    dateModification: "2024-01-01",
    statut: "active" 
  }
];

const professeursMock: Professeur[] = [
  { 
    id: 1, 
    nom: "Diop", 
    prenom: "Fatou", 
    email: "f.diop@ecole.sn", 
    role: "professeur",
    dateCreation: "2024-01-01",
    dateModification: "2024-01-01",
    actif: true,
    derniereConnexion: "2024-07-01"
  },
  { 
    id: 2, 
    nom: "Ba", 
    prenom: "Moussa", 
    email: "m.ba@ecole.sn", 
    role: "professeur",
    dateCreation: "2024-01-01",
    dateModification: "2024-01-01",
    actif: true,
    derniereConnexion: "2024-07-01"
  }
];

const assignationsMock: AssignationCours[] = [
  {
    id: 1,
    coursId: 1,
    classeId: 1,
    dateDebut: "2024-07-15",
    dateFin: "2024-07-30",
    heuresParSemaine: 3,
    salle: "A101",
    creneaux: [
      { jour: "lundi", heureDebut: "08:00", heureFin: "09:30", salle: "A101" },
      { jour: "mercredi", heureDebut: "10:00", heureFin: "11:30", salle: "A101" }
    ],
    progression: 45,
    statut: "en_cours",
    notes: "Bon niveau général de la classe"
  }
];

// Composant Carte de Cours
const CarteCours: React.FC<{
  cours: Cours;
  professeurs: Professeur[];
  onEdit: (cours: Cours) => void;
  onDelete: (id: number) => void;
  onView: (cours: Cours) => void;
  onAssign: (cours: Cours) => void;
}> = ({ cours, professeurs, onEdit, onDelete, onView, onAssign }) => {
  const professeur = professeurs.find(p => p.id === cours.professeurId);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "en_cours": return "bg-green-100 text-green-800";
      case "planifie": return "bg-blue-100 text-blue-800";
      case "termine": return "bg-gray-100 text-gray-800";
      case "annule": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{cours.titre}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{cours.description}</p>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Matière {cours.matiereId} {/* TODO: Récupérer le nom de la matière */}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {cours.heuresParSemaine}h/sem
            </span>
            {professeur && (
              <span className="flex items-center gap-1">
                <UserCheck className="w-4 h-4" />
                {professeur.prenom} {professeur.nom}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Classe */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-sm text-gray-600">Classe:</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
          Classe {cours.classeId} {/* TODO: Récupérer le nom de la classe */}
        </span>
      </div>

      {/* Objectif principal */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Objectif principal
        </h4>
        <div className="space-y-1">
          {cours.objectifs.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Target className="w-3 h-3 mt-1 flex-shrink-0 text-green-500" />
              <span className="line-clamp-1">{cours.objectifs[0]}</span>
            </div>
          )}
          {cours.objectifs.length > 1 && (
            <div className="text-xs text-gray-500">
              +{cours.objectifs.length - 1} autres objectifs
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(cours)}
          className="flex-1 py-2 px-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Voir
        </button>
        <button
          onClick={() => onAssign(cours)}
          className="flex-1 py-2 px-3 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
        >
          <Users className="w-4 h-4" />
          Assigner
        </button>
        <button
          onClick={() => onEdit(cours)}
          className="py-2 px-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(cours.id)}
          className="py-2 px-3 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Composant Formulaire de Cours
const FormulaireCours: React.FC<{
  cours?: Cours;
  professeurs: Professeur[];
  classes: Classe[];
  onSave: (cours: Omit<Cours, "id"> & { id?: string }) => void;
  onCancel: () => void;
}> = ({ cours, professeurs, classes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titre: cours?.titre || "",
    description: cours?.description || "",
    matiereId: cours?.matiereId || 1,
    classeId: cours?.classeId || 1,
    professeurId: cours?.professeurId || 1,
    anneeScolaireId: cours?.anneeScolaireId || 1,
    semestresIds: cours?.semestresIds || [1],
    heuresParSemaine: cours?.heuresParSemaine || 3,
    objectifs: cours?.objectifs || [""],
    prerequis: cours?.prerequis || [],
    statut: cours?.statut || "planifie" as const,
    coefficient: cours?.coefficient || 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const ajouterObjectif = () => {
    setFormData(prev => ({
      ...prev,
      objectifs: [...prev.objectifs, ""]
    }));
  };

  const retirerObjectif = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectifs: prev.objectifs.filter((_, i) => i !== index)
    }));
  };

  const modifierObjectif = (index: number, valeur: string) => {
    setFormData(prev => ({
      ...prev,
      objectifs: prev.objectifs.map((obj, i) => i === index ? valeur : obj)
    }));
  };

  const validerFormulaire = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }
    if (!formData.matiereId || formData.matiereId === 0) {
      newErrors.matiereId = "La matière est requise";
    }
    if (!formData.classeId || formData.classeId === 0) {
      newErrors.classeId = "La classe est requise";
    }
    if (!formData.professeurId || formData.professeurId === 0) {
      newErrors.professeurId = "Un professeur doit être assigné";
    }
    if (formData.heuresParSemaine <= 0) {
      newErrors.heuresParSemaine = "Le nombre d'heures doit être positif";
    }

    const objectifsValides = formData.objectifs.filter(obj => obj.trim());
    if (objectifsValides.length === 0) {
      newErrors.objectifs = "Au moins un objectif est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validerFormulaire()) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const coursData = {
          ...formData,
          objectifs: formData.objectifs.filter(obj => obj.trim()),
          id: cours?.id?.toString(),
          dateCreation: cours?.dateCreation || new Date().toISOString().split('T')[0],
          dateModification: cours ? new Date().toISOString().split('T')[0] : undefined
        };

        onSave(coursData);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {cours ? "Modifier le cours" : "Nouveau cours"}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du cours *
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.titre ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Les équations du premier degré"
                disabled={isLoading}
              />
              {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matière *
              </label>
              <select
                value={formData.matiereId}
                onChange={(e) => setFormData(prev => ({ ...prev, matiereId: parseInt(e.target.value) || 1 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.matiereId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              >
                <option value={0}>Sélectionner une matière</option>
                {matieresList.map((matiere, index) => (
                  <option key={matiere} value={index + 1}>{matiere}</option>
                ))}
              </select>
              {errors.matiereId && <p className="text-red-500 text-xs mt-1">{errors.matiereId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professeur *
              </label>
              <select
                value={formData.professeurId}
                onChange={(e) => setFormData(prev => ({ ...prev, professeurId: parseInt(e.target.value) || 1 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.professeurId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              >
                <option value={0}>Sélectionner un professeur</option>
                {professeurs.filter(p => p.actif).map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.prenom} {prof.nom}
                  </option>
                ))}
              </select>
              {errors.professeurId && <p className="text-red-500 text-xs mt-1">{errors.professeurId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heures par semaine *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={formData.heuresParSemaine}
                onChange={(e) => setFormData(prev => ({ ...prev, heuresParSemaine: parseFloat(e.target.value) || 1 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.heuresParSemaine ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.heuresParSemaine && <p className="text-red-500 text-xs mt-1">{errors.heuresParSemaine}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coefficient
              </label>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={formData.coefficient}
                onChange={(e) => setFormData(prev => ({ ...prev, coefficient: parseFloat(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Décrivez le contenu et les grands axes du cours..."
            disabled={isLoading}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Classe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classe *
          </label>
          <select
            value={formData.classeId}
            onChange={(e) => setFormData(prev => ({ ...prev, classeId: parseInt(e.target.value) || 1 }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.classeId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          >
            <option value={0}>Sélectionner une classe</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>{classe.nom}</option>
            ))}
          </select>
          {errors.classeId && <p className="text-red-500 text-xs mt-1">{errors.classeId}</p>}
        </div>

        {/* Année scolaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année scolaire *
          </label>
          <select
            value={formData.anneeScolaireId}
            onChange={(e) => setFormData(prev => ({ ...prev, anneeScolaireId: parseInt(e.target.value) || 1 }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.anneeScolaireId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          >
            <option value={1}>2023-2024</option>
            <option value={2}>2024-2025</option>
          </select>
          {errors.anneeScolaireId && <p className="text-red-500 text-xs mt-1">{errors.anneeScolaireId}</p>}
        </div>

        {/* Semestres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semestres *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.semestresIds.includes(1)}
                onChange={(e) => {
                  const semestres = e.target.checked 
                    ? [...formData.semestresIds, 1]
                    : formData.semestresIds.filter(id => id !== 1);
                  setFormData(prev => ({ ...prev, semestresIds: semestres }));
                }}
                className="mr-2"
                disabled={isLoading}
              />
              Semestre 1
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.semestresIds.includes(2)}
                onChange={(e) => {
                  const semestres = e.target.checked 
                    ? [...formData.semestresIds, 2]
                    : formData.semestresIds.filter(id => id !== 2);
                  setFormData(prev => ({ ...prev, semestresIds: semestres }));
                }}
                className="mr-2"
                disabled={isLoading}
              />
              Semestre 2
            </label>
          </div>
          {errors.semestresIds && <p className="text-red-500 text-xs mt-1">{errors.semestresIds}</p>}
        </div>

        {/* Objectifs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Objectifs pédagogiques * ({formData.objectifs.filter(obj => obj.trim()).length})
            </label>
            <button
              type="button"
              onClick={ajouterObjectif}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Ajouter un objectif
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.objectifs.map((objectif, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={objectif}
                  onChange={(e) => modifierObjectif(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Objectif ${index + 1}`}
                  disabled={isLoading}
                />
                {formData.objectifs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => retirerObjectif(index)}
                    className="text-red-600 hover:text-red-700"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.objectifs && <p className="text-red-500 text-xs mt-1">{errors.objectifs}</p>}
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={formData.statut}
            onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="planifie">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Enregistrement..." : (cours ? "Modifier" : "Créer")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant Modal d'assignation
const ModalAssignation: React.FC<{
  cours: Cours;
  classes: Classe[];
  professeurs: Professeur[];
  assignations: AssignationCours[];
  onSave: (assignation: Omit<AssignationCours, "id">) => void;
  onClose: () => void;
}> = ({ cours, classes, professeurs, assignations, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    classeId: "",
    dateDebut: "",
    dateFin: "",
    heuresParSemaine: 2,
    salle: "",
    creneaux: [] as Creneau[],
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const classesCompatibles = classes.filter(classe => 
    classe.statut === "active"
  );

  const classesDejaAssignees = assignations
    .filter(a => a.coursId === cours.id && a.statut !== "annule")
    .map(a => a.classeId);

  const classesDisponibles = classesCompatibles.filter(c => 
    !classesDejaAssignees.includes(c.id)
  );

  const ajouterCreneau = () => {
    setFormData(prev => ({
      ...prev,
      creneaux: [...prev.creneaux, { jour: "lundi", heureDebut: "08:00", heureFin: "09:30" }]
    }));
  };

  const retirerCreneau = (index: number) => {
    setFormData(prev => ({
      ...prev,
      creneaux: prev.creneaux.filter((_, i) => i !== index)
    }));
  };

  const modifierCreneau = (index: number, field: keyof Creneau, value: string) => {
    setFormData(prev => ({
      ...prev,
      creneaux: prev.creneaux.map((creneau, i) => 
        i === index ? { ...creneau, [field]: value } : creneau
      )
    }));
  };

  const validerFormulaire = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.classeId) {
      newErrors.classeId = "Une classe doit être sélectionnée";
    }
    if (!formData.dateDebut) {
      newErrors.dateDebut = "La date de début est requise";
    }
    if (formData.heuresParSemaine <= 0) {
      newErrors.heuresParSemaine = "Le nombre d'heures doit être positif";
    }
    if (formData.creneaux.length === 0) {
      newErrors.creneaux = "Au moins un créneau doit être défini";
    }

    // Validation des créneaux
    formData.creneaux.forEach((creneau, index) => {
      if (creneau.heureDebut >= creneau.heureFin) {
        newErrors[`creneau_${index}`] = "L'heure de fin doit être après l'heure de début";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validerFormulaire()) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const assignation: Omit<AssignationCours, "id"> = {
          coursId: cours.id,
          classeId: parseInt(formData.classeId),
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin || undefined,
          heuresParSemaine: formData.heuresParSemaine,
          salle: formData.salle || undefined,
          creneaux: formData.creneaux,
          progression: 0,
          statut: "planifie",
          notes: formData.notes || undefined
        };

        onSave(assignation);
      } catch (error) {
        console.error("Erreur lors de l'assignation:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Assigner le cours</h2>
              <p className="text-sm text-gray-600 mt-1">{cours.titre}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sélection de la classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe *
            </label>
            {classesDisponibles.length > 0 ? (
              <select
                value={formData.classeId}
                onChange={(e) => setFormData(prev => ({ ...prev, classeId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.classeId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              >
                <option value="">Sélectionner une classe</option>
                {classesDisponibles.map(classe => (
                  <option key={classe.id} value={classe.id}>
                    {classe.nom} ({classe.anneesScolaires[0]?.effectif || 0} élèves)
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">
                  Aucune classe compatible disponible pour ce cours.
                  {classesDejaAssignees.length > 0 && " Certaines classes sont déjà assignées."}
                </p>
              </div>
            )}
            {errors.classeId && <p className="text-red-500 text-xs mt-1">{errors.classeId}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début *
              </label>
              <input
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateDebut ? "border-red-500" : "border-gray-300"
                }`}
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
              />
              {errors.dateDebut && <p className="text-red-500 text-xs mt-1">{errors.dateDebut}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin (optionnel)
              </label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={formData.dateDebut}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Configuration des créneaux */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Créneaux horaires * ({formData.creneaux.length})
              </label>
              <button
                type="button"
                onClick={ajouterCreneau}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
                Ajouter un créneau
              </button>
            </div>

            {formData.creneaux.length > 0 ? (
              <div className="space-y-3">
                {formData.creneaux.map((creneau, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
                    <div>
                      <select
                        value={creneau.jour}
                        onChange={(e) => modifierCreneau(index, "jour", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      >
                        {joursList.map(jour => (
                          <option key={jour} value={jour}>
                            {jour.charAt(0).toUpperCase() + jour.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="time"
                        value={creneau.heureDebut}
                        onChange={(e) => modifierCreneau(index, "heureDebut", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <input
                        type="time"
                        value={creneau.heureFin}
                        onChange={(e) => modifierCreneau(index, "heureFin", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={creneau.salle || ""}
                        onChange={(e) => modifierCreneau(index, "salle", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Salle"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => retirerCreneau(index)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {errors[`creneau_${index}`] && (
                      <div className="md:col-span-5">
                        <p className="text-red-500 text-xs">{errors[`creneau_${index}`]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucun créneau défini</p>
                <button
                  type="button"
                  onClick={ajouterCreneau}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  disabled={isLoading}
                >
                  Ajouter le premier créneau
                </button>
              </div>
            )}
            {errors.creneaux && <p className="text-red-500 text-xs mt-1">{errors.creneaux}</p>}
          </div>

          {/* Autres informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heures par semaine
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.heuresParSemaine}
                onChange={(e) => setFormData(prev => ({ ...prev, heuresParSemaine: parseInt(e.target.value) || 2 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.heuresParSemaine ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.heuresParSemaine && <p className="text-red-500 text-xs mt-1">{errors.heuresParSemaine}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salle principale
              </label>
              <input
                type="text"
                value={formData.salle}
                onChange={(e) => setFormData(prev => ({ ...prev, salle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: A101"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes particulières sur cette assignation..."
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || classesDisponibles.length === 0}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              {isLoading ? "Assignation..." : "Assigner le cours"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Composant Liste des Assignations
const ListeAssignations: React.FC<{
  assignations: AssignationCours[];
  cours: Cours[];
  classes: Classe[];
  professeurs: Professeur[];
  onUpdateProgression: (id: string, progression: number) => void;
  onChangeStatut: (id: string, statut: AssignationCours["statut"]) => void;
}> = ({ assignations, cours, classes, professeurs, onUpdateProgression, onChangeStatut }) => {

  const getCoursInfo = (coursId: number) => cours.find(c => c.id === coursId);
  const getClasseInfo = (classeId: number) => classes.find(c => c.id === classeId);
  const getProfesseurInfo = (profId: number) => professeurs.find(p => p.id === profId);

  const getStatutColor = (statut: AssignationCours["statut"]) => {
    switch (statut) {
      case "planifie": return "bg-blue-100 text-blue-800";
      case "en_cours": return "bg-green-100 text-green-800";
      case "termine": return "bg-gray-100 text-gray-800";
      case "annule": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateFr = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (assignations.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune assignation
        </h3>
        <p className="text-gray-600">
          Les cours assignés aux classes apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignations.map((assignation) => {
        const coursInfo = getCoursInfo(assignation.coursId);
        const classeInfo = getClasseInfo(assignation.classeId);
        const professeurInfo = coursInfo ? getProfesseurInfo(coursInfo.professeurId) : null;

        if (!coursInfo || !classeInfo) return null;

        return (
          <motion.div
            key={assignation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {coursInfo.titre}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <School className="w-4 h-4" />
                    {classeInfo.nom}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {matieresList[coursInfo.matiereId - 1] || 'Matière inconnue'}
                  </span>
                  {professeurInfo && (
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-4 h-4" />
                      {professeurInfo.prenom} {professeurInfo.nom}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(assignation.statut)}`}>
                  {assignation.statut === "planifie" ? "Planifié" :
                   assignation.statut === "en_cours" ? "En cours" :
                   assignation.statut === "termine" ? "Terminé" : "Annulé"}
                </span>

                <select
                  value={assignation.statut}
                  onChange={(e) => onChangeStatut(assignation.id.toString(), e.target.value as AssignationCours["statut"])}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planifie">Planifié</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600">Période:</span>
                <p className="font-medium">
                  {formatDateFr(assignation.dateDebut)}
                  {assignation.dateFin && ` - ${formatDateFr(assignation.dateFin)}`}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Volume horaire:</span>
                <p className="font-medium">{assignation.heuresParSemaine}h/semaine</p>
              </div>

              {assignation.salle && (
                <div>
                  <span className="text-sm text-gray-600">Salle:</span>
                  <p className="font-medium">{assignation.salle}</p>
                </div>
              )}
            </div>

            {/* Créneaux */}
            {assignation.creneaux.length > 0 && (
              <div className="mb-4">
                <span className="text-sm text-gray-600 block mb-2">Créneaux:</span>
                <div className="flex gap-2 flex-wrap">
                  {assignation.creneaux.map((creneau, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {creneau.jour.charAt(0).toUpperCase() + creneau.jour.slice(1)} {creneau.heureDebut}-{creneau.heureFin}
                      {creneau.salle && ` (${creneau.salle})`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {assignation.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 block mb-1">Notes:</span>
                <p className="text-sm text-gray-800">{assignation.notes}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// Composant principal
const CoursGestionnaire: React.FC = () => {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const [ongletActif, setOngletActif] = useState<"cours" | "assignations" | "nouveau">("cours");
  const [cours, setCours] = useState<Cours[]>(coursMock);
  const [classes, setClasses] = useState<Classe[]>(classesMock);
  const [professeurs, setProfesseurs] = useState<Professeur[]>(professeursMock);
  const [assignations, setAssignations] = useState<AssignationCours[]>(assignationsMock);
  const [coursSelectionne, setCoursSelectionne] = useState<Cours | null>(null);
  const [showModalAssignation, setShowModalAssignation] = useState(false);
  const [coursAAssigner, setCoursAAssigner] = useState<Cours | null>(null);
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [filtreMatiere, setFiltreMatiere] = useState("");
  const [filtreNiveau, setFiltreNiveau] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérification des autorisations
  useEffect(() => {
    if (utilisateur?.role === "eleve" || utilisateur?.role === "parent") {
      navigate("/dashboard", { replace: true });
    }
  }, [utilisateur, navigate]);

  // Filtrage des cours
  const coursFiltres = cours.filter(c => {
    const matchTexte = c.titre.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      c.description.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchMatiere = !filtreMatiere || matieresList[c.matiereId - 1] === filtreMatiere;
    const matchNiveau = !filtreNiveau; // TODO: Implement niveau filtering based on classeId relationship
    const matchStatut = !filtreStatut || c.statut === filtreStatut;
    
    return matchTexte && matchMatiere && matchNiveau && matchStatut;
  });

  // Statistiques
  const statistiques = {
    totalCours: cours.length,
    coursPublies: cours.filter(c => c.statut === "en_cours").length,
    assignationsActives: assignations.filter(a => a.statut === "en_cours").length,
    progressionMoyenne: Math.round(
      assignations.filter(a => a.statut !== "annule")
        .reduce((acc, a) => acc + a.progression, 0) / 
      Math.max(assignations.filter(a => a.statut !== "annule").length, 1)
    )
  };

  const handleSaveCours = (coursData: Omit<Cours, "id"> & { id?: string }) => {
    if (coursData.id) {
      // Modification
      const courseId = parseInt(coursData.id);
      setCours(prev => prev.map(c => 
        c.id === courseId ? { ...coursData, id: courseId } : c
      ));
    } else {
      // Ajout
      const nouveauCours: Cours = {
        ...coursData,
        id: Date.now()
      };
      setCours(prev => [...prev, nouveauCours]);
    }
    
    setCoursSelectionne(null);
    setOngletActif("cours");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEditCours = (cours: Cours) => {
    setCoursSelectionne(cours);
    setOngletActif("nouveau");
  };

  const handleDeleteCours = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      setCours(prev => prev.filter(c => c.id !== id));
      // Supprimer aussi les assignations liées
      setAssignations(prev => prev.filter(a => a.coursId !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleViewCours = (cours: Cours) => {
    console.log("Voir détails du cours:", cours);
    // Ici vous pourriez ouvrir un modal de détails
  };

  const handleAssignCours = (cours: Cours) => {
    setCoursAAssigner(cours);
    setShowModalAssignation(true);
  };

  const handleSaveAssignation = (assignationData: Omit<AssignationCours, "id">) => {
    const nouvelleAssignation: AssignationCours = {
      ...assignationData,
      id: Date.now()
    };
    
    setAssignations(prev => [...prev, nouvelleAssignation]);
    setShowModalAssignation(false);
    setCoursAAssigner(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleUpdateProgression = (id: string, progression: number) => {
    setAssignations(prev => prev.map(a => 
      a.id === parseInt(id) ? { ...a, progression } : a
    ));
  };

  const handleChangeStatut = (id: string, statut: AssignationCours["statut"]) => {
    setAssignations(prev => prev.map(a => 
      a.id === parseInt(id) ? { ...a, statut } : a
    ));
  };

  const handleCancelForm = () => {
    setCoursSelectionne(null);
    setOngletActif("cours");
  };

  const resetFiltres = () => {
    setRechercheTexte("");
    setFiltreMatiere("");
    setFiltreNiveau("");
    setFiltreStatut("");
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des cours</h1>
            <p className="text-gray-600 mt-1">
              Créez, gérez et assignez des cours aux classes de votre établissement
            </p>
          </div>
          
          <button
            onClick={() => {
              setOngletActif("nouveau");
              setCoursSelectionne(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau cours
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total cours</p>
                <p className="text-xl font-bold text-blue-900">{statistiques.totalCours}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Cours publiés</p>
                <p className="text-xl font-bold text-green-900">{statistiques.coursPublies}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Assignations actives</p>
                <p className="text-xl font-bold text-purple-900">{statistiques.assignationsActives}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-600">Progression moy.</p>
                <p className="text-xl font-bold text-orange-900">{statistiques.progressionMoyenne}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setOngletActif("cours");
                setCoursSelectionne(null);
              }}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                ongletActif === "cours"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Bibliothèque de cours ({cours.length})
              </div>
            </button>
            
            <button
              onClick={() => setOngletActif("assignations")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                ongletActif === "assignations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assignations ({assignations.length})
              </div>
            </button>
            
            <button
              onClick={() => {
                setOngletActif("nouveau");
                setCoursSelectionne(null);
              }}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                ongletActif === "nouveau"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {coursSelectionne ? "Modifier le cours" : "Nouveau cours"}
              </div>
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {ongletActif === "cours" && (
                <motion.div
                  key="onglet-cours"
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
                        value={filtreMatiere}
                        onChange={(e) => setFiltreMatiere(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Toutes les matières</option>
                        {matieresList.map(matiere => (
                          <option key={matiere} value={matiere}>{matiere}</option>
                        ))}
                      </select>

                      <select
                        value={filtreNiveau}
                        onChange={(e) => setFiltreNiveau(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Tous les niveaux</option>
                        {niveauxList.map(niveau => (
                          <option key={niveau} value={niveau}>{niveau}</option>
                        ))}
                      </select>

                      <select
                        value={filtreStatut}
                        onChange={(e) => setFiltreStatut(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Tous les statuts</option>
                        <option value="planifie">Planifié</option>
                        <option value="en_cours">En cours</option>
                        <option value="termine">Terminé</option>
                        <option value="annule">Annulé</option>
                      </select>

                      {(rechercheTexte || filtreMatiere || filtreNiveau || filtreStatut) && (
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {coursFiltres.map((cours) => (
                        <CarteCours
                          key={cours.id}
                          cours={cours}
                          professeurs={professeurs}
                          onEdit={handleEditCours}
                          onDelete={handleDeleteCours}
                          onView={handleViewCours}
                          onAssign={handleAssignCours}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {rechercheTexte || filtreMatiere || filtreNiveau || filtreStatut 
                          ? "Aucun cours trouvé" 
                          : "Aucun cours créé"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {rechercheTexte || filtreMatiere || filtreNiveau || filtreStatut
                          ? "Aucun cours ne correspond à vos critères de recherche."
                          : "Commencez par créer votre premier cours."}
                      </p>
                      {!rechercheTexte && !filtreMatiere && !filtreNiveau && !filtreStatut && (
                        <button
                          onClick={() => {
                            setOngletActif("nouveau");
                            setCoursSelectionne(null);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Créer le premier cours
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {ongletActif === "assignations" && (
                <motion.div
                  key="onglet-assignations"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Cours assignés aux classes
                    </h3>
                    <p className="text-gray-600">
                      Suivez la progression et gérez le statut des cours assignés
                    </p>
                  </div>

                  <ListeAssignations
                    assignations={assignations}
                    cours={cours}
                    classes={classes}
                    professeurs={professeurs}
                    onUpdateProgression={handleUpdateProgression}
                    onChangeStatut={handleChangeStatut}
                  />
                </motion.div>
              )}

              {ongletActif === "nouveau" && (
                <motion.div
                  key={coursSelectionne ? `onglet-modif-${coursSelectionne.id}` : "onglet-nouveau"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormulaireCours
                    cours={coursSelectionne || undefined}
                    professeurs={professeurs}
                    classes={classes}
                    onSave={handleSaveCours}
                    onCancel={handleCancelForm}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modal d'assignation */}
        <AnimatePresence>
          {showModalAssignation && coursAAssigner && (
            <ModalAssignation
              key={coursAAssigner.id}
              cours={coursAAssigner}
              classes={classes}
              professeurs={professeurs}
              assignations={assignations}
              onSave={handleSaveAssignation}
              onClose={() => {
                setShowModalAssignation(false);
                setCoursAAssigner(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Notification de succès */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              key="notif-success"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Opération réalisée avec succès !</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default CoursGestionnaire;