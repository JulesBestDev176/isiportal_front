import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit3, Trash2, Users, User, 
  School, Mail, Phone, MapPin, Calendar, GraduationCap,
  UserCheck, AlertCircle, CheckCircle, UserPlus, List, X,
  Baby, Heart, FileText, Eye, ChevronDown, BookOpen, Settings,
  Clock, Target, PlayCircle, Video, Volume2, Image, Link, File, Check, CalendarDays,
  Info, BarChart3, Users2, Clock3, BookOpenCheck, CalendarCheck,
  ArrowRight, ArrowLeft, RefreshCw, Download, Upload, EyeOff,
  UserX
} from "lucide-react";

// Interfaces TypeScript
import { Classe, ClasseAnneeScolaire, ProfMatiere } from '../../models/classe.model';
import { AnneeScolaire } from '../../models/annee-scolaire.model';
import { EleveClasse } from '../../models/eleve.model';
import { ReglesTransfert, NIVEAUX_SUPERIEURS, reglesTransfertDefaut, getNiveauSuperieur, estEligibleTransfert, getClasseDestination } from '../../models/regles-transfert.model';
import { adminService } from '../../services/adminService';
import { eleveService } from '../../services/eleveService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';
import { bulletinService } from '../../services/bulletinService';
import { historiqueElevesService } from '../../services/historiqueElevesService';

import { FormDataClasse, ClasseErrors as Errors, MatiereBulletin, BulletinSemestre } from '../../models/classe.model';

// Fonction pour charger les années scolaires
const loadAnneesScolaires = async () => {
  try {
    const response = await adminService.getAnneesScolaires();
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Erreur lors du chargement des années scolaires:', error);
    return [];
  }
};

// Fonction pour charger les classes
const loadClasses = async () => {
  try {
    const response = await adminService.getClasses();
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Erreur lors du chargement des classes:', error);
    return [];
  }
};

// Fonction pour charger l'historique des élèves
const loadHistoriqueEleves = async (classeId: number) => {
  try {
    const response = await historiqueElevesService.getHistoriqueClasse(classeId, "2024-2025");
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique des élèves:', error);
    return [];
  }
};

// Fonction pour charger les bulletins des élèves
const loadBulletinsEleve = async (eleveId: number) => {
  try {
    const response = await bulletinService.getBulletinsEleve(eleveId);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Erreur lors du chargement des bulletins:', error);
    return [];
  }
};

// Suppression des mocks - remplacés par des appels aux services

// Données mock pour l'historique des élèves (années précédentes)
// TODO: Remplacer par des appels au service historiqueElevesService

// Données mock pour les bulletins des élèves
// Interfaces maintenant importées depuis les modèles

// TODO: Remplacer par des appels au service bulletinService

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

const Classes: React.FC = () => {
  const { utilisateur } = useAuth();
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"liste" | "ajouter">("liste");
  const [showModalAjout, setShowModalAjout] = useState(false);
  const [classeAModifier, setClasseAModifier] = useState<Classe | null>(null);
  const [showModalModification, setShowModalModification] = useState(false);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [classeSelectionnee, setClasseSelectionnee] = useState<Classe | null>(null);
  const [eleves, setEleves] = useState<EleveClasse[]>([]);
  const [anneesScolaires, setAnneesScolaires] = useState<AnneeScolaire[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [modeEdition, setModeEdition] = useState(false);
  const [classeDetails, setClasseDetails] = useState<Classe | null>(null);
  const [classeASupprimer, setClasseASupprimer] = useState<Classe | null>(null);
  const [modalSuppressionClasse, setModalSuppressionClasse] = useState(false);
  const [modalTransfert, setModalTransfert] = useState(false);
  const [modalReglesTransfert, setModalReglesTransfert] = useState(false);
  const [modalDetailsEleve, setModalDetailsEleve] = useState(false);
  const [eleveSelectionne, setEleveSelectionne] = useState<EleveClasse | null>(null);
  const [elevesATransferer, setElevesATransferer] = useState<EleveClasse[]>([]);
  const [classeSource, setClasseSource] = useState<Classe | null>(null);
  const [reglesTransfert, setReglesTransfert] = useState<ReglesTransfert>(reglesTransfertDefaut);
  const [niveauxSuperieurs] = useState(NIVEAUX_SUPERIEURS);

  // Fonctions utilitaires
  const getEffectifClasse = (classe: Classe) => {
    // Pour l'instant, on utilise une logique simplifiée
    // TODO: Implémenter la vraie logique avec les services
    return eleves.filter(eleve => eleve.statut === "inscrit").length;
  };

  const getEffectifMaxClasse = (classe: Classe) => {
    // Utiliser l'effectif max de l'année scolaire active
    const anneeActive = classe.anneesScolaires?.find(a => a.statut === "active");
    return anneeActive?.effectifMax || 30;
  };

  const getEffectifBadge = (effectif: number, max: number) => {
    const pourcentage = (effectif / max) * 100;
    let color = "bg-green-100 text-green-800";
    if (pourcentage >= 90) color = "bg-red-100 text-red-800";
    else if (pourcentage >= 75) color = "bg-orange-100 text-orange-800";
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
        {effectif}/{max}
      </span>
    );
  };

  const getProfesseurPrincipalClasse = (classe: Classe) => {
    // Trouver l'année scolaire active
    const anneeActive = classe.anneesScolaires?.find(a => a.statut === "active");
    return anneeActive?.professeurPrincipalNom || "Non assigné";
  };

  const getStatutBadge = (statut: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      archived: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[statut as keyof typeof colors] || colors.inactive}`}>
        {statut === "active" ? "Active" : statut === "inactive" ? "Inactive" : "Archivée"}
      </span>
    );
  };

  // Fonctions de gestion
  const ajouterAnneeScolaire = (classeId: number, anneeScolaire: AnneeScolaire) => {
    console.log('Ajouter année scolaire:', classeId, anneeScolaire);
  };

  const transfererEleve = (eleveId: number, classeDestination: string) => {
    console.log('Transférer élève:', eleveId, classeDestination);
  };

  const transfererElevesAutomatiquement = (classeId: number) => {
    console.log('Transférer élèves automatiquement:', classeId);
  };

  const ouvrirModalDetailsEleve = (eleve: EleveClasse) => {
    setEleveSelectionne(eleve);
    setModalDetailsEleve(true);
  };

  const confirmerTransfertAutomatique = () => {
    console.log('Confirmer transfert automatique');
    setModalTransfert(false);
    setElevesATransferer([]);
    setClasseSource(null);
  };

  const supprimerClasse = () => {
    if (classeASupprimer) {
      handleDeleteClasse(classeASupprimer.id);
      setModalSuppressionClasse(false);
      setClasseASupprimer(null);
    }
  };

  // Filtrer les classes
  const filteredClasses = classes.filter(classe => {
    const matchesSearch = classe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classe.niveauNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getProfesseurPrincipalClasse(classe).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatut === "" || filterStatut === "all" || classe.statut === filterStatut;
    return matchesSearch && matchesStatus;
  });

  // Charger les données au montage
  useEffect(() => {
    loadClasses();
    loadEleves();
    loadAnneesScolaires();
    loadNotifications();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await adminService.getClasses();
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEleves = async () => {
    try {
      const response = await eleveService.getEleves();
      if (response.success && response.data) {
        // Convertir les élèves en EleveClasse format
        const elevesClasse = response.data.map(eleve => ({
          id: eleve.id,
          nom: eleve.nom,
          prenom: eleve.prenom,
          statut: eleve.statut,
          moyenneAnnuelle: eleve.moyenneAnnuelle,
          dateInscription: eleve.dateInscription
        }));
        setEleves(elevesClasse);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
    }
  };

  const loadAnneesScolaires = async () => {
    try {
      const response = await adminService.getAnneesScolaires();
      if (response.success && response.data) {
        setAnneesScolaires(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des années scolaires:', error);
    }
  };

  const loadNotifications = async () => {
    if (utilisateur?.id) {
      try {
        const response = await notificationService.getNotifications(utilisateur.id);
        if (response.success && response.data) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    }
  };

  const handleCreateClasse = async (classe: Omit<Classe, 'id' | 'dateCreation'>) => {
    try {
      const response = await adminService.createClasse(classe);
      if (response.success) {
        setShowModalAjout(false);
        loadClasses(); // Recharger la liste
        console.log('Classe créée avec succès');
      } else {
        console.error('Erreur lors de la création:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
    }
  };

  const handleUpdateClasse = async (id: number, updates: Partial<Classe>) => {
    try {
      const response = await adminService.updateClasse(id, updates);
      if (response.success) {
        setShowModalModification(false);
        setClasseAModifier(null);
        loadClasses(); // Recharger la liste
        console.log('Classe mise à jour avec succès');
      } else {
        console.error('Erreur lors de la mise à jour:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
    }
  };

  const handleDeleteClasse = async (id: number) => {
    try {
      const response = await adminService.deleteClasse(id);
      if (response.success) {
        loadClasses(); // Recharger la liste
        console.log('Classe supprimée avec succès');
      } else {
        console.error('Erreur lors de la suppression:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
    }
  };

  const handleTransfererEleves = async (classeId: number, reglesTransfert: ReglesTransfert) => {
    try {
      const response = await adminService.transfererEleves(classeId, reglesTransfert);
      if (response.success) {
        loadClasses(); // Recharger la liste
        loadEleves(); // Recharger les élèves
        console.log('Transfert des élèves effectué avec succès');
      } else {
        console.error('Erreur lors du transfert:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors du transfert des élèves:', error);
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
          onClick={() => setShowModalDetails(true)}
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
              onClick={() => setActiveTab("ajouter")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "ajouter"
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
                onClick={() => setShowModalAjout(true)}
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
                        onClick={() => setClasseSelectionnee(classe)}
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModalModification(true)}
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
          onSubmit={handleCreateClasse}
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
          anneesScolaires={anneesScolaires}
          eleves={eleves}
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
                // TODO: Remplacer par les vraies données des services
                const bulletin = null; // bulletinsMock[eleveSelectionne.id]?.[anneeScolaireId]?.[semestre];
                if (!bulletin) return null;
                
                return (
                  <div key={semestre} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="font-semibold text-blue-900">{semestre} - {anneeNom}</h4>
                      <p className="text-sm text-blue-700">Moyenne générale: 14.5/20</p>
                    </div>
                    
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devoir 1</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devoir 2</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Composition</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coefficient</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moyenne</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appréciation</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {/* TODO: Remplacer par les vraies données des services */}
                            <tr className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-sm font-medium text-gray-900">Mathématiques</td>
                              <td className="px-3 py-2 text-sm text-gray-900">15/20</td>
                              <td className="px-3 py-2 text-sm text-gray-900">14/20</td>
                              <td className="px-3 py-2 text-sm text-gray-900">16/20</td>
                              <td className="px-3 py-2 text-sm text-gray-900">4</td>
                              <td className="px-3 py-2 text-sm font-medium text-gray-900">15.0/20</td>
                              <td className="px-3 py-2 text-sm text-gray-900">Bon travail, continuez ainsi</td>
                            </tr>
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
                        const elevesAnneeHistorique: EleveClasse[] = []; // TODO: Charger depuis le service historiqueElevesService
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