import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Classe, ClasseAnneeScolaire, ProfMatiere, FormDataClasse, ClasseErrors as Errors, MatiereBulletin, BulletinSemestre } from '../../models/classe.model';
import { AnneeScolaire } from '../../models/annee-scolaire.model';
import { EleveClasse } from '../../models/eleve.model';
import { ReglesTransfert, NIVEAUX_SUPERIEURS, reglesTransfertDefaut, getNiveauSuperieur, estEligibleTransfert, getClasseDestination } from '../../models/regles-transfert.model';
import { Bulletin } from '../../models/bulletin.model';
import OngletRedoublants from '../../components/OngletRedoublants';
import NotesEleve from '../../components/NotesEleve';
import { adminService } from '../../services/adminService';
import { eleveService } from '../../services/eleveService';
import { eleveClasseService } from '../../services/eleveClasseService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';
import { bulletinService } from '../../services/bulletinService';
import { historiqueElevesService } from '../../services/historiqueElevesService';
import { safeString, safeNumber, safeDate } from '../../utils/safeRender';
import { safeFilter } from '../../utils/searchHelpers';
import { noteService } from '../../services/noteService';

// Initial form data
const initialFormData: FormDataClasse = {
  nom: "",
  niveauId: "",
  effectifMax: 30,
  description: "",
  professeurPrincipalId: "",
  statut: "active"
};

// Fonction utilitaire pour formater les dates
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Non définie';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Date invalide';
  }
};

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
      const bulletins = await bulletinService.getBulletinsEleve(eleveId);
      return bulletins;
  } catch (error) {
    console.error('Erreur lors du chargement des bulletins:', error);
    return [];
  }
};

// Services utilisés pour récupérer les données du backend

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

    console.log('Nouvelle classe créée:', nouvelleClasse);
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
  const [activeTab, setActiveTab] = useState<"liste" | "ajouter" | "redoublants">("liste");

  // Missing state variables
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormDataClasse>(initialFormData);
  const [editingClasse, setEditingClasse] = useState<Classe | null>(null);
  const [showModalSuppression, setShowModalSuppression] = useState(false);

  const [classeAModifier, setClasseAModifier] = useState<Classe | null>(null);
  const [showModalModification, setShowModalModification] = useState(false);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [classeSelectionnee, setClasseSelectionnee] = useState<Classe | null>(null);
  const [eleves, setEleves] = useState<EleveClasse[]>([]);
  const [elevesClasse, setElevesClasse] = useState<EleveClasse[]>([]);
  const [anneesScolaires, setAnneesScolaires] = useState<AnneeScolaire[]>([]);
  const [niveaux, setNiveaux] = useState<any[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [modeEdition, setModeEdition] = useState(false);

  const [classeASupprimer, setClasseASupprimer] = useState<Classe | null>(null);
  const [modalSuppressionClasse, setModalSuppressionClasse] = useState(false);
  const [modalTransfert, setModalTransfert] = useState(false);
  const [modalReglesTransfert, setModalReglesTransfert] = useState(false);
  const [modalEvolutionAnnee, setModalEvolutionAnnee] = useState(false);
  const [modalDetailsEleve, setModalDetailsEleve] = useState(false);
  const [eleveSelectionne, setEleveSelectionne] = useState<EleveClasse | null>(null);
  const [elevesATransferer, setElevesATransferer] = useState<EleveClasse[]>([]);
  const [classeSource, setClasseSource] = useState<Classe | null>(null);
  const [reglesTransfert, setReglesTransfert] = useState<ReglesTransfert>(reglesTransfertDefaut);
  const [niveauxSuperieurs] = useState(NIVEAUX_SUPERIEURS);

  // Fonctions utilitaires simples
  const getEffectifClasse = (classe: any) => classe.effectif_actuel || 0;
  const getEffectifMaxClasse = (classe: any) => classe.effectif_max || 30;

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

  const getProfesseurPrincipalClasse = (classe: any) => {
    return classe.professeurPrincipalNom || 'Non assigné';
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

  const getNiveauNom = (niveauId: number) => {
    if (!niveauId || !Array.isArray(niveaux)) return 'Niveau inconnu';
    const niveau = niveaux.find(n => n.id === niveauId);
    return niveau ? niveau.nom : 'Niveau inconnu';
  };

  const getProfesseurPrincipalNom = (professeurPrincipalId: number) => {
    if (!professeurPrincipalId || !Array.isArray(utilisateurs)) return 'Non assigné';
    const professeur = utilisateurs.find(u => u.id === professeurPrincipalId && u.role === 'professeur');
    return professeur ? `${professeur.prenom || ''} ${professeur.nom || ''}`.trim() : 'Non assigné';
  };

  // Fonction pour obtenir l'année scolaire active
  const getAnneeScolaireActive = () => {
    if (!Array.isArray(anneesScolaires) || anneesScolaires.length === 0) {
      return "2024-2025";
    }
    const anneeActive = anneesScolaires.find(a => a.statut === "active");
    return anneeActive?.nom || "2024-2025";
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
  const filteredClasses = useMemo(() => {
    let filtered = classes;
    
    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(classe => {
        const nom = (classe.nom || '').toLowerCase();
        const niveau = (classe.niveauNom || '').toLowerCase();
        const prof = (classe.professeurPrincipalNom || '').toLowerCase();
        return nom.includes(term) || niveau.includes(term) || prof.includes(term);
      });
    }
    
    // Filtre par statut
    if (filterStatut && filterStatut !== "" && filterStatut !== "all") {
      filtered = filtered.filter(classe => classe.statut === filterStatut);
    }
    
    // Trier par ordre du niveau puis par nom
    filtered.sort((a, b) => {
      const niveauA = niveaux.find(n => n.id === a.niveau_id);
      const niveauB = niveaux.find(n => n.id === b.niveau_id);
      const ordreA = niveauA?.ordre || 999;
      const ordreB = niveauB?.ordre || 999;
      if (ordreA !== ordreB) {
        return ordreA - ordreB;
      }
      return (a.nom || '').localeCompare(b.nom || '');
    });
    
    return filtered;
  }, [classes, searchTerm, filterStatut]);

  // Charger les données au montage
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadNiveaux(),
        loadUtilisateurs(),
        loadAnneesScolaires(),
        loadEleves(),
        loadNotifications(),
        loadReglesTransfert()
      ]);
    };
    loadInitialData();
  }, []);

  const loadReglesTransfert = async () => {
    try {
      const response = await adminService.getReglesTransfert();
      if (response.success && response.data) {
        setReglesTransfert(response.data);
      } else {
        setReglesTransfert(reglesTransfertDefaut);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des règles de transfert:', error);
      setReglesTransfert(reglesTransfertDefaut);
    }
  };

  // Recharger les classes quand les niveaux et utilisateurs sont disponibles
  useEffect(() => {
    if (niveaux.length > 0 && utilisateurs.length > 0) {
      loadClasses();
    }
  }, [niveaux.length, utilisateurs.length]);

  const loadClasses = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await adminService.getClasses();
      if (response.success && response.data) {
        const classesTransformees = response.data.map((classe: any) => {
          const niveau = niveaux.find(n => n.id === classe.niveau_id);
          const niveauNom = niveau ? niveau.nom : (classe.niveau?.nom || 'Niveau inconnu');
          const professeurPrincipalNom = getProfesseurPrincipalNom(classe.professeur_principal_id);

          return {
            ...classe,
            niveauNom,
            professeurPrincipalNom,
            dateCreation: classe.date_creation || classe.created_at || new Date().toISOString().split('T')[0],
            effectif_actuel: classe.effectif_actuel || 0,
            effectif_max: classe.effectif_max || 30
          };
        });
        setClasses(classesTransformees);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    } finally {
      setLoading(false);
    }
  }, [niveaux, utilisateurs, loading]);

  const loadEleves = async () => {
    try {
      const response = await eleveService.getEleves();
      if (response.success && response.data) {
        // Convertir les élèves en EleveClasse format
        const elevesClasse = response.data.map(eleve => ({
          id: eleve.id,
          nom: eleve.nom || '',
          prenom: eleve.prenom || '',
          statut: eleve.statut || 'inscrit',
          moyenneAnnuelle: eleve.moyenneAnnuelle || 0,
          dateInscription: eleve.dateInscription || new Date().toISOString()
        }));
        setEleves(elevesClasse);
      } else {
        setEleves([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
      setEleves([]);
    }
  };



  const loadAnneesScolaires = async () => {
    try {
      const response = await adminService.getAnneesScolaires();
      if (response.success && response.data) {
        setAnneesScolaires(response.data);
      } else {
        setAnneesScolaires([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des années scolaires:', error);
      setAnneesScolaires([]);
    }
  };

  const loadNiveaux = async () => {
    try {
      const response = await adminService.getNiveaux();
      if (response.success && response.data) {
        setNiveaux(response.data);
      } else {
        setNiveaux([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
      setNiveaux([]);
    }
  };

  const loadUtilisateurs = async () => {
    try {
      const response = await adminService.getUsers();
      if (response.success && response.data) {
        setUtilisateurs(response.data);
      } else {
        setUtilisateurs([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setUtilisateurs([]);
    }
  };

  const loadNotifications = async () => {
    if (utilisateur?.id) {
      try {
        const notifications = await notificationService.getNotifications();
        setNotifications(notifications);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
        setNotifications([]);
      }
    }
  };

  const handleCreateClasse = async (classeData: any) => {
    try {
      const response = await adminService.createClasse(classeData);
      const nouvelleClasse = response.data;
      setClasses(prev => [...prev, nouvelleClasse]);
      setShowModal(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
    }
  };

  const handleUpdateClasse = async (classeData: any) => {
    try {
      await adminService.updateClasse(classeData.id, classeData);
      setClasses(prev => prev.map(c => c.id === classeData.id ? classeData : c));
      setShowModal(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
    }
  };

  const handleDeleteClasse = async (classeId: number) => {
    try {
      await adminService.deleteClasse(classeId);
      setClasses(prev => prev.filter(c => c.id !== classeId));
      setShowModalSuppression(false);
      setClasseASupprimer(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
    }
  };

  const handleTransferEleve = async (eleveId: number, classeDestination: number) => {
    try {
      await adminService.transfererEleve(eleveId, classeDestination);
      // Recharger les données
      loadClasses();
    } catch (error) {
      console.error('Erreur lors du transfert de l\'élève:', error);
    }
  };

  const handleTransferElevesAutomatique = async (classeId: number) => {
    try {
      await adminService.transfererElevesAutomatiquement(classeId);
      // Recharger les données
      loadClasses();
    } catch (error) {
      console.error('Erreur lors du transfert automatique des élèves:', error);
    }
  };

  const handleConfirmerTransfertAutomatique = async () => {
    try {
      await adminService.confirmerTransfertAutomatique();
      // Recharger les données
      loadClasses();
    } catch (error) {
      console.error('Erreur lors de la confirmation du transfert automatique:', error);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const classeData = {
      nom: formData.nom,
      niveau_id: parseInt(formData.niveauId),
      effectif_max: formData.effectifMax,
      description: formData.description,
      professeur_principal_id: formData.professeurPrincipalId ? parseInt(formData.professeurPrincipalId) : null,
      statut: formData.statut as "active" | "inactive" | "archivee"
    };

    try {
      if (editingClasse) {
        await adminService.updateClasse(editingClasse.id, classeData);
        setClasses(prev => prev.map(c => c.id === editingClasse.id ? { ...c, ...classeData } : c));
      } else {
        const response = await adminService.createClasse(classeData);
        setClasses(prev => [...prev, response.data]);
      }
      
      setShowModal(false);
      setFormData(initialFormData);
      setEditingClasse(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la classe:', error);
    }
  };

  const handleDelete = async () => {
    if (!classeASupprimer) return;
    
    try {
      await adminService.deleteClasse(classeASupprimer.id);
      setClasses(prev => prev.filter(c => c.id !== classeASupprimer!.id));
      setShowModalSuppression(false);
      setClasseASupprimer(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
    }
  };

  const handleTransferEleves = async () => {
    if (!classeSelectionnee) return;
    
    try {
      await adminService.transfererElevesAutomatiquement(classeSelectionnee.id);
      loadClasses();
    } catch (error) {
      console.error('Erreur lors du transfert des élèves:', error);
    }
  };

  const handleSaveReglesTransfert = async () => {
    try {
      await adminService.saveReglesTransfert(reglesTransfert);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des règles de transfert:', error);
    }
  };

  const handleEvolutionAnnee = async () => {
    try {
      // Appeler l'API d'évolution d'année
      await adminService.evolutionAnneeScolaire();
      
      // Recharger les données
      await Promise.all([
        loadClasses(),
        loadAnneesScolaires(),
        loadEleves()
      ]);
      
      setModalEvolutionAnnee(false);
      
      // Notification de succès
      alert('✅ Évolution réussie ! Tous les élèves ont été transférés vers l\'année supérieure.');
    } catch (error) {
      console.error('Erreur lors de l\'évolution d\'année:', error);
      alert('❌ Erreur lors de l\'évolution. Veuillez réessayer.');
    }
  };

  const handleViewDetails = useCallback((classe: Classe) => {
    setClasseSelectionnee(classe);
    setShowModalDetails(true);
  }, []);

  const handleEdit = useCallback((classe: Classe) => {
    setEditingClasse(classe);
    setFormData({
      nom: classe.nom,
      niveauId: classe.niveauId?.toString() || '',
      effectifMax: classe.effectifMax || 30,
      description: classe.description || '',
      professeurPrincipalId: classe.professeurPrincipalId?.toString() || '',
      statut: classe.statut
    });
    setShowModal(true);
  }, []);

  const handleDeleteClick = useCallback((classe: Classe) => {
    setClasseASupprimer(classe);
    setShowModalSuppression(true);
  }, []);



  const ModalChangerAnnee = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [anneeActuelle, setAnneeActuelle] = useState<any>(null);
    const [anneeId, setAnneeId] = useState<number | ''>('');

    const handleChangerAnnee = async () => {
      if (!anneeId || !anneeActuelle) return;
      
      try {
        // Désactiver l'année actuelle
        await adminService.updateAnneeScolaire(anneeActuelle.id, { statut: 'terminee' });
        
        // Activer la nouvelle année
        await adminService.updateAnneeScolaire(Number(anneeId), { statut: 'active' });
        
        onClose();
        setAnneeId('');
      } catch (error) {
        console.error('Erreur lors du changement d\'année scolaire:', error);
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Changer l'année scolaire active">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouvelle année scolaire active
            </label>
                        <select
              value={anneeId} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAnneeId(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une année</option>
              {Array.isArray(anneesScolaires) && anneesScolaires.map((annee) => (
                <option key={annee.id} value={annee.id}>
                  {annee.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleChangerAnnee}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    );
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
        
        <div className="flex gap-2">
        {/* Bouton règles de transfert (admin seulement) */}
        <button
          onClick={() => setModalReglesTransfert(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          title="Gérer les règles de transfert automatique"
        >
          <Settings className="w-4 h-4" />
          Règles de transfert
        </button>
        
        {/* Bouton évolution année scolaire */}
        <button
          onClick={() => setModalEvolutionAnnee(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          title="Faire évoluer tous les élèves vers l'année supérieure"
        >
          <ArrowRight className="w-4 h-4" />
          Évolution année
        </button>
        </div>
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
            <button
              onClick={() => setActiveTab("redoublants")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "redoublants"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4" />
                Redoublants
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
                onClick={() => setActiveTab("ajouter")}
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
                  Date de création
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
                        <p className="font-medium text-neutral-900">{safeString(classe.nom, 'Classe sans nom')}</p>
                        <p className="text-sm text-neutral-500">
                          {(classe as any).effectif_actuel || 0} élève{((classe as any).effectif_actuel || 0) > 1 ? 's' : ''} inscrit{((classe as any).effectif_actuel || 0) > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-neutral-900">{safeString(classe.niveauNom, 'Niveau inconnu')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getEffectifBadge((classe as any).effectif_actuel || 0, (classe as any).effectif_max || 30)}
                    <p className="text-xs text-neutral-500 mt-1">
                      {(classe as any).effectif_actuel || 0} élève{((classe as any).effectif_actuel || 0) > 1 ? 's' : ''} inscrit{((classe as any).effectif_actuel || 0) > 1 ? 's' : ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {classe.professeurPrincipalNom && classe.professeurPrincipalNom !== 'Non assigné' ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        <span className="text-neutral-900">{classe.professeurPrincipalNom}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-neutral-900">{safeDate(classe.dateCreation)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatutBadge(classe.statut)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(classe)}
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => transfererElevesAutomatiquement(classe.id)}
                        className="p-2 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Transférer automatiquement"
                      >
                        <ArrowRight className="w-4 h-4" />
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
            value: classes.reduce((sum, c) => sum + ((c as any).effectif_actuel || 0), 0),
            icon: <Users className="w-5 h-5" />,
            color: "bg-purple-500"
          },
          {
            title: "Capacité Moyenne",
            value: Math.round(classes.reduce((sum, c) => sum + (((c as any).effectif_actuel || 0) / ((c as any).effectif_max || 30) * 100), 0) / classes.length) + "%",
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
      ) : activeTab === "redoublants" ? (
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Gestion des Redoublants
            </h2>
            <OngletRedoublants 
              classes={classes}
              eleves={eleves}
              reglesTransfert={reglesTransfert}
              onTransfererEleve={transfererEleve}
            />
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
      <ModalDetailsClasse
        isOpen={showModalDetails}
        onClose={() => {
          setShowModalDetails(false);
          setClasseSelectionnee(null);
        }}
        classe={classeSelectionnee}
      />

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
              Règles appliquées : Moyenne ≥ {reglesTransfert.moyenne_minimale}/20, Transfert direct : {reglesTransfert.transfert_direct ? 'Oui' : 'Non'}
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
                    eleve.moyenneAnnuelle >= reglesTransfert.moyenne_minimale 
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
                value={reglesTransfert.moyenne_minimale}
                onChange={(e) => setReglesTransfert(prev => ({
                  ...prev,
                  moyenne_minimale: parseFloat(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut requis
              </label>
              <select
                value={reglesTransfert.statut_requis}
                onChange={(e) => setReglesTransfert(prev => ({
                  ...prev,
                  statut_requis: e.target.value as "inscrit" | "desinscrit" | "transfere" | "termine"
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
                checked={reglesTransfert.transfert_direct}
                onChange={(e) => setReglesTransfert(prev => ({
                  ...prev,
                  transfert_direct: e.target.checked
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
                checked={reglesTransfert.desactiver_annee_apres_transfert}
                onChange={(e) => setReglesTransfert(prev => ({
                  ...prev,
                  desactiver_annee_apres_transfert: e.target.checked
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
              onClick={handleSaveReglesTransfert}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal d'évolution d'année scolaire */}
      <Modal
        isOpen={modalEvolutionAnnee}
        onClose={() => setModalEvolutionAnnee(false)}
        title="Évolution vers l'année scolaire supérieure"
        size="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              🎓 Évolution automatique de tous les élèves
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Cette action va :
            </p>
            <ul className="text-sm text-blue-700 space-y-1 ml-4">
              <li>• Changer l'année scolaire active de <strong>2024-2025</strong> à <strong>2025-2026</strong></li>
              <li>• Transférer tous les élèves respectant les règles vers le niveau supérieur</li>
              <li>• 6ème → 5ème, 5ème → 4ème, etc.</li>
              <li>• Appliquer les règles : Moyenne ≥ {reglesTransfert.moyenne_minimale}/20</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-2">
              ⚠️ Attention
            </h4>
            <p className="text-sm text-orange-700">
              Cette action est <strong>irréversible</strong> et affectera tous les élèves de l'établissement.
              Assurez-vous que toutes les notes de l'année sont saisies avant de procéder.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setModalEvolutionAnnee(false)}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleEvolutionAnnee}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Lancer l'évolution
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
}> = ({ isOpen, onClose, classe }) => {
  const [elevesClasse, setElevesClasse] = useState<EleveClasse[]>([]);
  const [eleveSelectionne, setEleveSelectionne] = useState<EleveClasse | null>(null);
  const [modalDetailsEleve, setModalDetailsEleve] = useState(false);

  // Charger les élèves de la classe quand le modal s'ouvre
  useEffect(() => {
    if (!isOpen || !classe?.id) {
      setElevesClasse([]);
      return;
    }

    const loadEleves = async () => {
      try {
        const response = await eleveClasseService.getElevesByClasse(classe.id);
        if (response.success) {
          setElevesClasse(response.data || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des élèves de la classe:', error);
      }
    };

    loadEleves();
  }, [isOpen, classe?.id]);

  if (!classe) return null;

  // Fonctions utilitaires pour le modal
  const getEffectifClasseModal = (classe: Classe) => {
    return classe.effectifActuel || (classe as any).effectif_actuel || 0;
  };

  const getProfesseurPrincipalModal = (classe: Classe) => {
    return classe.professeurPrincipalNom || 'Non assigné';
  };

  const getEffectifMaxModal = (classe: Classe) => {
    const anneeActive = (classe.anneesScolaires || [])?.find(a => a.statut === "active");
    return anneeActive?.effectifMax || classe.effectifMax || (classe as any).effectif_max || 30;
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
              <div className="flex justify-end mb-4">
                {/* Removed button for changing school year */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                <p><strong>Nom :</strong> {classe.nom || 'Non défini'}</p>
                <p><strong>Niveau :</strong> {classe.niveauNom || 'Non défini'}</p>
                <p><strong>Statut :</strong> {classe.statut || 'Non défini'}</p>
                <p><strong>Professeur principal :</strong> {getProfesseurPrincipalModal(classe)}</p>
                </div>
                <div>
                <p><strong>Date de création :</strong> {formatDate(classe.dateCreation)}</p>
                {classe.dateModification && (
                  <p><strong>Dernière modification :</strong> {formatDate(classe.dateModification)}</p>
                  )}
                <p><strong>Effectif actuel :</strong> {getEffectifClasseModal(classe)} élèves</p>
                <p><strong>Effectif maximum :</strong> {getEffectifMaxModal(classe)} élèves</p>
                </div>
              </div>
            {classe.description && (
                <div className="mt-4">
                  <p><strong>Description :</strong></p>
                <p className="text-neutral-600 mt-1">{classe.description}</p>
                </div>
              )}
            </div>

          {/* Liste des élèves de la classe */}
              <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Élèves de la classe
                </h3>
            </div>
                
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600">Effectif total</p>
                <p className="text-xl font-bold text-green-800">{elevesClasse.length}/{getEffectifMaxModal(classe)}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600">Élèves transférables</p>
                <p className="text-xl font-bold text-blue-800">
                  {elevesClasse.filter(eleve => eleve.statut === "inscrit").length}
                </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-orange-600">Redoublants</p>
                <p className="text-xl font-bold text-orange-800">
                  {elevesClasse.filter(eleve => eleve.statut !== "inscrit").length}
                </p>
                  </div>
                </div>

                {/* Liste des élèves */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Liste des élèves</h4>
                <span className="text-sm text-gray-500">{elevesClasse.length} élève(s)</span>
                        </div>
                  
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date inscription
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {elevesClasse.map((eleve) => (
                      <tr key={eleve.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {eleve.prenom} {eleve.nom}
                            </p>
                        </div>
                      </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">
                            {new Date(eleve.dateInscription).toLocaleDateString('fr-FR')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            eleve.statut === "inscrit" ? "bg-green-100 text-green-800" :
                            eleve.statut === "transfere" ? "bg-blue-100 text-blue-800" :
                            eleve.statut === "desinscrit" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {eleve.statut === "inscrit" ? "Inscrit" :
                             eleve.statut === "transfere" ? "Transféré" :
                             eleve.statut === "desinscrit" ? "Désinscrit" : "Terminé"}
                        </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEleveSelectionne(eleve);
                                setModalDetailsEleve(true);
                              }}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Notes
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
        </div>
              
              {elevesClasse.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun élève
                  </h3>
                  <p className="text-gray-500">
                    Aucun élève n'est inscrit dans cette classe.
                  </p>
              </div>
            )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal des notes de l'élève */}
      <ModalNotesEleve
        isOpen={modalDetailsEleve}
        onClose={() => {
          setModalDetailsEleve(false);
          setEleveSelectionne(null);
        }}
        eleve={eleveSelectionne}
        anneesScolaires={[]}
      />
    </>
  );
};

// Composant Modal pour afficher les notes d'un élève par année et semestre
const ModalNotesEleve: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  eleve: EleveClasse | null;
  anneesScolaires: AnneeScolaire[];
}> = ({ isOpen, onClose, eleve, anneesScolaires }) => {
  const [notesData, setNotesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnnee, setSelectedAnnee] = useState<string>('');
  const [matieres, setMatieres] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen || !eleve?.id) {
      setNotesData([]);
      return;
    }

    const loadNotesEleve = async () => {
      setLoading(true);
      console.log('=== Début chargement notes pour élève ===', eleve.id);
      
      try {
        // 1. Récupérer les notes
        const notes = await noteService.getNotesEleve(eleve.id);
        console.log('Notes récupérées:', notes.length);
        
        // 2. Récupérer le niveau et les matières
        let matieresNiveau: any[] = [];
        try {
          const niveauResponse = await noteService.getNiveauEleve(eleve.id);
          console.log('Réponse niveau:', niveauResponse);
          
          if (niveauResponse.success && niveauResponse.data?.niveau_id) {
            matieresNiveau = await noteService.getMatieresByNiveau(niveauResponse.data.niveau_id);
            console.log('Matières du niveau:', matieresNiveau.length);
            setMatieres(matieresNiveau);
          } else {
            console.warn('Impossible de récupérer le niveau de l\'élève');
          }
        } catch (error) {
          console.error('Erreur niveau/matières:', error);
        }
        
        // 3. Organiser les notes par année et semestre
        const notesOrganisees = noteService.organiserNotesParAnnee(notes, anneesScolaires, matieresNiveau);
        setNotesData(notesOrganisees);
        
        // 4. Sélectionner automatiquement l'année active
        if (notesOrganisees.length > 0) {
          const anneesDisponibles = Array.from(new Set(notesOrganisees.map(n => n.anneeScolaireNom)));
          const anneeActive = anneesDisponibles.find(annee => 
            notesOrganisees.some(n => n.anneeScolaireNom === annee && n.statut === 'active')
          );
          setSelectedAnnee(anneeActive || anneesDisponibles[0] || '2024-2025');
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
        setNotesData([]);
      } finally {
        setLoading(false);
        console.log('=== Fin chargement notes ===');
      }
    };

    loadNotesEleve();
  }, [isOpen, eleve?.id]);

  const getColorByNote = (note: number) => {
    if (note >= 16) return 'text-green-600 bg-green-50';
    if (note >= 14) return 'text-blue-600 bg-blue-50';
    if (note >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getNoteByType = (notes: any[], type: string) => {
    const note = notes.find(n => n.type_evaluation === type);
    return note ? note.note : 0;
  };

  const calculerMoyenneSemestre = (notesParMatiere: any[]) => {
    if (!notesParMatiere || notesParMatiere.length === 0) return '0.00';
    
    let totalPondere = 0;
    let totalCoeff = 0;
    
    notesParMatiere.forEach(matiere => {
      if (matiere.moyenne && matiere.moyenne > 0) {
        totalPondere += matiere.moyenne * parseFloat(matiere.coefficient || 1);
        totalCoeff += parseFloat(matiere.coefficient || 1);
      }
    });
    
    return totalCoeff > 0 ? (totalPondere / totalCoeff).toFixed(2) : '0.00';
  };

  if (!eleve) return null;

  const anneesDisponibles = Array.from(new Set(notesData.map(n => n.anneeScolaireNom)));
  const donneesAnneeSelectionnee = notesData.filter(n => n.anneeScolaireNom === selectedAnnee);
  
  console.log('Debug année:', { selectedAnnee, anneesDisponibles, donneesAnneeSelectionnee: donneesAnneeSelectionnee.length, totalNotes: notesData.length });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Bulletin de notes - ${eleve.prenom} ${eleve.nom}`}
      size="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Informations élève */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Élève:</span>
              <p className="font-semibold">{eleve.prenom} {eleve.nom}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Moyenne générale:</span>
              <p className="font-semibold">
                {donneesAnneeSelectionnee.length > 0 && donneesAnneeSelectionnee[0].moyenneAnnuelle 
                  ? `${donneesAnneeSelectionnee[0].moyenneAnnuelle}/20` 
                  : `${eleve.moyenneAnnuelle}/20`}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Statut:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                eleve.statut === "inscrit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {eleve.statut === "inscrit" ? "Inscrit" : eleve.statut}
              </span>
            </div>
          </div>
        </div>

        {/* Sélecteur d'année scolaire */}
        <div className="flex gap-2 flex-wrap">
          {anneesDisponibles.length > 0 ? anneesDisponibles.map((annee: string) => (
            <button
              key={annee}
              onClick={() => setSelectedAnnee(annee)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedAnnee === annee 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {annee}
            </button>
          )) : (
            <button className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white">
              2024-2025
            </button>
          )}
        </div>



        {/* Tableau des notes */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Chargement des notes...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {[1, 2].map(semestre => {
              const donneesS = donneesAnneeSelectionnee.find(d => d.semestre === semestre);
              const notesParMatiere = donneesS?.notesParMatiere || [];
              const moyenneSemestre = donneesS?.moyenneSemestre || calculerMoyenneSemestre(notesParMatiere);
              
              console.log(`Semestre ${semestre}:`, { donneesS: donneesS ? 'existe' : 'undefined', notesParMatiere: notesParMatiere.length, moyenne: moyenneSemestre });
              if (donneesS && notesParMatiere.length > 0) {
                console.log('Exemple matiere:', notesParMatiere[0]);
                console.log('Notes de la matière:', notesParMatiere[0].notes);
              }
              
              return (
                <div key={semestre} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-4 py-3 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg text-blue-900">
                        {semestre === 1 ? '1er Semestre' : '2ème Semestre'}
                      </h3>
                      <div className={`px-3 py-1 rounded-full font-semibold ${getColorByNote(parseFloat(moyenneSemestre.toString()))}`}>
                        Moyenne: {moyenneSemestre}/20
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Matière</th>
                          <th className="px-3 py-3 text-center font-medium text-gray-600">Devoir 1</th>
                          <th className="px-3 py-3 text-center font-medium text-gray-600">Devoir 2</th>
                          <th className="px-3 py-3 text-center font-medium text-gray-600">Examen</th>
                          <th className="px-3 py-3 text-center font-medium text-gray-600">Moyenne</th>
                          <th className="px-3 py-3 text-center font-medium text-gray-600">Coef</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Appréciation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {notesParMatiere.length > 0 ? notesParMatiere.map((matiere: any, index: number) => {
                          const devoir1 = getNoteByType(matiere.notes, 'devoir1');
                          const devoir2 = getNoteByType(matiere.notes, 'devoir2');
                          const examen = getNoteByType(matiere.notes, 'examen');
                          const appreciation = matiere.notes.find((n: any) => n.appreciation)?.appreciation || '-';
                          
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {matiere.nom}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-1 rounded font-semibold ${getColorByNote(devoir1)}`}>
                                  {devoir1}/20
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-1 rounded font-semibold ${getColorByNote(devoir2)}`}>
                                  {devoir2}/20
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-1 rounded font-semibold ${getColorByNote(examen)}`}>
                                  {examen}/20
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-1 rounded font-bold ${getColorByNote(matiere.moyenne)}`}>
                                  {matiere.moyenne.toFixed(2)}/20
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center text-gray-600">
                                {matiere.coefficient}
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-sm">
                                {appreciation}
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                              Aucune note pour ce semestre
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
            
            {donneesAnneeSelectionnee.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune note disponible
                </h3>
                <p className="text-gray-500">
                  Aucune note pour cette année scolaire.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Classes;