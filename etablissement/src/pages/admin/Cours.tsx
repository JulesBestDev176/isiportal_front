import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit3, Trash2, Users, User, 
  School, Mail, Phone, MapPin, Calendar, GraduationCap,
  UserCheck, AlertCircle, CheckCircle, UserPlus, List, X,
  Baby, Heart, FileText, Eye, ChevronDown, BookOpen,
  Clock, Target, PlayCircle, Video, Volume2, Image, Link, File
} from "lucide-react";

// Import des modèles
import { Cours, FormDataCours, CoursErrors, STATUTS_COURS, TYPES_RESSOURCE } from '../../models/cours.model';
import { Niveau } from '../../models/niveau.model';
import { Matiere } from '../../models/matiere.model';
import { Professeur } from '../../models/utilisateur.model';
import { AnneeScolaire } from '../../models/annee-scolaire.model';

// Mock data - remplacez par vos vrais modèles
const coursMock: Cours[] = [
  {
    id: 1,
    titre: "Algèbre et Géométrie",
    description: "Cours de mathématiques niveau 6ème comprenant les opérations de base et la géométrie plane",
    matiereId: 1,
    matiereNom: "Mathématiques",
    niveauId: 1,
    niveauNom: "6ème",
    professeurId: 1,
    professeurNom: "Fall Amadou",
    anneeScolaireId: 1,
    anneeScolaireNom: "2023-2024",
    semestresIds: [1, 2],
    dateCreation: "2024-09-01",
    heuresParSemaine: 4,
    coefficient: 3,
    statut: "en_cours",
    ressources: [
      {
        id: 1,
        nom: "Manuel de mathématiques 6ème",
        type: "pdf",
        url: "#",
        taille: "2.5 MB",
        obligatoire: true,
        dateAjout: "2024-09-01"
      },
      {
        id: 2,
        nom: "Vidéo explicative - Les fractions",
        type: "video",
        url: "#",
        obligatoire: false,
        dateAjout: "2024-09-15"
      }
    ]
  },
  {
    id: 2,
    titre: "Littérature française",
    description: "Étude des œuvres classiques et développement de l'expression écrite",
    matiereId: 2,
    matiereNom: "Français",
    niveauId: 2,
    niveauNom: "5ème",
    professeurId: 2,
    professeurNom: "Ndiaye Fatou",
    anneeScolaireId: 1,
    anneeScolaireNom: "2023-2024",
    semestresIds: [1],
    dateCreation: "2024-09-01",
    heuresParSemaine: 5,
    coefficient: 4,
    statut: "planifie",
    ressources: [
      {
        id: 3,
        nom: "Anthologie de textes",
        type: "pdf",
        url: "#",
        taille: "3.2 MB",
        obligatoire: true,
        dateAjout: "2024-09-01"
      }
    ]
  },
  {
    id: 3,
    titre: "Sciences physiques",
    description: "Introduction aux concepts de base de la physique et de la chimie",
    matiereId: 3,
    matiereNom: "Physique-Chimie",
    niveauId: 3,
    niveauNom: "4ème",
    professeurId: 3,
    professeurNom: "Diouf Moussa",
    anneeScolaireId: 1,
    anneeScolaireNom: "2023-2024",
    semestresIds: [1, 2],
    dateCreation: "2024-09-01",
    heuresParSemaine: 3,
    coefficient: 2,
    statut: "en_cours",
    ressources: []
  }
];

// Données mock pour les niveaux
const niveauxMock: Niveau[] = [
  { id: 1, nom: "6ème", ordre: 1, section: "college", cycle: "Collège", description: "Sixième", matieres: [], actif: true, dateCreation: "2023-01-01" },
  { id: 2, nom: "5ème", ordre: 2, section: "college", cycle: "Collège", description: "Cinquième", matieres: [], actif: true, dateCreation: "2023-01-01" },
  { id: 3, nom: "4ème", ordre: 3, section: "college", cycle: "Collège", description: "Quatrième", matieres: [], actif: true, dateCreation: "2023-01-01" },
  { id: 4, nom: "3ème", ordre: 4, section: "college", cycle: "Collège", description: "Troisième", matieres: [], actif: true, dateCreation: "2023-01-01" },
  { id: 5, nom: "2nde", ordre: 1, section: "lycee", cycle: "Lycée", description: "Seconde", matieres: [], actif: true, dateCreation: "2023-01-01" },
  { id: 6, nom: "1ère", ordre: 2, section: "lycee", cycle: "Lycée", description: "Première", matieres: [], actif: true, dateCreation: "2023-01-01" },
  { id: 7, nom: "Terminale", ordre: 3, section: "lycee", cycle: "Lycée", description: "Terminale", matieres: [], actif: true, dateCreation: "2023-01-01" }
];

// Données mock pour les années scolaires
const anneesScolairesMock: AnneeScolaire[] = [
  { id: 1, nom: "2023-2024", anneeDebut: 2023, anneeFin: 2024, dateDebut: "2023-09-01", dateFin: "2024-07-31", statut: "active", description: "Année scolaire 2023-2024", dateCreation: "2023-06-01", dateModification: "2023-09-01" },
  { id: 2, nom: "2022-2023", anneeDebut: 2022, anneeFin: 2023, dateDebut: "2022-09-01", dateFin: "2023-07-31", statut: "terminee", description: "Année scolaire 2022-2023", dateCreation: "2022-06-01", dateModification: "2023-07-31" },
  { id: 3, nom: "2024-2025", anneeDebut: 2024, anneeFin: 2025, dateDebut: "2024-09-01", dateFin: "2025-07-31", statut: "planifiee", description: "Année scolaire 2024-2025", dateCreation: "2024-06-01" }
];

// Données mock pour les professeurs
const professeursMock: Professeur[] = [
  { id: 1, nom: "Fall", prenom: "Amadou", email: "amadou.fall@ecole.fr", role: "professeur", sections: ["college"], matieres: [1], cours: [], dateCreation: "2023-01-01", actif: true },
  { id: 2, nom: "Ndiaye", prenom: "Fatou", email: "fatou.ndiaye@ecole.fr", role: "professeur", sections: ["college"], matieres: [2], cours: [], dateCreation: "2023-01-01", actif: true },
  { id: 3, nom: "Diouf", prenom: "Moussa", email: "moussa.diouf@ecole.fr", role: "professeur", sections: ["college"], matieres: [3], cours: [], dateCreation: "2023-01-01", actif: true },
  { id: 4, nom: "Ba", prenom: "Aissatou", email: "aissatou.ba@ecole.fr", role: "professeur", sections: ["college"], matieres: [4], cours: [], dateCreation: "2023-01-01", actif: true }
];

// Données mock pour les matières
const matieresMock: Matiere[] = [
  { id: 1, nom: "Mathématiques", code: "MATH", description: "Mathématiques", couleur: "#3B82F6", coefficient: 4, niveaux: [1, 2, 3, 4, 5, 6, 7], dateCreation: "2023-01-01", statut: "active" },
  { id: 2, nom: "Français", code: "FRAN", description: "Français", couleur: "#EF4444", coefficient: 3, niveaux: [1, 2, 3, 4, 5, 6, 7], dateCreation: "2023-01-01", statut: "active" },
  { id: 3, nom: "Physique-Chimie", code: "PHYS", description: "Physique-Chimie", couleur: "#06B6D4", coefficient: 2, niveaux: [3, 4, 5, 6, 7], dateCreation: "2023-01-01", statut: "active" },
  { id: 4, nom: "Histoire-Géographie", code: "HIST", description: "Histoire-Géographie", couleur: "#F59E0B", coefficient: 2, niveaux: [1, 2, 3, 4, 5, 6, 7], dateCreation: "2023-01-01", statut: "active" },
  { id: 5, nom: "Anglais", code: "ANGL", description: "Anglais", couleur: "#10B981", coefficient: 2, niveaux: [1, 2, 3, 4, 5, 6, 7], dateCreation: "2023-01-01", statut: "active" },
  { id: 6, nom: "SVT", code: "SVT", description: "Sciences de la Vie et de la Terre", couleur: "#84CC16", coefficient: 2, niveaux: [1, 2, 3, 4, 5, 6, 7], dateCreation: "2023-01-01", statut: "active" }
];

// Composant Modal
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: string;
}> = ({ isOpen, onClose, title, children, size = "max-w-4xl" }) => {
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
          className={`bg-white rounded-lg shadow-xl ${size} w-full max-h-[90vh] overflow-y-auto`}
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

// Composant formulaire cours
const FormulaireCours: React.FC<{
  onSubmit: (cours: Cours) => void;
  onClose: () => void;
  coursAModifier?: Cours;
  modeEdition?: boolean;
}> = ({ onSubmit, onClose, coursAModifier, modeEdition = false }) => {
  const [formData, setFormData] = useState<FormDataCours>({
    titre: coursAModifier?.titre || "",
    description: coursAModifier?.description || "",
    matiereId: coursAModifier?.matiereId?.toString() || "",
    niveauId: coursAModifier?.niveauId?.toString() || "",
    professeurId: coursAModifier?.professeurId?.toString() || "",
    anneeScolaireId: coursAModifier?.anneeScolaireId?.toString() || "",
    heuresParSemaine: coursAModifier?.heuresParSemaine || 1,
    coefficient: coursAModifier?.coefficient || 1,
    statut: coursAModifier?.statut || "active"
  });

  const [errors, setErrors] = useState<CoursErrors>({});
  const [loading, setLoading] = useState(false);

  const matieres = matieresMock;
  const niveaux = niveauxMock;
  const professeurs = professeursMock;
  const anneesScolaires = anneesScolairesMock;

  const validateForm = () => {
    const newErrors: CoursErrors = {};
    if (!formData.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.matiereId) newErrors.matiereId = "La matière est requise";
    if (!formData.niveauId) newErrors.niveauId = "Le niveau est requis";
    if (!formData.professeurId) newErrors.professeurId = "Le professeur est requis";
    if (!formData.anneeScolaireId) newErrors.anneeScolaireId = "L'année scolaire est requise";
    if (!formData.heuresParSemaine || formData.heuresParSemaine < 1) newErrors.heuresParSemaine = "Le nombre d'heures doit être supérieur à 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nouveauCours = {
      ...formData,
      id: modeEdition ? (coursAModifier?.id || Date.now()) : Date.now(),
      matiereId: parseInt(formData.matiereId),
      niveauId: parseInt(formData.niveauId),
      professeurId: parseInt(formData.professeurId),
      anneeScolaireId: parseInt(formData.anneeScolaireId),
      semestresIds: [1, 2], // Valeur par défaut
      dateCreation: modeEdition ? (coursAModifier?.dateCreation || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      dateModification: modeEdition ? new Date().toISOString().split('T')[0] : undefined,
      matiereNom: matieres.find(m => m.id === parseInt(formData.matiereId))?.nom || "",
      niveauNom: niveaux.find(n => n.id === parseInt(formData.niveauId))?.nom || "",
      professeurNom: professeurs.find(p => p.id === parseInt(formData.professeurId)) ? 
        `${professeurs.find(p => p.id === parseInt(formData.professeurId))?.nom} ${professeurs.find(p => p.id === parseInt(formData.professeurId))?.prenom}` : "",
      anneeScolaireNom: anneesScolaires.find(a => a.id === parseInt(formData.anneeScolaireId))?.nom || "",
      ressources: modeEdition ? (coursAModifier?.ressources || []) : [],
      statut: formData.statut
    };

    onSubmit(nouveauCours);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Informations du cours
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Titre du cours *
          </label>
          <input
            type="text"
            value={formData.titre}
            onChange={(e) => setFormData({...formData, titre: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.titre ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Ex: Algèbre et Géométrie"
          />
          {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Description détaillée du cours"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Matière *
            </label>
            <select
              value={formData.matiereId}
              onChange={(e) => setFormData({...formData, matiereId: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.matiereId ? 'border-red-500' : 'border-neutral-300'
              }`}
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
              ))}
            </select>
            {errors.matiereId && <p className="text-red-500 text-sm mt-1">{errors.matiereId}</p>}
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

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Professeur *
            </label>
            <select
              value={formData.professeurId}
              onChange={(e) => setFormData({...formData, professeurId: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.professeurId ? 'border-red-500' : 'border-neutral-300'
              }`}
            >
              <option value="">Sélectionner un professeur</option>
              {professeurs.map(prof => (
                <option key={prof.id} value={prof.id}>{prof.nom} {prof.prenom}</option>
              ))}
            </select>
            {errors.professeurId && <p className="text-red-500 text-sm mt-1">{errors.professeurId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Année Scolaire *
            </label>
            <select
              value={formData.anneeScolaireId}
              onChange={(e) => setFormData({...formData, anneeScolaireId: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.anneeScolaireId ? 'border-red-500' : 'border-neutral-300'
              }`}
            >
              <option value="">Sélectionner une année scolaire</option>
              {anneesScolaires.map(annee => (
                <option key={annee.id} value={annee.id}>{annee.nom} ({annee.statut})</option>
              ))}
            </select>
            {errors.anneeScolaireId && <p className="text-red-500 text-sm mt-1">{errors.anneeScolaireId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Heures par semaine *
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.heuresParSemaine}
              onChange={(e) => setFormData({...formData, heuresParSemaine: parseInt(e.target.value)})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.heuresParSemaine ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.heuresParSemaine && <p className="text-red-500 text-sm mt-1">{errors.heuresParSemaine}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Coefficient
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.coefficient}
              onChange={(e) => setFormData({...formData, coefficient: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {STATUTS_COURS.map(statut => (
                <option key={statut.value} value={statut.value}>{statut.label}</option>
              ))}
            </select>
          </div>
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

const CoursAdmin = () => {
  const [cours, setCours] = useState<Cours[]>(coursMock);
  const [filteredCours, setFilteredCours] = useState<Cours[]>(coursMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterMatiere, setFilterMatiere] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [coursAModifier, setCoursAModifier] = useState<Cours | null>(null);
  const [coursDetails, setCoursDetails] = useState<Cours | null>(null);
  const [activeTab, setActiveTab] = useState<"liste" | "ajout">("liste");

  useEffect(() => {
    let filtered = cours;

    if (searchTerm) {
      filtered = filtered.filter(coursItem => 
        coursItem.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coursItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coursItem.matiereNom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coursItem.niveauNom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coursItem.professeurNom || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatut !== "all") {
      filtered = filtered.filter(coursItem => coursItem.statut === filterStatut);
    }

    if (filterMatiere !== "all") {
      filtered = filtered.filter(coursItem => coursItem.matiereId === parseInt(filterMatiere));
    }

    setFilteredCours(filtered);
  }, [cours, searchTerm, filterStatut, filterMatiere]);

  const ajouterCours = (nouveauCours: Cours) => {
    if (modeEdition) {
      setCours(prev => prev.map(c => c.id === nouveauCours.id ? nouveauCours : c));
    } else {
      setCours(prev => [...prev, nouveauCours]);
    }
    setModalOpen(false);
    setModeEdition(false);
    setCoursAModifier(null);
    setActiveTab("liste");
  };

  const ouvrirModalAjout = () => {
    setActiveTab("ajout");
    setModeEdition(false);
    setCoursAModifier(null);
  };

  const ouvrirModalModification = (coursItem: Cours) => {
    setCoursAModifier(coursItem);
    setModeEdition(true);
    setActiveTab("ajout");
  };

  const getStatutBadge = (statut: string) => {
    const statutInfo = STATUTS_COURS.find(s => s.value === statut);
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[statutInfo?.couleur as keyof typeof colors || 'gray']}`}>
        {statutInfo?.label || statut}
      </span>
    );
  };

  const getIconeRessource = (type: string) => {
    const typeInfo = TYPES_RESSOURCE.find(t => t.value === type);
    const IconComponent = typeInfo?.icone || File;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestion des Cours</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les cours par niveau, année scolaire et professeur
          </p>
        </div>
        
        <button
          onClick={ouvrirModalAjout}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Cours
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
                <BookOpen className="w-4 h-4" />
                Liste des cours
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
                    placeholder="Rechercher par titre, matière, niveau ou professeur..."
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
                  {STATUTS_COURS.map(statut => (
                    <option key={statut.value} value={statut.value}>{statut.label}</option>
                  ))}
                </select>
                
                <select
                  value={filterMatiere}
                  onChange={(e) => setFilterMatiere(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les matières</option>
                  {matieresMock.map(matiere => (
                    <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tableau des cours */}
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Cours
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Matière & Classe
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Professeur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Horaires
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
                  {filteredCours.map((coursItem, index) => (
                    <motion.tr
                      key={coursItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-neutral-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{coursItem.titre}</p>
                            <p className="text-sm text-neutral-500 max-w-xs truncate">{coursItem.description}</p>
                            {coursItem.ressources && coursItem.ressources.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <FileText className="w-3 h-3 text-blue-500" />
                                <span className="text-xs text-blue-600">
                                  {coursItem.ressources.length} ressource{coursItem.ressources.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            <span className="font-medium text-neutral-900">{coursItem.matiereNom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <School className="w-4 h-4 text-blue-500" />
                            <span className="text-neutral-600">{coursItem.niveauNom}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-500" />
                          <span className="text-neutral-900">{coursItem.professeurNom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-neutral-900">{coursItem.heuresParSemaine}h/semaine</span>
                          </div>
                          {coursItem.coefficient && (
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-red-500" />
                              <span className="text-neutral-600">Coeff. {coursItem.coefficient}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getStatutBadge(coursItem.statut)}
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {coursItem.dateCreation}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCoursDetails(coursItem)}
                            className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => ouvrirModalModification(coursItem)}
                            className="p-2 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${coursItem.titre}" ?`)) {
                                setCours(prev => prev.filter(c => c.id !== coursItem.id));
                              }
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

            {filteredCours.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Aucun cours trouvé
                </h3>
                <p className="text-neutral-500">
                  Essayez de modifier vos critères de recherche ou créez un nouveau cours.
                </p>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {[
              {
                title: "Total Cours",
                value: cours.length,
                icon: <BookOpen className="w-5 h-5" />,
                color: "bg-blue-500"
              },
              {
                title: "Cours Actifs",
                value: cours.filter(c => c.statut === "en_cours").length,
                icon: <PlayCircle className="w-5 h-5" />,
                color: "bg-green-500"
              },
              {
                title: "Heures Totales",
                value: cours.reduce((sum, c) => sum + c.heuresParSemaine, 0) + "h/sem",
                icon: <Clock className="w-5 h-5" />,
                color: "bg-purple-500"
              },
              {
                title: "Ressources",
                value: cours.reduce((sum, c) => sum + (c.ressources?.length || 0), 0),
                icon: <FileText className="w-5 h-5" />,
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
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {modeEdition ? "Modifier" : "Ajouter"} un cours
              </h2>
              <button
                onClick={() => {
                  setActiveTab("liste");
                  setModeEdition(false);
                  setCoursAModifier(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
            <FormulaireCours
              onSubmit={ajouterCours}
              onClose={() => {
                setActiveTab("liste");
                setModeEdition(false);
                setCoursAModifier(null);
              }}
              coursAModifier={coursAModifier}
              modeEdition={modeEdition}
            />
          </div>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModeEdition(false);
          setCoursAModifier(null);
        }}
        title={`${modeEdition ? "Modifier" : "Ajouter"} un cours`}
      >
        <FormulaireCours
          onSubmit={ajouterCours}
          onClose={() => {
            setModalOpen(false);
            setModeEdition(false);
            setCoursAModifier(null);
          }}
          coursAModifier={coursAModifier}
          modeEdition={modeEdition}
        />
      </Modal>

      {/* Modal détails cours */}
      {coursDetails && (
        <Modal
          isOpen={!!coursDetails}
          onClose={() => setCoursDetails(null)}
          title={`Détails du cours: ${coursDetails.titre}`}
          size="max-w-5xl"
        >
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Titre :</strong> {coursDetails.titre}</p>
                  <p><strong>Matière :</strong> {coursDetails.matiereNom}</p>
                  <p><strong>Niveau :</strong> {coursDetails.niveauNom}</p>
                  <p><strong>Professeur :</strong> {coursDetails.professeurNom}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Heures/semaine :</strong> {coursDetails.heuresParSemaine}h</p>
                  {coursDetails.coefficient && <p><strong>Coefficient :</strong> {coursDetails.coefficient}</p>}
                  <p><strong>Statut :</strong> {getStatutBadge(coursDetails.statut)}</p>
                  <p><strong>Date de création :</strong> {coursDetails.dateCreation}</p>
                </div>
              </div>
              <div className="mt-4">
                <p><strong>Description :</strong></p>
                <p className="text-neutral-600 mt-1">{coursDetails.description}</p>
              </div>
            </div>

            {/* Objectifs */}
            {/* Removed Objectifs and Prerequis sections */}

            {/* Ressources */}
            {coursDetails.ressources && coursDetails.ressources.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Ressources pédagogiques
                </h3>
                <div className="space-y-3">
                  {coursDetails.ressources.map((ressource: any) => (
                    <div key={ressource.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getIconeRessource(ressource.type)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{ressource.nom}</p>
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            <span className="capitalize">{TYPES_RESSOURCE.find(t => t.value === ressource.type)?.label}</span>
                            {ressource.taille && <span>{ressource.taille}</span>}
                            <span>Ajouté le {ressource.dateAjout}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ressource.obligatoire && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Obligatoire
                          </span>
                        )}
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Télécharger
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  ouvrirModalModification(coursDetails);
                  setCoursDetails(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => setCoursDetails(null)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}

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
              Gestion des cours
            </p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              <li>• Chaque cours est associé à une matière, un niveau et un professeur</li>
              <li>• Les ressources pédagogiques enrichissent l'apprentissage</li>
              <li>• Le coefficient influence l'importance du cours dans l'évaluation</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoursAdmin;