import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Edit3, Trash2, Users, User, 
  School, Mail, Phone, MapPin, Calendar, GraduationCap,
  UserCheck, AlertCircle, CheckCircle, UserPlus, List, X,
  Baby, Heart, FileText, Eye, ChevronDown, BookOpen,
  Clock, Target, PlayCircle, Video, Volume2, Image, Link, File, Check, CalendarDays,
  Info, Settings, BarChart3, Users2, Clock3, BookOpenCheck, CalendarCheck,
  Headphones,
  BookOpen as BookOpenIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  Eye as EyeIcon,
  Settings as SettingsIcon,
  FileText as FileTextIcon,
  Video as VideoIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
  Share2 as Share2Icon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipForward as SkipForwardIcon,
  SkipBack as SkipBackIcon,
  Volume2 as Volume2Icon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  RotateCcw as RotateCcwIcon,
  Target as TargetIcon,
  PlayCircle as PlayCircleIcon,
  Check as CheckIcon,
  CalendarDays as CalendarDaysIcon,
  Info as InfoIcon,
  BarChart3 as BarChart3Icon,
  Users2 as Users2Icon,
  Clock3 as Clock3Icon,
  BookOpenCheck as BookOpenCheckIcon,
  CalendarCheck as CalendarCheckIcon,
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon,
  RefreshCw as RefreshCwIcon,
  Upload as UploadIcon,
  EyeOff as EyeOffIcon,
  UserX as UserXIcon
} from "lucide-react";
import { Cours, FormDataCours, CoursErrors, Creneau, STATUTS_COURS } from '../../models/cours.model';
import { JOURS_SEMAINE } from '../../models/emploi-du-temps.model';
import { Niveau } from '../../models/niveau.model';
import { Matiere } from '../../models/matiere.model';
import { Professeur } from '../../models/utilisateur.model';
import { AnneeScolaire } from '../../models/annee-scolaire.model';
import { adminService } from '../../services/adminService';
import { matiereService } from '../../services/matiereService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';
import { eleveService } from '../../services/eleveService';


// TODO: Remplacer par des appels aux services appropriés

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
  classes: any[];
  professeurs: Professeur[];
  matieres: any[];
  niveaux: any[];
  anneesScolaires: any[];
  anneeScolaireActive: any;
  salles: any[];
}> = ({ onSubmit, onClose, coursAModifier, modeEdition = false, classes, professeurs, matieres, niveaux, anneesScolaires, anneeScolaireActive, salles }) => {
  const [formData, setFormData] = useState<FormDataCours>({
    titre: coursAModifier?.titre || "",
    description: coursAModifier?.description || "",
    matiereId: coursAModifier?.matiereId || 0,
    niveauId: coursAModifier?.niveauId || 0,
    anneeScolaireId: coursAModifier?.anneeScolaireId || (anneeScolaireActive?.id || 2), // Année scolaire active
    semestresIds: coursAModifier?.semestresIds || [1, 2],
    heuresParSemaine: coursAModifier?.heuresParSemaine || 0,
    coefficient: coursAModifier?.coefficient || 0,
    professeurId: coursAModifier?.professeurId || undefined,
    statut: coursAModifier?.statut || "planifie" as const,
    creneaux: coursAModifier?.creneaux?.map(creneau => ({
      ...creneau,
      statut: creneau.statut || "planifie",
      dateCreation: creneau.dateCreation || new Date().toISOString()
    })) || []
  });

  const [errors, setErrors] = useState<CoursErrors>({});
  const [loading, setLoading] = useState(false);
  interface AssignationProfClasse {
    classeId: number;
    classeNom: string;
    professeurId: number;
    professeurNom: string;
  }

  const [assignationsProfesseurs, setAssignationsProfesseurs] = useState<AssignationProfClasse[]>([]);

  // Récupérer les matières disponibles pour le niveau sélectionné
  const matieresDuNiveau = formData.niveauId && Array.isArray(matieres) ? 
    matieres.filter((m: any) => {
      const hasNiveau = m.niveaux_ids && m.niveaux_ids.includes(formData.niveauId);
      console.log(`Matière ${m.nom} (ID: ${m.id}) - Niveau sélectionné: ${formData.niveauId}, Niveaux disponibles: ${m.niveaux_ids}, Incluse: ${hasNiveau}`);
      return hasNiveau;
    }) : [];
  
  console.log('Matières du niveau sélectionné:', matieresDuNiveau);

  // Récupérer les informations de la matière sélectionnée
  const matiereNiveauSelectionnee = formData.matiereId && formData.niveauId ?
    matieres.find((m: any) => m.id === formData.matiereId && m.niveaux_ids && m.niveaux_ids.includes(formData.niveauId)) : null;

  // Mettre à jour automatiquement les heures et coefficient quand la matière change
  useEffect(() => {
    if (matiereNiveauSelectionnee) {
      setFormData(prev => ({
        ...prev,
        heuresParSemaine: (matiereNiveauSelectionnee as any).heures_par_semaine || 0,
        coefficient: (matiereNiveauSelectionnee as any).coefficient || 1
      }));
    }
  }, [matiereNiveauSelectionnee]);

  // Réinitialiser la matière quand le niveau change
  useEffect(() => {
    if (formData.niveauId) {
      setFormData(prev => ({
        ...prev,
        matiereId: 0, // Réinitialiser la matière sélectionnée
        professeurId: undefined // Réinitialiser le professeur sélectionné
      }));
    }
  }, [formData.niveauId]);

  // Obtenir les classes du niveau sélectionné
  const classesDuNiveau = Array.isArray(classes) ? classes.filter(classe => {
    // Support pour différentes structures de données
    const niveauId = classe.niveauId || classe.niveau_id;
    return niveauId === formData.niveauId;
  }) : [];
  
  console.log('Debug classes:', {
    niveauSelectionne: formData.niveauId,
    totalClasses: classes.length,
    classesDuNiveau: classesDuNiveau.length,
    premieresClasses: classes.slice(0, 3),
    classesFiltrees: classesDuNiveau
  });

  // Obtenir les professeurs de la matière sélectionnée
  const professeursDeLaMatiere = Array.isArray(professeurs) ? professeurs.filter(prof => {
    // Vérifier différentes structures possibles pour les matières du professeur
    if (!prof.matieres) return false;
    
    // Si c'est un tableau d'objets avec id
    if (Array.isArray(prof.matieres)) {
      return prof.matieres.some((matiere: any) => {
        return matiere.id === formData.matiereId || matiere.matiere_id === formData.matiereId;
      });
    }
    
    // Si c'est un tableau d'IDs
    if (typeof prof.matieres === 'string') {
      try {
        const matieresIds = JSON.parse(prof.matieres);
        return Array.isArray(matieresIds) && matieresIds.includes(formData.matiereId);
      } catch {
        return false;
      }
    }
    
    return false;
  }) : [];
  
  console.log('Professeurs disponibles:', professeurs.length);
  console.log('Matière sélectionnée:', formData.matiereId);
  console.log('Professeurs de la matière:', professeursDeLaMatiere.length);
  
  // Debug amélioré
  if (formData.matiereId && professeurs.length > 0) {
    console.log('Debug filtrage professeurs:');
    professeurs.slice(0, 3).forEach((prof, index) => {
      console.log(`Professeur ${index + 1}:`, {
        nom: prof.nom,
        prenom: prof.prenom,
        matieres: prof.matieres,
        type: typeof prof.matieres
      });
    });
  }

  // Initialiser les assignations quand le niveau change
  useEffect(() => {
    const nouvellesAssignations = classesDuNiveau.map(classe => ({
      classeId: classe.id,
      classeNom: classe.nom,
      professeurId: 0,
      professeurNom: ""
    }));
    setAssignationsProfesseurs(nouvellesAssignations);
  }, [formData.niveauId]);

  // Mettre à jour le nom du professeur quand l'ID change
  const updateProfesseurNom = (classeId: number, professeurId: number) => {
    const professeur = professeursDeLaMatiere.find(p => p.id === professeurId);
    setAssignationsProfesseurs(prev => 
      prev.map(assignation => 
        assignation.classeId === classeId 
          ? { ...assignation, professeurId, professeurNom: professeur ? `${professeur.prenom} ${professeur.nom}` : "" }
          : assignation
      )
    );
  };



  // Supprimer un créneau
  const supprimerCreneau = (id: number) => {
    setFormData({
      ...formData,
      creneaux: (formData.creneaux || []).filter((creneau: Creneau) => creneau.id !== id)
    });
  };

  // Mettre à jour un créneau
  const updateCreneau = (id: number, field: keyof Creneau, value: string | number) => {
    setFormData({
      ...formData,
      creneaux: (formData.creneaux || []).map((creneau: Creneau) => 
        creneau.id === id ? { ...creneau, [field]: value } : creneau
      )
    });
  };

  const validateForm = () => {
    const newErrors: CoursErrors = {};
    if (!formData.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!formData.description?.trim()) newErrors.description = "La description est requise";
    if (!formData.matiereId || formData.matiereId === 0) newErrors.matiereId = "La matière est requise";
    if (!formData.niveauId || formData.niveauId === 0) newErrors.niveauId = "Le niveau est requis";
    if (!formData.anneeScolaireId || formData.anneeScolaireId === 0) newErrors.anneeScolaireId = "L'année scolaire est requise";
    if (!formData.heuresParSemaine || formData.heuresParSemaine === 0) {
      newErrors.heuresParSemaine = "Les heures par semaine sont requises";
    } else if (formData.heuresParSemaine % 2 !== 0) {
      newErrors.heuresParSemaine = "Les heures par semaine doivent être un nombre pair";
    }
    if (!formData.coefficient || formData.coefficient === 0) {
      newErrors.coefficient = "Le coefficient est requis";
    } else if (formData.coefficient < 0 || formData.coefficient > 10) {
      newErrors.coefficient = "Le coefficient doit être entre 0 et 10";
    }

    if (!formData.semestresIds || formData.semestresIds.length === 0) {
      newErrors.semestresIds = "Au moins un semestre doit être sélectionné";
    }

    // Validation des assignations de professeurs
    const assignationsIncompletes = assignationsProfesseurs.filter(assignation => assignation.professeurId === 0);
    if (assignationsIncompletes.length > 0) {
      newErrors.assignations = `Veuillez assigner un professeur pour ${assignationsIncompletes.length} classe(s)`;
    }

    // Validation des créneaux par classe
    let erreurCreneaux = false;
    const creneauxRequis = formData.heuresParSemaine / 2; // Nombre de créneaux de 2h requis
    
    assignationsProfesseurs.forEach(assignation => {
      const creneauxClasse = (formData.creneaux || []).filter(c => c.classeId === assignation.classeId);
      
      if (assignation.professeurId !== 0) { // Seulement valider si un professeur est assigné
        if (creneauxClasse.length === 0) {
          newErrors.creneaux = `La classe ${assignation.classeNom} doit avoir ${creneauxRequis} créneau(x) de 2h`;
          erreurCreneaux = true;
        } else if (creneauxClasse.length !== creneauxRequis) {
          newErrors.creneaux = `La classe ${assignation.classeNom} doit avoir exactement ${creneauxRequis} créneau(x) de 2h (actuellement: ${creneauxClasse.length})`;
          erreurCreneaux = true;
        }
      }
    });
    
    // Vérifier que chaque créneau fait exactement 2h
    (formData.creneaux || []).forEach((creneau, index) => {
      const debut = new Date(`2000-01-01T${creneau.heureDebut}`);
      const fin = new Date(`2000-01-01T${creneau.heureFin}`);
      const duree = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
      
      if (duree !== 2) {
        newErrors.creneaux = `Chaque créneau doit durer exactement 2 heures (Créneau ${index + 1}: ${duree}h)`;
      }
    });
    
    // Vérifier les conflits de créneaux (même jour/heure)
    const creneauxActifs = formData.creneaux || [];
    for (let i = 0; i < creneauxActifs.length; i++) {
      for (let j = i + 1; j < creneauxActifs.length; j++) {
        const creneau1 = creneauxActifs[i];
        const creneau2 = creneauxActifs[j];
        
        if (creneau1.jour === creneau2.jour && 
            creneau1.heureDebut === creneau2.heureDebut) {
          newErrors.creneaux = `Conflit de créneaux: ${creneau1.jour} à ${creneau1.heureDebut}`;
          break;
        }
        
        // Vérifier les conflits de salles
        if (creneau1.salleId && creneau2.salleId && 
            creneau1.salleId === creneau2.salleId &&
            creneau1.jour === creneau2.jour && 
            creneau1.heureDebut === creneau2.heureDebut) {
          const salle = salles.find(s => s.id === creneau1.salleId);
          newErrors.creneaux = `Conflit de salle: ${salle?.nom || 'Salle'} occupée le ${creneau1.jour} à ${creneau1.heureDebut}`;
          break;
        }
      }
      if (newErrors.creneaux) break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Préparer les données pour l'API backend
      const coursData = {
        titre: formData.titre,
        description: formData.description,
        matiere_id: formData.matiereId,
        niveau_id: formData.niveauId,
        annee_scolaire_id: formData.anneeScolaireId,
        semestres_ids: [1, 2],
        heures_par_semaine: formData.heuresParSemaine,
        coefficient: formData.coefficient,
        statut: formData.statut || "planifie",
        assignations: assignationsProfesseurs.map(assignation => ({
          classeId: assignation.classeId,
          professeurId: assignation.professeurId
        })),
        creneaux: (formData.creneaux || []).map(creneau => ({
          jour: creneau.jour,
          heureDebut: creneau.heureDebut,
          heureFin: creneau.heureFin,
          classeId: creneau.classeId,
          salleId: creneau.salleId || null,
          professeurId: creneau.professeurId
        }))
      };

      // Créer l'objet Cours pour l'interface
      const nouveauCours: Cours = {
        id: modeEdition ? (coursAModifier?.id || Date.now()) : Date.now(),
        titre: formData.titre,
        description: formData.description,
        matiereId: formData.matiereId,
        niveauId: formData.niveauId,
        anneeScolaireId: formData.anneeScolaireId,
        semestresIds: [1, 2],
        dateCreation: modeEdition ? (coursAModifier?.dateCreation || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
        dateModification: modeEdition ? new Date().toISOString().split('T')[0] : undefined,
        matiereNom: matieres.find(m => m.id === formData.matiereId)?.nom || "",
        niveauNom: niveaux.find(n => n.id === formData.niveauId)?.nom || "",
        anneeScolaireNom: anneesScolaires.find(a => a.id === formData.anneeScolaireId)?.nom || "",
        ressources: modeEdition ? (coursAModifier?.ressources || []) : [],
        statut: formData.statut || "planifie",
        assignations: assignationsProfesseurs.map((assignation, index) => ({
          id: index + 1,
          classeId: assignation.classeId,
          coursId: modeEdition ? (coursAModifier?.id || Date.now()) : Date.now(),
          anneeScolaireId: formData.anneeScolaireId,
          heuresParSemaine: formData.heuresParSemaine,
          statut: "active" as const,
          professeurNom: assignation.professeurNom
        })),
        creneaux: (formData.creneaux || []).map((creneau: Creneau, index: number) => ({
          ...creneau,
          id: index + 1,
          classeNom: classesDuNiveau.find(c => c.id === creneau.classeId)?.nom || "",
          professeurNom: professeursDeLaMatiere.find(p => p.id === creneau.professeurId)?.nom || ""
        })),
        heuresParSemaine: formData.heuresParSemaine,
        coefficient: formData.coefficient
      };

      // Envoyer les données au backend via onSubmit
      onSubmit(coursData as any);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setLoading(false);
    }
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
              onChange={(e) => setFormData({...formData, matiereId: parseInt(e.target.value) || 0})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.matiereId ? 'border-red-500' : 'border-neutral-300'
              }`}
            >
              <option value="">Sélectionner une matière</option>
              {Array.isArray(matieresDuNiveau) && matieresDuNiveau.map((matiere: any) => (
                <option key={matiere.id} value={matiere.id}>
                  {matiere.nom} ({matiere.heures_par_semaine || 0}h/sem, coef: {matiere.coefficient || 1})
                  </option>
              ))}
            </select>
            {errors.matiereId && <p className="text-red-500 text-sm mt-1">{errors.matiereId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Niveau *
            </label>
            <select
              value={formData.niveauId.toString()}
              onChange={(e) => setFormData({...formData, niveauId: parseInt(e.target.value) || 0})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.niveauId ? 'border-red-500' : 'border-neutral-300'
              }`}
            >
              <option value="">Sélectionner un niveau</option>
              {Array.isArray(niveaux) && niveaux.map(niveau => (
                <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
              ))}
            </select>
            {errors.niveauId && <p className="text-red-500 text-sm mt-1">{errors.niveauId}</p>}
          </div>


        </div>



        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Année Scolaire *
            </label>
            <div className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-700">
              {anneeScolaireActive ? anneeScolaireActive.nom : 'Année scolaire actuelle'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Heures par semaine *
            </label>
            <input
              type="number"
              min="0"
              step="2"
              value={formData.heuresParSemaine}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                // S'assurer que c'est un nombre pair
                const adjustedValue = value % 2 === 0 ? value : value - 1;
                setFormData({...formData, heuresParSemaine: adjustedValue});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.heuresParSemaine ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Nombre d'heures (chiffre pair)"
            />
            {errors.heuresParSemaine && <p className="text-red-500 text-sm mt-1">{errors.heuresParSemaine}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Coefficient *
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={formData.coefficient}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setFormData({...formData, coefficient: value});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.coefficient ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Coefficient (0-10)"
            />
            {errors.coefficient && <p className="text-red-500 text-sm mt-1">{errors.coefficient}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Statut
            </label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value as "active" | "terminee" | "annulee" | "en_cours" | "planifie"})}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUTS_COURS.map(statut => (
                <option key={statut.value} value={statut.value}>{statut.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Informations automatiques */}
        {matiereNiveauSelectionnee && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Informations de la matière</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Heures par semaine (suggérées):</span>
                <span className="ml-2 font-medium">{(matiereNiveauSelectionnee as any).heures_par_semaine || 0}h</span>
              </div>
              <div>
                <span className="text-blue-700">Coefficient:</span>
                <span className="ml-2 font-medium">{(matiereNiveauSelectionnee as any).coefficient || 1}</span>
              </div>
            </div>
          </div>
        )}

        {/* Assignation par classe avec professeur et horaires */}
        {formData.niveauId && formData.niveauId !== 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Assignation par classe ({formData.heuresParSemaine}h/semaine)
            </h3>
            
            {classesDuNiveau.length > 0 ? (
              <div className="space-y-4">
                {assignationsProfesseurs.map((assignation, index) => {
                const creneauxClasse = (formData.creneaux || []).filter(c => c.classeId === assignation.classeId);
                const totalHeuresClasse = creneauxClasse.reduce((total, creneau) => {
                  const debut = new Date(`2000-01-01T${creneau.heureDebut}`);
                  const fin = new Date(`2000-01-01T${creneau.heureFin}`);
                  return total + (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
                }, 0);
                
                return (
                  <div key={assignation.classeId} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <School className="w-4 h-4" />
                        {assignation.classeNom}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          totalHeuresClasse === formData.heuresParSemaine 
                            ? 'bg-green-100 text-green-800' 
                            : totalHeuresClasse > formData.heuresParSemaine
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {totalHeuresClasse}h/{formData.heuresParSemaine}h
                        </span>
                      </div>
                    </div>
                    
                    {/* Sélection du professeur */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professeur assigné *
                        {professeursDeLaMatiere.length === 0 && (
                          <span className="text-red-500 text-xs ml-1">(Aucun professeur disponible pour cette matière)</span>
                        )}
                      </label>
                      <select
                        value={assignation.professeurId}
                        onChange={(e) => updateProfesseurNom(assignation.classeId, parseInt(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          assignation.professeurId === 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        disabled={loading || professeursDeLaMatiere.length === 0}
                      >
                        <option value={0}>
                          {professeursDeLaMatiere.length === 0 
                            ? "Aucun professeur disponible" 
                            : "Sélectionner un professeur"}
                        </option>
                        {professeursDeLaMatiere.map(prof => (
                          <option key={prof.id} value={prof.id}>
                            {prof.prenom} {prof.nom}
                          </option>
                        ))}
                      </select>
                      {assignation.professeurId === 0 && professeursDeLaMatiere.length > 0 && (
                        <p className="text-red-500 text-xs mt-1">Veuillez sélectionner un professeur avant d'ajouter des créneaux</p>
                      )}
                    </div>
                    
                    {/* Créneaux horaires pour cette classe */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Créneaux horaires (2h par créneau)</label>
                          <p className="text-xs text-gray-500 mt-1">
                            Requis: {formData.heuresParSemaine / 2} créneau(x) de 2h | 
                            Actuel: {creneauxClasse.length} créneau(x)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const nouveauCreneau: Creneau = {
                              id: Date.now(),
                              jour: "lundi",
                              heureDebut: "08:00",
                              heureFin: "10:00",
                              classeId: assignation.classeId,
                              salleId: undefined,
                              salleNom: "",
                              professeurId: assignation.professeurId,
                              classeNom: assignation.classeNom,
                              professeurNom: assignation.professeurNom,
                              statut: "planifie" as const,
                              dateCreation: new Date().toISOString()
                            };
                            setFormData(prev => ({
                              ...prev,
                              creneaux: [...(prev.creneaux || []), nouveauCreneau]
                            }));
                          }}
                          disabled={creneauxClasse.length >= (formData.heuresParSemaine / 2) || assignation.professeurId === 0}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={assignation.professeurId === 0 ? "Sélectionnez d'abord un professeur" : 
                                 creneauxClasse.length >= (formData.heuresParSemaine / 2) ? "Nombre maximum de créneaux atteint" : "Ajouter un nouveau créneau"}
                        >
                          <Plus className="w-3 h-3" />
                          Ajouter créneau
                        </button>
                      </div>
                      
                      {creneauxClasse.map((creneau, creneauIndex) => (
                        <div key={creneau.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Créneau {creneauIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => supprimerCreneau(creneau.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Jour</label>
                              <select
                                value={creneau.jour}
                                onChange={(e) => updateCreneau(creneau.id, 'jour', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              >
                                {JOURS_SEMAINE.map(jour => (
                                  <option key={jour.value} value={jour.value}>{jour.label}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Début</label>
                              <input
                                type="time"
                                value={creneau.heureDebut}
                                onChange={(e) => {
                                  updateCreneau(creneau.id, 'heureDebut', e.target.value);
                                  // Auto-calculer l'heure de fin (+2h)
                                  const debut = new Date(`2000-01-01T${e.target.value}`);
                                  debut.setHours(debut.getHours() + 2);
                                  const heureFin = debut.toTimeString().slice(0, 5);
                                  updateCreneau(creneau.id, 'heureFin', heureFin);
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Fin</label>
                              <input
                                type="time"
                                value={creneau.heureFin}
                                readOnly
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Salle (optionnel)</label>
                              <select
                                value={creneau.salleId || ''}
                                onChange={(e) => {
                                  const salleId = e.target.value ? parseInt(e.target.value) : undefined;
                                  updateCreneau(creneau.id, 'salleId', salleId || 0);
                                  const salle = salles.find(s => s.id === salleId);
                                  updateCreneau(creneau.id, 'salleNom', salle?.nom || '');
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Aucune salle</option>
                                {salles.map(salle => (
                                  <option key={salle.id} value={salle.id}>{salle.nom}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {creneauxClasse.length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded border-2 border-dashed border-gray-300">
                          {assignation.professeurId === 0 
                            ? "Veuillez d'abord sélectionner un professeur pour ajouter des créneaux"
                            : "Aucun créneau défini pour cette classe - Cliquez sur 'Ajouter créneau' pour commencer"
                          }
                        </div>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune classe trouvée</h3>
                <p className="text-gray-600 mb-4">
                  Aucune classe n'est disponible pour le niveau sélectionné ({niveaux.find(n => n.id === formData.niveauId)?.nom}).
                </p>
                <p className="text-sm text-gray-500">
                  Veuillez d'abord créer des classes pour ce niveau dans la section "Gestion des Classes".
                </p>
              </div>
            )}
            
            {errors.assignations && (
              <p className="text-red-500 text-sm">{errors.assignations}</p>
            )}
            
            {errors.creneaux && (
              <p className="text-red-500 text-sm">{errors.creneaux}</p>
            )}
            
            {professeursDeLaMatiere.length === 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">
                  Aucun professeur disponible pour cette matière. Veuillez d'abord assigner des professeurs à cette matière.
                </p>
              </div>
            )}
          </div>
        )}


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

// Modal de détails complet du cours avec onglets
const ModalDetailsCoursComplet: React.FC<{
  cours: Cours;
  professeurs: Professeur[];
  classes: any[];
  eleves: any[];
  onClose: () => void;
  isProfesseur?: boolean;
}> = ({ cours, professeurs, classes, eleves, onClose, isProfesseur = false }) => {
  const [activeTab, setActiveTab] = useState<"infos" | "classes" | "emploi" | "notes" | "presences">(isProfesseur ? "classes" : "infos");
  const [classeDetails, setClasseDetails] = useState<any>(null);
  const [showClasseDetails, setShowClasseDetails] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showPresencesModal, setShowPresencesModal] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<any>(null);
  const [notes, setNotes] = useState<any>({});
  const [presences, setPresences] = useState<any>({});

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "planifie": return "bg-blue-100 text-blue-800";
      case "en_cours": return "bg-green-100 text-green-800";
      case "termine": return "bg-gray-100 text-gray-800";
      case "annule": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "planifie": return <Calendar className="w-4 h-4" />;
      case "en_cours": return <PlayCircle className="w-4 h-4" />;
      case "termine": return <CheckCircle className="w-4 h-4" />;
      case "annule": return <X className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const classesDuCours = classes.filter(classe => 
    cours.assignations?.some(assignation => assignation.classeId === classe.id)
  );



  const tabs = isProfesseur ? [
    { id: "classes", label: "Mes Classes", icon: <Users2 className="w-4 h-4" /> },
    { id: "infos", label: "Informations", icon: <Info className="w-4 h-4" /> },
    { id: "emploi", label: "Emploi du temps", icon: <CalendarCheck className="w-4 h-4" /> }
  ] : [
    { id: "infos", label: "Informations", icon: <Info className="w-4 h-4" /> },
    { id: "classes", label: "Classes assignées", icon: <Users2 className="w-4 h-4" /> },
    { id: "emploi", label: "Emploi du temps", icon: <CalendarCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{cours.titre}</h2>
              <p className="text-sm text-gray-600">
                {cours.matiereNom} - {cours.niveauNom} - {cours.anneeScolaireNom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {activeTab === "infos" && (
              <motion.div
                key="infos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Informations générales */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Titre :</span>
                        <span className="font-medium">{cours.titre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Matière :</span>
                        <span className="font-medium">{cours.matiereNom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Niveau :</span>
                        <span className="font-medium">{cours.niveauNom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Année scolaire :</span>
                        <span className="font-medium">{cours.anneeScolaireNom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heures par semaine :</span>
                        <span className="font-medium">{cours.heuresParSemaine}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coefficient :</span>
                        <span className="font-medium">{cours.coefficient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut :</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatutColor(cours.statut)}`}>
                          {getStatutIcon(cours.statut)}
                          {cours.statut}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date de création :</span>
                        <span className="font-medium">{formatDate(cours.dateCreation)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{cours.description}</p>
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Classes assignées</p>
                        <p className="text-2xl font-bold text-blue-900">{cours.assignations?.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock3 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600 font-medium">Créneaux horaires</p>
                        <p className="text-2xl font-bold text-green-900">{cours.creneaux?.length || 0}</p>
                      </div>
                    </div>
                  </div>


                </div>
              </motion.div>
            )}

            {activeTab === "classes" && (
              <motion.div
                key="classes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {!showClasseDetails ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Classes assignées</h3>
                      <button
                        onClick={() => setShowClasseDetails(false)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        ← Retour
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {classesDuCours.map((classe) => {
                        const assignation = cours.assignations?.find(a => a.classeId === classe.id);
                        const professeur = professeurs.find(p => p.id === assignation?.professeurId);
                        const elevesClasse = eleves.filter(eleve => (eleve.classeId || eleve.classe_id) === classe.id);
                        
                        return (
                          <div key={classe.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{classe.nom}</h4>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {elevesClasse.length} élèves
                              </span>
                            </div>
                            
                                                    <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <School className="w-4 h-4" />
                            <span>{classe.niveauNom}</span>
                          </div>
                          
                          {assignation && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{assignation.professeurNom}</span>
                            </div>
                          )}
                          
                          {assignation && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(assignation.statut)}`}>
                                {assignation.statut}
                              </span>
                            </div>
                          )}
                        </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              {isProfesseur ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setClasseDetails(classe);
                                      setShowNotesModal(true);
                                    }}
                                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    Gérer Notes
                                  </button>
                                  <button
                                    onClick={() => {
                                      setClasseDetails(classe);
                                      setShowPresencesModal(true);
                                    }}
                                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    Présences
                                  </button>
                                  <button
                                    onClick={() => {
                                      setClasseDetails(classe);
                                      setShowClasseDetails(true);
                                    }}
                                    className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                                  >
                                    Détails
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setClasseDetails(classe);
                                    setShowClasseDetails(true);
                                  }}
                                  className="w-full text-left"
                                >
                                  <p className="text-xs text-gray-500">Cliquez pour voir les détails</p>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <button
                          onClick={() => setShowClasseDetails(false)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                        >
                          ← Retour aux classes
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">{classeDetails.nom}</h3>
                        <p className="text-sm text-gray-600">{classeDetails.niveauNom} - Année scolaire actuelle</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Informations de la classe */}
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Informations de la classe</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nom de la classe :</span>
                            <span className="font-medium">{classeDetails.nom}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Niveau :</span>
                            <span className="font-medium">{classeDetails.niveauNom}</span>
                          </div>
                          {cours.assignations?.find(a => a.classeId === classeDetails.id) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Professeur assigné :</span>
                              <span className="font-medium text-blue-600">
                                {cours.assignations.find(a => a.classeId === classeDetails.id)?.professeurNom}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Statut :</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {classeDetails.statut}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date de création :</span>
                            <span className="font-medium">{formatDate(classeDetails.dateCreation)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Statistiques */}
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Statistiques</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-blue-600 font-medium">Élèves</p>
                                <p className="text-xl font-bold text-blue-900">
                                  {(() => {
                                    const elevesClasse = eleves.filter(eleve => (eleve.classeId || eleve.classe_id) === classeDetails.id);
                                    return elevesClasse.length;
                                  })()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-green-600 font-medium">Moyenne</p>
                                <p className="text-xl font-bold text-green-900">
                                  {(() => {
                                    const elevesClasse = eleves.filter(eleve => (eleve.classeId || eleve.classe_id) === classeDetails.id);
                                    return elevesClasse.length > 0 
                                      ? (elevesClasse.reduce((acc: number, eleve: any) => acc + eleve.moyenne, 0) / elevesClasse.length).toFixed(2)
                                      : "0.00";
                                  })()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Liste des élèves */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Liste des élèves</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moyenne</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {(() => {
                              const elevesClasse = eleves.filter(eleve => (eleve.classeId || eleve.classe_id) === classeDetails.id);
                              return elevesClasse.map((eleve: any) => (
                                <tr key={eleve.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {eleve.nom}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {eleve.prenom}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      eleve.moyenne >= 14 ? 'bg-green-100 text-green-800' :
                                      eleve.moyenne >= 10 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {eleve.moyenne.toFixed(2)}/20
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      {eleve.statut}
                                    </span>
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === "emploi" && (
              <motion.div
                key="emploi"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">Emploi du temps</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Répartition des {cours.heuresParSemaine}h par semaine ({cours.heuresParSemaine / 2} créneaux de 2h par classe)
                </p>
                
                <div className="space-y-4">
                  {classesDuCours.map((classe) => {
                    const assignation = cours.assignations?.find(a => a.classeId === classe.id);
                    const professeur = professeurs.find(p => p.id === assignation?.professeurId);
                    const creneauxClasse = cours.creneaux?.filter(c => c.classeId === classe.id) || [];
                    
                    return (
                      <div key={classe.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{classe.nom}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {creneauxClasse.length} créneaux de 2h
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {creneauxClasse.length * 2}h/semaine
                            </span>
                          </div>
                        </div>
                        
                        {assignation && (
                          <p className="text-sm text-gray-600 mb-3">
                            Professeur : <span className="font-medium text-blue-600">{assignation.professeurNom}</span>
                          </p>
                        )}
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-gray-50 rounded-lg">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Jour</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Heure</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Salle</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {creneauxClasse.map((creneau, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                  <td className="px-3 py-2 text-sm font-medium text-gray-900 capitalize">
                                    {creneau.jour}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-600">
                                    {creneau.heureDebut} - {creneau.heureFin}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-600">
                                    {creneau.salleNom || "Non définie"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}


          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal Gestion des Notes */}
      {showNotesModal && classeDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">Gestion des Notes - {classeDetails.nom}</h3>
              <button onClick={() => setShowNotesModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {eleves.filter(eleve => (eleve.classeId || eleve.classe_id) === classeDetails.id).map((eleve: any) => (
                  <div key={eleve.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{eleve.prenom} {eleve.nom}</h4>
                      <span className="text-sm text-gray-600">Moyenne: {eleve.moyenne?.toFixed(2) || '0.00'}/20</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {['devoir1', 'devoir2', 'examen'].map((type) => (
                        <div key={type} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {type === 'devoir1' ? 'Devoir 1' : type === 'devoir2' ? 'Devoir 2' : 'Examen'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            placeholder="/20"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              const key = `${eleve.id}-${type}`;
                              setNotes((prev: any) => ({ ...prev, [key]: e.target.value }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Appréciation</label>
                      <textarea
                        rows={2}
                        placeholder="Commentaire sur le travail de l'élève..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const key = `${eleve.id}-appreciation`;
                          setNotes((prev: any) => ({ ...prev, [key]: e.target.value }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // Ici on sauvegarderait les notes
                    console.log('Notes à sauvegarder:', notes);
                    setShowNotesModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestion des Présences */}
      {showPresencesModal && classeDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">Présences - {classeDetails.nom}</h3>
              <button onClick={() => setShowPresencesModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date du cours</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                {eleves.filter(eleve => (eleve.classeId || eleve.classe_id) === classeDetails.id).map((eleve: any) => (
                  <div key={eleve.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{eleve.prenom} {eleve.nom}</p>
                        <p className="text-sm text-gray-600">{eleve.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPresences((prev: any) => ({ ...prev, [eleve.id]: 'present' }));
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          presences[eleve.id] === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        Présent
                      </button>
                      <button
                        onClick={() => {
                          setPresences((prev: any) => ({ ...prev, [eleve.id]: 'absent' }));
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          presences[eleve.id] === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowPresencesModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // Ici on sauvegarderait les présences
                    console.log('Présences à sauvegarder:', presences);
                    setShowPresencesModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const CoursAdmin: React.FC = () => {
  const { utilisateur } = useAuth();
  const [cours, setCours] = useState<Cours[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [eleves, setEleves] = useState<any[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [niveaux, setNiveaux] = useState<any[]>([]);
  const [matieres, setMatieres] = useState<any[]>([]);
  const [anneesScolaires, setAnneesScolaires] = useState<any[]>([]);
  const [anneeScolaireActive, setAnneeScolaireActive] = useState<any>(null);
  const [salles, setSalles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("");
  const [filterMatiere, setFilterMatiere] = useState<string>("");
  const [filterNiveau, setFilterNiveau] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"liste" | "ajouter">("liste");


  // Missing state variables
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({
    niveauId: "",
    matiereId: "",
    anneeScolaireId: ""
  });
  const [editingCours, setEditingCours] = useState<Cours | null>(null);
  const initialFormData = {
    niveauId: "",
    matiereId: "",
    anneeScolaireId: ""
  };

  const [coursAModifier, setCoursAModifier] = useState<Cours | null>(null);
  const [showModalModification, setShowModalModification] = useState(false);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [coursSelectionne, setCoursSelectionne] = useState<Cours | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Charger les données au montage
  useEffect(() => {
    if (utilisateur) {
      loadCours();
      loadMatieres();
      loadNiveaux();
      loadProfesseurs();
      loadAnneesScolaires();
      loadClasses();
      loadEleves();
      loadSalles();
      loadNotifications();
    }
  }, [utilisateur]);

  const loadCours = async () => {
    setLoading(true);
    try {
      console.log('Chargement des cours...');
      const response = await adminService.getCours();
      console.log('Réponse getCours:', response);
      
      if (response.success && response.data) {
        // Transformer les données pour correspondre au modèle frontend
        const coursTransformes = response.data.map((cours: any) => {
          console.log('Cours brut:', cours);
          console.log('Créneaux du cours:', cours.creneaux);
          
          // Gérer les assignations (peut être assignations ou assignations_professeurs)
          const assignations = cours.assignations || cours.assignations_professeurs || [];
          
          return {
            id: cours.id,
            titre: cours.titre,
            description: cours.description,
            matiereId: cours.matiere_id,
            matiereNom: cours.matiere?.nom || 'Matière inconnue',
            niveauId: cours.niveau_id,
            niveauNom: cours.niveau?.nom || 'Niveau inconnu',
            anneeScolaireId: cours.annee_scolaire_id,
            anneeScolaireNom: cours.annee_scolaire?.nom || 'Année inconnue',
            heuresParSemaine: cours.heures_par_semaine,
            coefficient: cours.coefficient,
            statut: cours.statut,
            dateCreation: cours.date_creation || cours.created_at,
            dateModification: cours.date_modification || cours.updated_at,
            professeurId: undefined,
            professeurNom: 'Professeurs assignés par classe',
            professeurs: cours.professeurs || [],
            classes: cours.classes || [],
            creneaux: (cours.creneaux || []).map((creneau: any) => ({
              id: creneau.id,
              jour: creneau.jour,
              heureDebut: creneau.heure_debut,
              heureFin: creneau.heure_fin,
              classeId: creneau.classe_id,
              classeNom: creneau.classe?.nom || '',
              professeurId: creneau.professeur_id,
              professeurNom: creneau.professeur?.nom || '',
              salleId: creneau.salle_id,
              salleNom: creneau.salle?.nom || '',
              statut: creneau.statut || 'planifie',
              dateCreation: creneau.date_creation || creneau.created_at
            })),
            assignations: assignations.map((assign: any) => ({
              id: assign.id,
              classeId: assign.classe_id,
              coursId: assign.cours_id,
              anneeScolaireId: assign.annee_scolaire_id,
              heuresParSemaine: cours.heures_par_semaine,
              statut: assign.statut || 'active',
              professeurNom: 'Professeur assigné'
            })),
            ressources: cours.ressources || [],
            semestresIds: cours.semestres_ids || []
          };
        });
        console.log('Cours transformés:', coursTransformes);
        console.log('Nombre de cours reçus:', response.data.length);
        console.log('Nombre de cours transformés:', coursTransformes.length);
        setCours(coursTransformes);
      } else {
        console.log('Aucun cours trouvé ou erreur:', response);
        setCours([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      setCours([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMatieres = async () => {
    try {
      const response = await adminService.getMatieres();
      const matieresData = response.data || [];
      
      // For now, load all matieres without filtering
      setMatieres(matieresData);
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    }
  };

  const loadNiveaux = async () => {
    try {
      const response = await adminService.getNiveaux();
      const niveauxData = response.data || [];
      setNiveaux(niveauxData);
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
    }
  };

  const loadAnneesScolaires = async () => {
    try {
      const response = await adminService.getAnneesScolaires();
      const anneesData = response.data || [];
      setAnneesScolaires(anneesData);
      
      // Trouver l'année scolaire active
      const anneeActive = anneesData.find((annee: any) => annee.statut === 'active');
      if (anneeActive) {
        setFormData((prev: any) => ({ ...prev, anneeScolaireId: anneeActive.id }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des années scolaires:', error);
    }
  };

  const loadProfesseurs = async () => {
    try {
      const response = await adminService.getUsers({ role: 'professeur' });
      const professeurs = response.data || [];
      
      console.log('Professeurs chargés:', professeurs.length);
      if (professeurs.length > 0) {
        console.log('Exemple professeur:', professeurs[0]);
      }
      
      setProfesseurs(professeurs);
    } catch (error) {
      console.error('Erreur lors du chargement des professeurs:', error);
      // Fallback avec getAllUsers si getUsers ne fonctionne pas
      try {
        const fallbackResponse = await adminService.getAllUsers();
        const usersData = fallbackResponse.data || [];
        const professeursFallback = usersData.filter((user: any) => user.role === 'professeur');
        setProfesseurs(professeursFallback);
      } catch (fallbackError) {
        console.error('Erreur fallback professeurs:', fallbackError);
      }
    }
  };

  const loadClasses = async () => {
    try {
      const response = await adminService.getClasses();
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    }
  };

  const loadEleves = async () => {
    try {
      const response = await eleveService.getEleves();
      if (response.success && response.data) {
        // Normaliser les données pour compatibilité
        const elevesNormalises = response.data.map((eleve: any) => ({
          ...eleve,
          classeId: eleve.classe_id || eleve.classeId,
          moyenne: eleve.moyenne || 12.5
        }));
        setEleves(elevesNormalises);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
    }
  };

  const loadSalles = async () => {
    try {
      const response = await adminService.getSalles();
      if (response.success && response.data) {
        setSalles(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des salles:', error);
    }
  };

  const loadNotifications = async () => {
    if (utilisateur?.id) {
      try {
        const notifications = await notificationService.getNotifications();
        setNotifications(notifications);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    }
  };

  const handleCreateCours = async (coursData: any) => {
    try {
      console.log('Données envoyées au backend:', coursData);
      const response = await adminService.createCours(coursData);
      console.log('Réponse du backend:', response);
      
      if (response.success) {
        await loadCours(); // Recharger la liste
        setActiveTab("liste"); // Retourner à la liste
        setCoursAModifier(null);
        console.log('Cours créé avec succès');
      } else {
        console.error('Erreur lors de la création:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
    }
  };

  const handleUpdateCours = async (coursData: any) => {
    try {
      console.log('Données de mise à jour envoyées:', coursData);
      const response = await adminService.updateCours(coursData.id, coursData);
      console.log('Réponse de mise à jour:', response);
      
      if (response.success) {
        await loadCours(); // Recharger la liste
        setActiveTab("liste"); // Retourner à la liste
        setCoursAModifier(null);
        console.log('Cours mis à jour avec succès');
      } else {
        console.error('Erreur lors de la mise à jour:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cours:', error);
    }
  };

  const handleDeleteCours = async (coursId: number) => {
    try {
      await adminService.deleteCours(coursId);
      loadCours();
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
    }
  };

  // Fonctions utilitaires
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

  const getIconeRessource = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "image":
        return <Image className="w-4 h-4 text-blue-500" />;
      case "video":
        return <Video className="w-4 h-4 text-purple-500" />;
      case "audio":
        return <Headphones className="w-4 h-4 text-green-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {utilisateur?.role === 'professeur' ? 'Mes Cours' : 'Gestion des Cours'}
          </h1>
          <p className="text-neutral-600 mt-1">
            {utilisateur?.role === 'professeur' 
              ? 'Consultez vos cours assignés et leurs détails'
              : 'Gérez les cours par niveau, année scolaire et professeur'
            }
          </p>
        </div>
      </div>

      {/* Onglets - Masqués pour les professeurs */}
      {utilisateur?.role !== 'professeur' && (
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
      )}

      {/* Contenu des onglets */}
      {(activeTab === "liste" || utilisateur?.role === 'professeur') ? (
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
                  <option value="">Tous les statuts</option>
                  {STATUTS_COURS.map(statut => (
                    <option key={statut.value} value={statut.value}>{statut.label}</option>
                  ))}
                </select>
                
                <select
                  value={filterMatiere}
                  onChange={(e) => setFilterMatiere(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les matières</option>
                  {Array.isArray(matieres) && matieres.map(matiere => (
                    <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {(() => {
                const filteredCount = cours.filter(coursItem => {
                  const matchesSearch = !searchTerm || 
                    coursItem.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    coursItem.matiereNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    coursItem.niveauNom.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  const matchesStatut = !filterStatut || coursItem.statut === filterStatut;
                  const matchesMatiere = !filterMatiere || coursItem.matiereId.toString() === filterMatiere;
                  
                  return matchesSearch && matchesStatut && matchesMatiere;
                }).length;
                
                return `Affichage de ${filteredCount} cours sur ${cours.length} au total`;
              })()
              }
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
                      Matière & Niveau
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Classes assignées
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
                  {cours.filter(coursItem => {
                    const matchesSearch = !searchTerm || 
                      coursItem.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      coursItem.matiereNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      coursItem.niveauNom.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    const matchesStatut = !filterStatut || coursItem.statut === filterStatut;
                    const matchesMatiere = !filterMatiere || coursItem.matiereId.toString() === filterMatiere;
                    
                    return matchesSearch && matchesStatut && matchesMatiere;
                  }).map((coursItem, index) => (
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
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="text-neutral-900">
                              {coursItem.assignations?.length || 0} classe{(coursItem.assignations?.length || 0) > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500">
                            Professeurs assignés par classe
                          </div>
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
                            onClick={() => {
                              setCoursSelectionne(coursItem);
                              setShowModalDetails(true);
                            }}
                            className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {utilisateur?.role !== 'professeur' && (
                            <>
                              <button
                                onClick={() => {
                                  setCoursAModifier(coursItem);
                                  setActiveTab("ajouter");
                                }}
                                className="p-2 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${coursItem.titre}" ?`)) {
                                    handleDeleteCours(coursItem.id);
                                  }
                                }}
                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(() => {
              const filteredCours = cours.filter(coursItem => {
                const matchesSearch = !searchTerm || 
                  coursItem.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  coursItem.matiereNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  coursItem.niveauNom.toLowerCase().includes(searchTerm.toLowerCase());
                
                const matchesStatut = !filterStatut || coursItem.statut === filterStatut;
                const matchesMatiere = !filterMatiere || coursItem.matiereId.toString() === filterMatiere;
                
                return matchesSearch && matchesStatut && matchesMatiere;
              });
              
              return filteredCours.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    {utilisateur?.role === 'professeur' ? 'Aucun cours assigné' : 'Aucun cours trouvé'}
                  </h3>
                  <p className="text-neutral-500">
                    {utilisateur?.role === 'professeur' 
                      ? 'Aucun cours ne vous a été assigné pour le moment.'
                      : 'Essayez de modifier vos critères de recherche ou créez un nouveau cours.'
                    }
                  </p>
                </div>
              );
            })()}
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
      ) : (utilisateur?.role === 'administrateur' || utilisateur?.role === 'gestionnaire') ? (
        <div>
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {coursAModifier ? "Modifier" : "Ajouter"} un cours
              </h2>
              <button
                onClick={() => {
                  setActiveTab("liste");
                  setShowModalModification(false);
                  setCoursAModifier(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
            <FormulaireCours
              onSubmit={coursAModifier ? handleUpdateCours : handleCreateCours}
              onClose={() => {
                setActiveTab("liste");
                setCoursAModifier(null);
              }}
              coursAModifier={coursAModifier || undefined}
              modeEdition={!!coursAModifier}
              classes={classes}
              professeurs={professeurs}
              matieres={matieres}
              niveaux={niveaux}
              anneesScolaires={anneesScolaires}
              anneeScolaireActive={anneeScolaireActive}
              salles={salles}
            />
          </div>
        </div>
      ) : null}

      {/* Modal d'ajout/modification */}


      {/* Modal détails cours - Pour professeurs avec gestion notes/présences */}
      {coursSelectionne && utilisateur?.role === 'professeur' && (
        <ModalDetailsCoursComplet
          cours={coursSelectionne}
          professeurs={professeurs}
          classes={classes}
          eleves={eleves}
          onClose={() => setCoursSelectionne(null)}
          isProfesseur={true}
        />
      )}

      {/* Modal de détails complet du cours avec onglets - Pour admins/gestionnaires */}
      {coursSelectionne && (utilisateur?.role === 'administrateur' || utilisateur?.role === 'gestionnaire') && (
        <ModalDetailsCoursComplet
          cours={coursSelectionne}
          professeurs={professeurs}
          classes={classes}
          eleves={eleves}
          onClose={() => setCoursSelectionne(null)}
          isProfesseur={false}
        />
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