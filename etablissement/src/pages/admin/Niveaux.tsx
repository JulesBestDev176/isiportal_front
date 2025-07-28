import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Edit3, Trash2, Users, User, 
  School, Mail, Phone, MapPin, Calendar, GraduationCap,
  UserCheck, AlertCircle, CheckCircle, UserPlus, List, X,
  Baby, Heart, FileText, Eye, ChevronDown, BookOpen, Settings,
  Clock, Target, PlayCircle, Video, Volume2, Image, Link, File, Check, CalendarDays,
  Info, BarChart3, Users2, Clock3, BookOpenCheck, CalendarCheck,
  ArrowRight, ArrowLeft, RefreshCw, Download, Upload, EyeOff, Layers
} from "lucide-react";
import { Niveau, MatiereNiveauNiveau, FormDataNiveau, NIVEAUX_SECTIONS, CYCLES } from '../../models/niveau.model';
import { MATIERES_LIST } from '../../models/utilisateur.model';
import { adminService } from '../../services/adminService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';

// Composant Modal
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}> = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

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
          className={`bg-white rounded-lg p-6 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Composant ListeNiveaux
const ListeNiveaux: React.FC<{
  liste: Niveau[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onModifierNiveau: (niveau: Niveau) => void;
  onSupprimerNiveau: (niveau: Niveau) => void;
  onVoirMatieres: (niveau: Niveau) => void;
}> = ({ liste, searchTerm, setSearchTerm, onModifierNiveau, onSupprimerNiveau, onVoirMatieres }) => {
  const [niveauDetails, setNiveauDetails] = useState<Niveau | null>(null);

  const getSectionBadge = (cycle: string) => {
    const colors = {
      college: "bg-blue-100 text-blue-800",
      lycee: "bg-green-100 text-green-800"
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[cycle as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>
        {cycle === "college" ? "Collège" : "Lycée"}
      </span>
    );
  };

  const getStatutBadge = (statut: string) => {
    return statut === "active" ? (
      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        Actif
      </span>
    ) : (
      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
        Inactif
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un niveau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tableau des niveaux */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cycle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matières
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {liste.map((niveau) => (
                <tr key={niveau.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Layers className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{niveau.nom}</div>
                        <div className="text-sm text-gray-500">{niveau.description || `Niveau ${niveau.nom}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {niveau.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSectionBadge(niveau.cycle)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {niveau.cycle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {niveau.matieres_ids ? niveau.matieres_ids.length : 0} matières
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatutBadge(niveau.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onVoirMatieres(niveau)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Gérer les matières"
                      >
                        <BookOpen className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onModifierNiveau(niveau)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Modifier le niveau"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onSupprimerNiveau(niveau)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Supprimer le niveau"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Composant GestionMatieres
const GestionMatieres: React.FC<{
  niveau: Niveau;
  onClose: () => void;
  onSave: (niveau: Niveau) => void;
}> = ({ niveau, onClose, onSave }) => {
  const [matieresIds, setMatieresIds] = useState<number[]>(niveau.matieres_ids || []);
  const [nouvelleMatiereId, setNouvelleMatiereId] = useState<number>(0);
  const [matieres, setMatieres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedMatieres, setExpandedMatieres] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  // Charger les matières au montage
  useEffect(() => {
    loadMatieres();
  }, []);

  // Surveiller les changements dans matieres
  useEffect(() => {
    // Les matières ont été mises à jour
  }, [matieres]);

  const loadMatieres = async () => {
    setLoading(true);
    try {
      const response = await adminService.getMatieres();
      
      if (response.success && response.data) {
        setMatieres(response.data);
      } else {
        console.error('Réponse invalide:', response);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatiereById = (id: number) => {
    const matiere = matieres.find(m => m.id === id);
    return matiere;
  };

  // Filtrer les matières disponibles (celles qui ne sont pas encore ajoutées)
  const getMatieresDisponibles = () => {
    return matieres.filter(matiere => !matieresIds.includes(matiere.id));
  };

  const toggleMatiereExpansion = (matiereId: number) => {
    setExpandedMatieres(prev => {
      const newSet = new Set(prev);
      if (newSet.has(matiereId)) {
        newSet.delete(matiereId);
      } else {
        newSet.add(matiereId);
      }
      return newSet;
    });
  };

  const ajouterMatiere = () => {
    if (nouvelleMatiereId && !matieresIds.includes(nouvelleMatiereId)) {
      setMatieresIds(prev => [...prev, nouvelleMatiereId]);
      setNouvelleMatiereId(0);
    }
  };

  const supprimerMatiere = (id: number) => {
    setMatieresIds(prev => prev.filter(matiereId => matiereId !== id));
  };

  const modifierMatiere = (id: number, field: keyof number, value: any) => {
    // Pour les IDs de matières, on ne peut pas vraiment modifier, on peut juste ajouter/supprimer
    console.log('Modification de matière:', id, field, value);
  };

  const sauvegarder = async () => {
    setSaving(true);
    try {
      // Appeler l'API pour mettre à jour le niveau avec les nouvelles matières
      const response = await adminService.updateNiveau(niveau.id, {
        matieres_ids: matieresIds
      });
      
      if (response.success) {
        console.log('Matières mises à jour avec succès');
        onSave({ ...niveau, matieres_ids: matieresIds });
        onClose();
      } else {
        console.error('Erreur lors de la mise à jour des matières:', response.error);
        alert('Erreur lors de la sauvegarde des matières');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des matières');
    } finally {
      setSaving(false);
    }
  };

  const matieresDisponibles = getMatieresDisponibles();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestion des matières - {niveau.nom}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Ajouter une nouvelle matière */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">Ajouter une matière</h4>
          <div className="flex gap-2">
            <select
              value={nouvelleMatiereId || ''}
              onChange={(e) => setNouvelleMatiereId(parseInt(e.target.value) || 0)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              disabled={matieresDisponibles.length === 0}
            >
              <option value="">
                {matieresDisponibles.length === 0 
                  ? "Aucune matière disponible à ajouter" 
                  : "Sélectionner une matière"
                }
              </option>
              {matieresDisponibles.map((matiere) => (
                <option key={matiere.id} value={matiere.id}>
                  {matiere.nom}
                </option>
              ))}
            </select>
            <button
              onClick={ajouterMatiere}
              disabled={!nouvelleMatiereId || matieresDisponibles.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Ajouter
            </button>
          </div>
          {matieresDisponibles.length === 0 && (
            <p className="text-sm text-blue-700 mt-2">
              Toutes les matières disponibles ont déjà été ajoutées à ce niveau.
            </p>
          )}
        </div>

        {/* Liste des matières */}
        <div className="space-y-2">
          <h4 className="font-medium">Matières assignées ({matieresIds.length})</h4>
          {loading ? (
            <p className="text-gray-500">Chargement des matières...</p>
          ) : matieresIds.length === 0 ? (
            <p className="text-gray-500">Aucune matière assignée</p>
          ) : (
            <div className="space-y-2">
              {matieresIds.map((matiereId) => {
                const matiere = getMatiereById(matiereId);
                const isExpanded = expandedMatieres.has(matiereId);
                
                return (
                  <div key={matiereId} className="border rounded-md overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleMatiereExpansion(matiereId)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ChevronDown 
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          />
                        </button>
                        <div>
                          <span className="text-sm font-medium">
                            {matiere ? matiere.nom : `Matière ID: ${matiereId}`}
                          </span>
                          {matiere && (
                            <p className="text-xs text-gray-500">
                              Coefficient: {matiere.coefficient || 'N/A'} • {matiere.heures_par_semaine || 'N/A'}h/sem
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => supprimerMatiere(matiereId)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer cette matière"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Détails de la matière (accordéon) */}
                    {isExpanded && matiere && (
                      <div className="p-3 bg-white border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Nom:</span>
                            <p className="text-gray-900">{matiere.nom}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Code:</span>
                            <p className="text-gray-900">{matiere.code || 'N/A'}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-gray-700">Description:</span>
                            <p className="text-gray-900">{matiere.description || 'Aucune description disponible'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Coefficient:</span>
                            <p className="text-gray-900">{matiere.coefficient || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Heures par semaine:</span>
                            <p className="text-gray-900">{matiere.heures_par_semaine || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Statut:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              matiere.statut === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {matiere.statut === 'active' ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={saving}
          >
            Annuler
          </button>
          <button
            onClick={sauvegarder}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              'Sauvegarder'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant FormulaireNiveau
const FormulaireNiveau: React.FC<{
  onSubmit: (niveau: Niveau, niveauxToUpdate: Niveau[]) => void;
  onClose: () => void;
  niveauAModifier?: Niveau;
  modeEdition?: boolean;
  utilisateurRole?: string;
  utilisateurSection?: string;
  niveaux: Niveau[]; // Added niveaux prop
}> = ({ onSubmit, onClose, niveauAModifier, modeEdition = false, utilisateurRole, utilisateurSection, niveaux }) => {
  const [formData, setFormData] = useState<FormDataNiveau>({
    nom: '',
    code: '',
    description: '',
    cycle: 'college',
    position: '',
    statut: 'active',
    matieres_ids: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matieres, setMatieres] = useState<any[]>([]);
  const [loadingMatieres, setLoadingMatieres] = useState(false);

  // Charger les matières au montage
  useEffect(() => {
    loadMatieres();
  }, []);

  const loadMatieres = async () => {
    setLoadingMatieres(true);
    try {
      const response = await adminService.getMatieres();
      
      if (response.success && response.data) {
        setMatieres(response.data);
      } else {
        console.error('Réponse invalide FormulaireNiveau:', response);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matières FormulaireNiveau:', error);
    } finally {
      setLoadingMatieres(false);
    }
  };

  const getMatiereById = (id: number) => {
    const matiere = matieres.find(m => m.id === id);
    return matiere;
  };

  // Initialiser le formulaire avec les données du niveau à modifier
  useEffect(() => {
    if (niveauAModifier) {
      setFormData({
        nom: niveauAModifier.nom || "",
        code: niveauAModifier.code || "",
        description: niveauAModifier.description || "",
        cycle: niveauAModifier.cycle || "college",
        position: modeEdition ? "" : "", // Pas de position en mode édition
        statut: niveauAModifier.statut || "active",
        matieres_ids: niveauAModifier.matieres_ids || []
      });
    } else {
      // Reset form for new niveau
      setFormData({
        nom: '',
        code: '',
        description: '',
        cycle: 'college',
        position: '',
        statut: 'active',
        matieres_ids: []
      });
    }
  }, [niveauAModifier, modeEdition]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.code.trim()) newErrors.code = "Le code est requis";
    if (!modeEdition && !formData.position) newErrors.position = "La position est requise";
    if (!formData.cycle) newErrors.cycle = "Le cycle est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const calculateOrder = (position: string, cycle: string): number => {
    // En mode édition, garder l'ordre existant
    if (modeEdition && niveauAModifier) {
      return niveauAModifier.ordre;
    }

    const niveauxCycle = niveaux.filter(n => n.cycle === cycle).sort((a, b) => a.ordre - b.ordre);
    
    if (position === "first") {
      return 1;
    } else if (position === "last") {
      return niveauxCycle.length > 0 ? Math.max(...niveauxCycle.map(n => n.ordre)) + 1 : 1;
    } else if (position.startsWith("after_")) {
      const niveauId = parseInt(position.replace("after_", ""));
      const niveauCible = niveauxCycle.find(n => n.id === niveauId);
      if (niveauCible) {
        return niveauCible.ordre + 1;
      }
    }
    return 1; // Fallback
  };

  const getNiveauxToUpdate = (nouvelOrdre: number, cycle: string): Niveau[] => {
    // Retourner tous les niveaux du même cycle qui ont un ordre >= au nouvel ordre
    return niveaux
      .filter(n => n.cycle === cycle && n.ordre >= nouvelOrdre)
      .map(n => ({
        ...n,
        ordre: n.ordre + 1 // Décaler d'un rang
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Calculer l'ordre basé sur la position
    const ordre = calculateOrder(formData.position!, formData.cycle);

    const nouveauNiveau: Niveau = {
      ...formData,
      ordre, // Utiliser l'ordre calculé
      id: modeEdition && niveauAModifier ? niveauAModifier.id : Date.now(),
      date_creation: modeEdition && niveauAModifier ? niveauAModifier.date_creation : new Date().toISOString(),
      created_at: modeEdition && niveauAModifier ? niveauAModifier.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Si c'est un nouveau niveau, calculer les niveaux à mettre à jour
    const niveauxToUpdate = !modeEdition ? getNiveauxToUpdate(ordre, formData.cycle) : [];

    onSubmit(nouveauNiveau, niveauxToUpdate);
  };

  const supprimerMatiere = (index: number) => {
    setFormData(prev => ({
      ...prev,
      matieres_ids: prev.matieres_ids.filter((_, i) => i !== index)
    }));
  };

  const modifierMatiere = (index: number, field: keyof number, value: any) => {
    // Pour les IDs de matières, on ne peut pas vraiment modifier, on peut juste ajouter/supprimer
    console.log('Modification de matière:', index, field, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du niveau *
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            className={`w-full p-2 border rounded-md ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ex: 6ème, 5ème, 2nde"
          />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            className={`w-full p-2 border rounded-md ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ex: 6EME, 5EME, 2NDE"
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
        </div>

        {/* Cycle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cycle *
          </label>
          <select
            value={formData.cycle}
            onChange={(e) => setFormData(prev => ({ ...prev, cycle: e.target.value as "college" | "lycee" }))}
            className={`w-full p-2 border rounded-md ${errors.cycle ? 'border-red-500' : 'border-gray-300'}`}
            disabled={utilisateurRole === 'gestionnaire'}
          >
            <option value="college">Collège</option>
            <option value="lycee">Lycée</option>
          </select>
          {errors.cycle && <p className="text-red-500 text-xs mt-1">{errors.cycle}</p>}
        </div>

        {/* Position - seulement en mode création */}
        {!modeEdition && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <select
              value={formData.position || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              className={`w-full p-2 border rounded-md ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
              disabled={utilisateurRole === 'gestionnaire'}
            >
              <option value="">Sélectionner une position...</option>
              <option value="first">En premier</option>
              {niveaux
                .filter(n => n.cycle === formData.cycle)
                .sort((a, b) => a.ordre - b.ordre)
                .map((niveau, index) => (
                  <option key={niveau.id} value={`after_${niveau.id}`}>
                    Après {niveau.nom} (ordre {niveau.ordre})
                  </option>
                ))
              }
              <option value="last">En dernier</option>
            </select>
            {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
          </div>
        )}

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={formData.statut}
            onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as "active" | "inactive" }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Description du niveau..."
        />
      </div>

      {/* Matières */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Matières assignées
          </label>
        </div>

        {/* Sélecteur de matière */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ajouter une matière
          </label>
          <div className="flex gap-2">
            <select
              value=""
              onChange={(e) => {
                const matiereId = parseInt(e.target.value);
                if (matiereId && !formData.matieres_ids.includes(matiereId)) {
                  setFormData(prev => ({
                    ...prev,
                    matieres_ids: [...prev.matieres_ids, matiereId]
                  }));
                  e.target.value = ""; // Reset le sélecteur
                }
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              disabled={loadingMatieres}
            >
              <option value="">Sélectionner une matière...</option>
              {matieres
                .filter(matiere => !formData.matieres_ids.includes(matiere.id))
                .map(matiere => (
                  <option key={matiere.id} value={matiere.id}>
                    {matiere.nom} - Coef: {matiere.coefficient || 'N/A'} - {matiere.heures_par_semaine || 'N/A'}h/sem
                  </option>
                ))
              }
            </select>
            {loadingMatieres && (
              <div className="flex items-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm">Chargement...</span>
              </div>
            )}
          </div>
          {matieres.filter(m => !formData.matieres_ids.includes(m.id)).length === 0 && (
            <p className="text-sm text-blue-700 mt-2">
              Toutes les matières disponibles ont déjà été ajoutées à ce niveau.
            </p>
          )}
        </div>

        <div className="space-y-3">
          {formData.matieres_ids.map((matiereId, index) => {
            const matiere = getMatiereById(matiereId);
            return (
              <div key={index} className="border p-4 rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">
                      {matiere ? matiere.nom : `Matière ID: ${matiereId}`}
                    </span>
                    {matiere && (
                      <p className="text-xs text-gray-500">
                        Coefficient: {matiere.coefficient || 'N/A'} • {matiere.heures_par_semaine || 'N/A'}h/sem
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => supprimerMatiere(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {formData.matieres_ids.length === 0 && (
            <p className="text-gray-500 text-sm">Aucune matière assignée</p>
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {modeEdition ? "Modifier" : "Créer"}
        </button>
      </div>
    </form>
  );
};

// Composant principal
const Niveaux: React.FC = () => {
  const { utilisateur } = useAuth();
  const [activeTab, setActiveTab] = useState<"liste" | "ajouter">("liste");
  const [showModalAjout, setShowModalAjout] = useState(false);
  const [niveauAModifier, setNiveauAModifier] = useState<Niveau | null>(null);
  const [showModalModification, setShowModalModification] = useState(false);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [niveauSelectionne, setNiveauSelectionne] = useState<Niveau | null>(null);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sectionFilter, setSectionFilter] = useState<string>("Toutes les sections");
  const [filteredNiveaux, setFilteredNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModalSuppression, setShowModalSuppression] = useState(false);
  const [niveauASupprimer, setNiveauASupprimer] = useState<Niveau | null>(null);
  const [showModalMatieres, setShowModalMatieres] = useState(false);
  const [niveauPourMatieres, setNiveauPourMatieres] = useState<Niveau | null>(null);

  // Charger les données au montage
  useEffect(() => {
    loadNiveaux();
    loadNotifications();
  }, []);

  // Filtrer les niveaux quand ils changent ou quand les filtres changent
  useEffect(() => {
    let filtered = niveaux;

    // Filtre par section
    if (sectionFilter !== "Toutes les sections") {
      const sectionMap = {
        "Collège": "college",
        "Lycée": "lycee"
      };
      const cycleFilter = sectionMap[sectionFilter as keyof typeof sectionMap];
      if (cycleFilter) {
        filtered = filtered.filter(niveau => niveau.cycle === cycleFilter);
      }
    }

    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(niveau => 
        niveau.nom.toLowerCase().includes(term) ||
        niveau.code.toLowerCase().includes(term) ||
        (niveau.description && niveau.description.toLowerCase().includes(term))
      );
    }

    // Pour les gestionnaires, filtrer par leur section
    if (utilisateur?.role === "gestionnaire") {
      filtered = filtered.filter(niveau => niveau.cycle === "college");
    }

    setFilteredNiveaux(filtered);
  }, [niveaux, sectionFilter, searchTerm, utilisateur?.role]);

  const loadNiveaux = async () => {
    setLoading(true);
    try {
      const response = await adminService.getNiveaux();
      
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          setNiveaux(response.data);
        } else {
          console.warn('Structure de données inattendue:', response.data);
          setNiveaux([]);
        }
      } else {
        console.warn('Réponse API sans succès:', response);
        setNiveaux([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
      setNiveaux([]);
    } finally {
      setLoading(false);
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

  const handleCreateNiveau = async (niveau: Omit<Niveau, 'id' | 'dateCreation'>, niveauxToUpdate: Niveau[] = []) => {
    try {
      const response = await adminService.createNiveau(niveau);
      if (response.success) {
        // Mettre à jour les niveaux existants si nécessaire
        if (niveauxToUpdate.length > 0) {
          // Mettre à jour chaque niveau décalé
          for (const niveauToUpdate of niveauxToUpdate) {
            await adminService.updateNiveau(niveauToUpdate.id, { ordre: niveauToUpdate.ordre });
          }
        }
        
        setNiveauAModifier(null);
        setActiveTab("liste"); // Rediriger vers la liste
        loadNiveaux(); // Recharger la liste
        console.log('Niveau créé avec succès');
      } else {
        console.error('Erreur lors de la création:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création du niveau:', error);
    }
  };

  const handleUpdateNiveau = async (id: number, updates: Partial<Niveau>) => {
    try {
      const response = await adminService.updateNiveau(id, updates);
      if (response.success) {
        setNiveauAModifier(null);
        setActiveTab("liste"); // Rediriger vers la liste
        loadNiveaux(); // Recharger la liste
        console.log('Niveau mis à jour avec succès');
      } else {
        console.error('Erreur lors de la mise à jour:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du niveau:', error);
    }
  };

  const handleDeleteNiveau = async (id: number) => {
    try {
      const response = await adminService.deleteNiveau(id);
      if (response.success) {
        setShowModalSuppression(false); // Fermer le modal de confirmation
        setNiveauASupprimer(null); // Réinitialiser le niveau à supprimer
        loadNiveaux(); // Recharger la liste
        console.log('Niveau supprimé avec succès');
      } else {
        console.error('Erreur lors de la suppression:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du niveau:', error);
    }
  };

  const ouvrirModalModification = (niveau: Niveau) => {
    setNiveauAModifier(niveau);
    setShowModalModification(false); // Fermer le modal de modification
    setActiveTab("ajouter"); // Rediriger vers l'onglet ajouter
  };

  const ouvrirModalAjout = () => {
    setNiveauAModifier(null);
    setShowModalModification(false);
    setActiveTab("ajouter");
  };

  const ouvrirModalSuppression = (niveau: Niveau) => {
    setNiveauASupprimer(niveau);
    setShowModalSuppression(true);
  };

  const ouvrirModalMatieres = (niveau: Niveau) => {
    setNiveauPourMatieres(niveau);
    setShowModalMatieres(true);
  };



  const fermerModalMatieres = () => {
    setShowModalMatieres(false);
    setNiveauPourMatieres(null);
  };

  const handleSubmit = (niveau: Niveau, niveauxToUpdate: Niveau[] = []) => {
    if (niveauAModifier) {
      // Mode modification
      handleUpdateNiveau(niveauAModifier.id, niveau);
    } else {
      // Mode création
      handleCreateNiveau(niveau, niveauxToUpdate);
    }
  };

  const sauvegarderMatieres = (niveauModifie: Niveau) => {
    setNiveaux(niveaux.map(n => n.id === niveauModifie.id ? niveauModifie : n));
    fermerModalMatieres();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Niveaux</h1>
        <p className="text-gray-600">Gérez les niveaux scolaires et leurs matières</p>
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
                <Layers className="w-4 h-4" />
                Liste des niveaux
              </div>
            </button>
            {(utilisateur?.role === "administrateur" || utilisateur?.role === "gestionnaire") && (
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
            )}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "liste" ? (
        <div>
          {/* Filtres */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              {/* Filtre par section - seulement pour les admins */}
              {utilisateur?.role === "administrateur" && (
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Toutes les sections">Toutes les sections</option>
                  <option value="Collège">Collège</option>
                  <option value="Lycée">Lycée</option>
                </select>
              )}

              {/* Message pour les gestionnaires */}
              {utilisateur?.role === "gestionnaire" && (
                <div className="text-sm text-gray-600">
                  Vous gérez uniquement les niveaux de votre section (Collège)
                </div>
              )}
            </div>

            {/* Bouton Nouveau niveau */}
            {(utilisateur?.role === "administrateur" || utilisateur?.role === "gestionnaire") && (
              <button
                onClick={ouvrirModalAjout}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouveau niveau
              </button>
            )}
          </div>

          {/* Tableau des niveaux */}
          <ListeNiveaux
            liste={filteredNiveaux}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onModifierNiveau={ouvrirModalModification}
            onSupprimerNiveau={ouvrirModalSuppression}
            onVoirMatieres={ouvrirModalMatieres}
          />
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              {niveauAModifier ? "Modifier le niveau" : "Ajouter un nouveau niveau"}
            </h2>
            <FormulaireNiveau
              onSubmit={handleSubmit}
              onClose={() => {
                setActiveTab("liste");
                setNiveauAModifier(null);
                setShowModalModification(false);
              }}
              niveauAModifier={niveauAModifier || undefined}
              modeEdition={!!niveauAModifier}
              utilisateurRole={utilisateur?.role}
              utilisateurSection={"college"}
              niveaux={niveaux} // Pass niveaux to FormulaireNiveau
            />
          </div>
        </div>
      )}



      {/* Modal pour gérer les matières */}
      <Modal
        isOpen={showModalMatieres} // Changed to showModalMatieres
        onClose={fermerModalMatieres}
        title="Gestion des matières"
        size="xl"
      >
        {niveauPourMatieres && (
          <GestionMatieres
            niveau={niveauPourMatieres}
            onClose={fermerModalMatieres}
            onSave={sauvegarderMatieres}
          />
        )}
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showModalSuppression} // Changed to showModalSuppression
        onClose={() => setShowModalSuppression(false)} // Changed to showModalSuppression
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Supprimer le niveau
              </h3>
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer le niveau "{niveauASupprimer?.nom}" ? 
                Cette action est irréversible.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowModalSuppression(false)} // Changed to showModalSuppression
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={() => niveauASupprimer && handleDeleteNiveau(niveauASupprimer.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Niveaux; 