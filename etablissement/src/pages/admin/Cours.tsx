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
}> = ({ onSubmit, onClose, coursAModifier, modeEdition = false, classes, professeurs }) => {
  const [formData, setFormData] = useState<FormDataCours>({
    titre: coursAModifier?.titre || "",
    description: coursAModifier?.description || "",
    matiereId: coursAModifier?.matiereId?.toString() || "",
    niveauId: coursAModifier?.niveauId?.toString() || "",
    anneeScolaireId: coursAModifier?.anneeScolaireId?.toString() || "",
    semestresIds: coursAModifier?.semestresIds || [1, 2],
    heuresParSemaine: coursAModifier?.heuresParSemaine || 0,
    coefficient: coursAModifier?.coefficient || 0,
    statut: coursAModifier?.statut || "planifie" as const,
    creneaux: coursAModifier?.creneaux || []
  });

  const [errors, setErrors] = useState<CoursErrors>({});
  const [loading, setLoading] = useState(false);
  const [matieres, setMatieres] = useState<any[]>([]);
  const [niveaux, setNiveaux] = useState<any[]>([]);
  const [anneesScolaires, setAnneesScolaires] = useState<any[]>([]);
  interface AssignationProfClasse {
    classeId: number;
    classeNom: string;
    professeurId: number;
    professeurNom: string;
  }

  const [assignationsProfesseurs, setAssignationsProfesseurs] = useState<AssignationProfClasse[]>([]);

  // Récupérer les matières disponibles pour le niveau sélectionné
  const matieresDuNiveau = formData.niveauId ? 
    matieres.filter((m: any) => m.niveaux && m.niveaux.includes(parseInt(formData.niveauId))) : [];

  // Récupérer les informations de la matière sélectionnée
  const matiereNiveauSelectionnee = formData.matiereId && formData.niveauId ?
    matieres.find((m: any) => m.id === parseInt(formData.matiereId) && m.niveaux && m.niveaux.includes(parseInt(formData.niveauId))) : null;

  // Mettre à jour automatiquement les heures et coefficient quand la matière change
  useEffect(() => {
    if (matiereNiveauSelectionnee) {
      setFormData(prev => ({
        ...prev,
        heuresParSemaine: (matiereNiveauSelectionnee as any).heuresParSemaine || 0,
        coefficient: (matiereNiveauSelectionnee as any).coefficient || 1
      }));
    }
  }, [matiereNiveauSelectionnee]);

  // Obtenir les classes du niveau sélectionné
  const classesDuNiveau = classes.filter(classe => classe.niveauId === parseInt(formData.niveauId));

  // Obtenir les professeurs de la matière sélectionnée
  const professeursDeLaMatiere = professeurs.filter(prof => 
    prof.matieres && prof.matieres.includes(parseInt(formData.matiereId))
  );

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

  // Ajouter un créneau
  const ajouterCreneau = () => {
    const nouveauCreneau: Creneau = {
      id: Date.now(),
      jour: "lundi",
      heureDebut: "08:00",
      heureFin: "10:00",
      salleId: 1, // ID de la première salle par défaut
      salleNom: "Salle 101", // Nom de la salle par défaut
      classeId: parseInt(formData.niveauId),
      professeurId: 1,
      classeNom: "Classe",
      professeurNom: "Professeur"
    };
    setFormData({
      ...formData,
      creneaux: [...(formData.creneaux || []), nouveauCreneau]
    });
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
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.matiereId || formData.matiereId === "") newErrors.matiereId = "La matière est requise";
    if (!formData.niveauId || formData.niveauId === "") newErrors.niveauId = "Le niveau est requis";
    if (!formData.anneeScolaireId || formData.anneeScolaireId === "") newErrors.anneeScolaireId = "L'année scolaire est requise";
    if (!formData.semestresIds || formData.semestresIds.length === 0) {
      newErrors.semestresIds = "Au moins un semestre doit être sélectionné";
    }

    // Validation des assignations de professeurs
    const assignationsIncompletes = assignationsProfesseurs.filter(assignation => assignation.professeurId === 0);
    if (assignationsIncompletes.length > 0) {
      newErrors.assignations = `Veuillez assigner un professeur pour ${assignationsIncompletes.length} classe(s)`;
    }

    // Validation des créneaux
    const totalHeuresCreneaux = (formData.creneaux || []).reduce((total: number, creneau: Creneau) => {
      const debut = new Date(`2000-01-01T${creneau.heureDebut}`);
      const fin = new Date(`2000-01-01T${creneau.heureFin}`);
      const heures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
      return total + heures;
    }, 0);

    if (totalHeuresCreneaux > formData.heuresParSemaine) {
      newErrors.creneaux = `Le total des heures des créneaux (${totalHeuresCreneaux}h) ne peut pas dépasser les heures par semaine (${formData.heuresParSemaine}h)`;
    }

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
      anneeScolaireId: parseInt(formData.anneeScolaireId),
      semestresIds: [1, 2], // Valeur par défaut
      dateCreation: modeEdition ? (coursAModifier?.dateCreation || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      dateModification: modeEdition ? new Date().toISOString().split('T')[0] : undefined,
      matiereNom: matieres.find(m => m.id === parseInt(formData.matiereId))?.nom || "",
      niveauNom: niveaux.find(n => n.id === parseInt(formData.niveauId))?.nom || "",
      anneeScolaireNom: anneesScolaires.find(a => a.id === parseInt(formData.anneeScolaireId))?.nom || "",
      ressources: modeEdition ? (coursAModifier?.ressources || []) : [],
      statut: formData.statut as "en_cours" | "planifie" | "termine" | "annule",
      assignations: assignationsProfesseurs.map((assignation, index) => ({
        id: index + 1,
        classeId: assignation.classeId,
        professeurId: assignation.professeurId,
        classeNom: assignation.classeNom,
        professeurNom: assignation.professeurNom,
        statut: "active" as const
      })),
      creneaux: (formData.creneaux || []).map((creneau: Creneau, index: number) => ({
        ...creneau,
        id: index + 1,
        classeNom: classesDuNiveau.find(c => c.id === creneau.classeId)?.nom || "",
        professeurNom: assignationsProfesseurs.find(a => a.classeId === creneau.classeId)?.professeurNom || ""
      }))
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
              {matieresDuNiveau.map((mn: any) => {
                const matiere = matieres.find(m => m.id === mn.id);
                return (
                  <option key={mn.id} value={mn.id}>
                    {matiere?.nom} ({mn.heuresParSemaine || 0}h/sem, coef: {mn.coefficient || 1})
                  </option>
                );
              })}
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
              Statut
            </label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value as "planifie" | "en_cours" | "termine" | "annule"})}
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
                <span className="text-blue-700">Heures par semaine:</span>
                <span className="ml-2 font-medium">{(matiereNiveauSelectionnee as any).heuresParSemaine || 0}h</span>
              </div>
              <div>
                <span className="text-blue-700">Coefficient:</span>
                <span className="ml-2 font-medium">{(matiereNiveauSelectionnee as any).coefficient || 1}</span>
              </div>
            </div>
          </div>
        )}

        {/* Assignation des professeurs par classe */}
        {classesDuNiveau.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Assignation des professeurs par classe</h3>
            <div className="space-y-3">
              {assignationsProfesseurs.map((assignation, index) => (
                <div key={assignation.classeId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {assignation.classeNom}
                    </label>
                    <select
                      value={assignation.professeurId}
                      onChange={(e) => updateProfesseurNom(assignation.classeId, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value={0}>Sélectionner un professeur</option>
                      {professeursDeLaMatiere.map(prof => (
                        <option key={prof.id} value={prof.id}>
                          {prof.prenom} {prof.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  {assignation.professeurNom && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      <span>{assignation.professeurNom}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {errors.assignations && (
              <p className="text-red-500 text-sm">{errors.assignations}</p>
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

        {/* Gestion des créneaux */}
        {classesDuNiveau.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Créneaux horaires</h3>
              <button
                type="button"
                onClick={ajouterCreneau}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter un créneau
              </button>
            </div>
            
            {(formData.creneaux || []).map((creneau, index) => (
              <div key={creneau.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Créneau {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => supprimerCreneau(creneau.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                    <select
                      value={creneau.jour}
                      onChange={(e) => updateCreneau(creneau.id, 'jour', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {JOURS_SEMAINE.map(jour => (
                        <option key={jour.value} value={jour.value}>{jour.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
                    <input
                      type="time"
                      value={creneau.heureDebut}
                      onChange={(e) => updateCreneau(creneau.id, 'heureDebut', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
                    <input
                      type="time"
                      value={creneau.heureFin}
                      onChange={(e) => updateCreneau(creneau.id, 'heureFin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                    <select
                      value={creneau.classeId}
                      onChange={(e) => updateCreneau(creneau.id, 'classeId', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Sélectionner une classe</option>
                      {classesDuNiveau.map(classe => (
                        <option key={classe.id} value={classe.id}>{classe.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            {errors.creneaux && (
              <p className="text-red-500 text-sm">{errors.creneaux}</p>
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
}> = ({ cours, professeurs, classes, eleves, onClose }) => {
  const [activeTab, setActiveTab] = useState<"infos" | "classes" | "emploi">("infos");
  const [classeDetails, setClasseDetails] = useState<any>(null);
  const [showClasseDetails, setShowClasseDetails] = useState(false);

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



  const tabs = [
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
                        const elevesClasse = eleves.filter(eleve => eleve.classeId === classe.id);
                        
                        return (
                          <div key={classe.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                               onClick={() => {
                                 setClasseDetails(classe);
                                 setShowClasseDetails(true);
                               }}>
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
                              <p className="text-xs text-gray-500">Cliquez pour voir les détails</p>
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
                                    const elevesClasse = eleves.filter(eleve => eleve.classeId === classeDetails.id);
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
                                    const elevesClasse = eleves.filter(eleve => eleve.classeId === classeDetails.id);
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
                              const elevesClasse = eleves.filter(eleve => eleve.classeId === classeDetails.id);
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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("");
  const [filterMatiere, setFilterMatiere] = useState<string>("");
  const [filterNiveau, setFilterNiveau] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"liste" | "ajouter">("liste");
  const [showModalAjout, setShowModalAjout] = useState(false);
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
      loadNotifications();
    }
  }, [utilisateur]);

  const loadCours = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCours();
      if (response.success && response.data) {
        setCours(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfesseurs = async () => {
    try {
      const response = await adminService.getUtilisateurs({
        page: 1,
        limit: 100,
        filters: { role: 'professeur' }
      });
      if (response.success && response.data) {
        setProfesseurs(response.data.data as Professeur[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des professeurs:', error);
    }
  };

  const loadMatieres = async () => {
    try {
      const response = await matiereService.getMatieres();
      if (response.success && response.data) {
        setMatieres(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    }
  };

  const loadNiveaux = async () => {
    try {
      const response = await adminService.getNiveaux();
      if (response.success && response.data) {
        setNiveaux(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
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
        setEleves(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
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

  const handleCreateCours = async (cours: Omit<Cours, 'id' | 'dateCreation'>) => {
    try {
      const response = await adminService.createCours(cours);
      if (response.success) {
        setShowModalAjout(false);
        loadCours(); // Recharger la liste
        console.log('Cours créé avec succès');
      } else {
        console.error('Erreur lors de la création:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
    }
  };

  const handleUpdateCours = async (id: number, updates: Partial<Cours>) => {
    try {
      const response = await adminService.updateCours(id, updates);
      if (response.success) {
        setShowModalModification(false);
        setCoursAModifier(null);
        loadCours(); // Recharger la liste
        console.log('Cours mis à jour avec succès');
      } else {
        console.error('Erreur lors de la mise à jour:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cours:', error);
    }
  };

  const handleDeleteCours = async (id: number) => {
    try {
      const response = await adminService.deleteCours(id);
      if (response.success) {
        loadCours(); // Recharger la liste
        console.log('Cours supprimé avec succès');
      } else {
        console.error('Erreur lors de la suppression:', response.error);
      }
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
          <h1 className="text-2xl font-bold text-neutral-900">Gestion des Cours</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les cours par niveau, année scolaire et professeur
          </p>
        </div>
        
        <button
          onClick={() => setShowModalAjout(true)}
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
                  {matieres.map(matiere => (
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
                  {cours.map((coursItem, index) => (
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
                          <span className="text-neutral-900">{coursItem.assignations && coursItem.assignations.length > 0 ? coursItem.assignations[0].professeurNom : "Non assigné"}</span>
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
                          <button
                            onClick={() => {
                              setCoursAModifier(coursItem);
                              setShowModalModification(true);
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
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {cours.length === 0 && (
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
              onSubmit={handleCreateCours}
              onClose={() => {
                setActiveTab("liste");
                setShowModalModification(false);
                setCoursAModifier(null);
              }}
              coursAModifier={coursAModifier || undefined}
              classes={classes}
              professeurs={professeurs}
            />
          </div>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      <Modal
        isOpen={showModalAjout || showModalModification}
        onClose={() => {
          setShowModalAjout(false);
          setShowModalModification(false);
          setCoursAModifier(null);
        }}
        title={`${coursAModifier ? "Modifier" : "Ajouter"} un cours`}
      >
        <FormulaireCours
          onSubmit={handleCreateCours}
          onClose={() => {
            setShowModalAjout(false);
            setShowModalModification(false);
            setCoursAModifier(null);
          }}
          coursAModifier={coursAModifier || undefined}
                      classes={classes}
            professeurs={professeurs}
        />
      </Modal>

      {/* Modal détails cours */}
      {coursSelectionne && (
        <Modal
          isOpen={!!coursSelectionne}
          onClose={() => setCoursSelectionne(null)}
          title={`Détails du cours: ${coursSelectionne.titre}`}
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
                  <p><strong>Titre :</strong> {coursSelectionne.titre}</p>
                  <p><strong>Matière :</strong> {coursSelectionne.matiereNom}</p>
                  <p><strong>Niveau :</strong> {coursSelectionne.niveauNom}</p>
                  <p><strong>Professeur :</strong> {coursSelectionne.assignations && coursSelectionne.assignations.length > 0 ? coursSelectionne.assignations[0].professeurNom : "Non assigné"}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Heures/semaine :</strong> {coursSelectionne.heuresParSemaine}h</p>
                  {coursSelectionne.coefficient && <p><strong>Coefficient :</strong> {coursSelectionne.coefficient}</p>}
                  <p><strong>Statut :</strong> {getStatutBadge(coursSelectionne.statut)}</p>
                  <p><strong>Date de création :</strong> {coursSelectionne.dateCreation}</p>
                </div>
              </div>
              <div className="mt-4">
                <p><strong>Description :</strong></p>
                <p className="text-neutral-600 mt-1">{coursSelectionne.description}</p>
              </div>
            </div>

            {/* Objectifs */}
            {/* Removed Objectifs and Prerequis sections */}

            {/* Ressources */}
            {coursSelectionne.ressources && coursSelectionne.ressources.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Ressources pédagogiques
                </h3>
                <div className="space-y-3">
                  {coursSelectionne.ressources.map((ressource: any) => (
                    <div key={ressource.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getIconeRessource(ressource.type)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{ressource.nom}</p>
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            <span className="capitalize">{ressource.type}</span>
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
                  setCoursAModifier(coursSelectionne);
                  setShowModalModification(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => setCoursSelectionne(null)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de détails complet du cours avec onglets */}
      {coursSelectionne && (
        <ModalDetailsCoursComplet
          cours={coursSelectionne}
          professeurs={professeurs}
          classes={classes}
          eleves={eleves}
          onClose={() => setCoursSelectionne(null)}
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