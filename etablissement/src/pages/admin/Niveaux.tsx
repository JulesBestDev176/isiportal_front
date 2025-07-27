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

  const getSectionBadge = (section: string) => {
    const colors = {
      college: "bg-blue-100 text-blue-800",
      lycee: "bg-green-100 text-green-800"
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[section as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>
        {section === "college" ? "Collège" : "Lycée"}
      </span>
    );
  };

  const getStatutBadge = (actif: boolean) => {
    return actif ? (
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
                        <div className="text-sm text-gray-500">{niveau.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSectionBadge(niveau.section)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {niveau.cycle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{niveau.matieres.length} matière(s)</span>
                      <button
                        onClick={() => onVoirMatieres(niveau)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Voir
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatutBadge(niveau.actif)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onModifierNiveau(niveau)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSupprimerNiveau(niveau)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de détails du niveau */}
      {niveauDetails && (
        <Modal
          isOpen={!!niveauDetails}
          onClose={() => setNiveauDetails(null)}
          title={`Détails du niveau ${niveauDetails.nom}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Informations générales</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <p><strong>Nom:</strong> {niveauDetails.nom}</p>
                  <p><strong>Section:</strong> {niveauDetails.section === "college" ? "Collège" : "Lycée"}</p>
                  <p><strong>Cycle:</strong> {niveauDetails.cycle}</p>
                  <p><strong>Description:</strong> {niveauDetails.description}</p>
                  <p><strong>Statut:</strong> {niveauDetails.actif ? "Actif" : "Inactif"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Matières enseignées</h3>
                <div className="mt-2 space-y-2">
                  {niveauDetails.matieres.map((matiere) => (
                    <div key={matiere.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{matiere.matiereNom}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{matiere.heuresParSemaine}h/sem</span>
                        <span>Coef: {matiere.coefficient}</span>
                        {matiere.obligatoire && (
                          <span className="bg-blue-100 text-blue-800 px-1 rounded">Obligatoire</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Composant GestionMatieres
const GestionMatieres: React.FC<{
  niveau: Niveau;
  onClose: () => void;
  onSave: (niveau: Niveau) => void;
}> = ({ niveau, onClose, onSave }) => {
  const [matieres, setMatieres] = useState<MatiereNiveauNiveau[]>(niveau.matieres);
  const [nouvelleMatiere, setNouvelleMatiere] = useState<Partial<MatiereNiveauNiveau>>({
    matiereId: 0,
    matiereNom: "",
    heuresParSemaine: 1,
    coefficient: 1,
    obligatoire: true
  });

  const ajouterMatiere = () => {
    if (nouvelleMatiere.matiereNom && nouvelleMatiere.heuresParSemaine && nouvelleMatiere.coefficient) {
      const matiere: MatiereNiveauNiveau = {
        id: Date.now(),
        matiereId: nouvelleMatiere.matiereId || 0,
        matiereNom: nouvelleMatiere.matiereNom,
        niveauId: niveau.id,
        heuresParSemaine: nouvelleMatiere.heuresParSemaine,
        coefficient: nouvelleMatiere.coefficient,
        obligatoire: nouvelleMatiere.obligatoire || true,
        dateCreation: new Date().toISOString()
      };
      setMatieres([...matieres, matiere]);
      setNouvelleMatiere({
        matiereId: 0,
        matiereNom: "",
        heuresParSemaine: 1,
        coefficient: 1,
        obligatoire: true
      });
    }
  };

  const supprimerMatiere = (id: number) => {
    setMatieres(matieres.filter(m => m.id !== id));
  };

  const modifierMatiere = (id: number, field: keyof MatiereNiveauNiveau, value: any) => {
    setMatieres(matieres.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const sauvegarder = () => {
    onSave({ ...niveau, matieres });
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gestion des matières - {niveau.nom}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Formulaire d'ajout de matière */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Ajouter une matière</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={nouvelleMatiere.matiereNom}
            onChange={(e) => setNouvelleMatiere({ ...nouvelleMatiere, matiereNom: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner une matière</option>
            {MATIERES_LIST.map((matiere, index) => (
              <option key={index} value={matiere}>{matiere}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Heures/semaine"
            value={nouvelleMatiere.heuresParSemaine}
            onChange={(e) => setNouvelleMatiere({ ...nouvelleMatiere, heuresParSemaine: parseInt(e.target.value) || 1 })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Coefficient"
            value={nouvelleMatiere.coefficient}
            onChange={(e) => setNouvelleMatiere({ ...nouvelleMatiere, coefficient: parseInt(e.target.value) || 1 })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={nouvelleMatiere.obligatoire}
              onChange={(e) => setNouvelleMatiere({ ...nouvelleMatiere, obligatoire: e.target.checked })}
              className="mr-2"
            />
            Obligatoire
          </label>
          <button
            onClick={ajouterMatiere}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des matières */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matière
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heures/semaine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coefficient
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
            {matieres.map((matiere) => (
              <tr key={matiere.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {matiere.matiereNom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={matiere.heuresParSemaine}
                    onChange={(e) => modifierMatiere(matiere.id, 'heuresParSemaine', parseInt(e.target.value) || 1)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={matiere.coefficient}
                    onChange={(e) => modifierMatiere(matiere.id, 'coefficient', parseInt(e.target.value) || 1)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={matiere.obligatoire}
                      onChange={(e) => modifierMatiere(matiere.id, 'obligatoire', e.target.checked)}
                      className="mr-2"
                    />
                    Obligatoire
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => supprimerMatiere(matiere.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          onClick={sauvegarder}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

// Composant FormulaireNiveau
const FormulaireNiveau: React.FC<{
  onSubmit: (niveau: Niveau) => void;
  onClose: () => void;
  niveauAModifier?: Niveau;
  modeEdition?: boolean;
  utilisateurRole?: string;
  utilisateurSection?: string;
}> = ({ onSubmit, onClose, niveauAModifier, modeEdition = false, utilisateurRole, utilisateurSection }) => {
  const [formData, setFormData] = useState<FormDataNiveau>({
    nom: niveauAModifier?.nom || "",
    ordre: niveauAModifier?.ordre || 1,
    section: niveauAModifier?.section || "college",
    description: niveauAModifier?.description || "",
    matieres: niveauAModifier?.matieres || []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (formData.ordre <= 0) newErrors.ordre = "L'ordre doit être positif";
    if (!formData.section) newErrors.section = "La section est requise";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nouveauNiveau: Niveau = {
      ...formData,
      cycle: formData.nom, // Utilise le nom comme cycle par défaut
      id: modeEdition && niveauAModifier ? niveauAModifier.id : Date.now(),
      actif: true,
      dateCreation: modeEdition && niveauAModifier ? niveauAModifier.dateCreation : new Date().toISOString().split('T')[0],
      dateModification: modeEdition ? new Date().toISOString().split('T')[0] : undefined
    };

    onSubmit(nouveauNiveau);
    onClose();
  };

  const ajouterMatiere = () => {
    const nouvelleMatiere: MatiereNiveauNiveau = {
      id: Date.now(),
      matiereId: 0,
      matiereNom: MATIERES_LIST[0],
      niveauId: niveauAModifier?.id || 0,
      heuresParSemaine: 2,
      coefficient: 1,
      obligatoire: true,
      dateCreation: new Date().toISOString().split('T')[0]
    };

    setFormData(prev => ({
      ...prev,
      matieres: [...prev.matieres, nouvelleMatiere]
    }));
  };

  const supprimerMatiere = (index: number) => {
    setFormData(prev => ({
      ...prev,
      matieres: prev.matieres.filter((_, i) => i !== index)
    }));
  };

  const modifierMatiere = (index: number, field: keyof MatiereNiveauNiveau, value: any) => {
    setFormData(prev => ({
      ...prev,
      matieres: prev.matieres.map((matiere, i) => 
        i === index ? { ...matiere, [field]: value } : matiere
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du niveau *
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            className={`w-full p-2 border rounded-md ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordre *
          </label>
          <input
            type="number"
            value={formData.ordre}
            onChange={(e) => setFormData(prev => ({ ...prev, ordre: parseInt(e.target.value) || 1 }))}
            className={`w-full p-2 border rounded-md ${errors.ordre ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.ordre && <p className="text-red-500 text-sm mt-1">{errors.ordre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section *
          </label>
          <select
            value={formData.section}
            onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value as "college" | "lycee" }))}
            className={`w-full p-2 border rounded-md ${errors.section ? 'border-red-500' : 'border-gray-300'}`}
            disabled={utilisateurRole === 'gestionnaire'}
          >
            {NIVEAUX_SECTIONS.map(section => {
              // Les gestionnaires ne peuvent sélectionner que leur section
              if (utilisateurRole === 'gestionnaire' && section.value !== utilisateurSection) {
                return null;
              }
              return (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              );
            })}
          </select>
          {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
          {utilisateurRole === 'gestionnaire' && (
            <p className="text-sm text-blue-600 mt-1">
              Vous ne pouvez gérer que les niveaux de votre section.
            </p>
          )}
        </div>


      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>

      {/* Gestion des matières */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Matières enseignées</h3>
          <button
            type="button"
            onClick={ajouterMatiere}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            + Ajouter une matière
          </button>
        </div>

        <div className="space-y-3">
          {formData.matieres.map((matiere, index) => (
            <div key={matiere.id} className="border p-4 rounded-md bg-gray-50">
              <div className="grid grid-cols-6 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matière
                  </label>
                  <select
                    value={matiere.matiereNom}
                    onChange={(e) => {
                      const matiereIndex = MATIERES_LIST.indexOf(e.target.value);
                      modifierMatiere(index, 'matiereNom', e.target.value);
                      modifierMatiere(index, 'matiereId', matiereIndex);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {MATIERES_LIST.map((matiereNom, idx) => (
                      <option key={idx} value={matiereNom}>
                        {matiereNom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heures/semaine
                  </label>
                  <input
                    type="number"
                    value={matiere.heuresParSemaine}
                    onChange={(e) => modifierMatiere(index, 'heuresParSemaine', parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coefficient
                  </label>
                  <input
                    type="number"
                    value={matiere.coefficient}
                    onChange={(e) => modifierMatiere(index, 'coefficient', parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Obligatoire
                  </label>
                  <select
                    value={matiere.obligatoire ? "true" : "false"}
                    onChange={(e) => modifierMatiere(index, 'obligatoire', e.target.value === "true")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={matiere.description || ""}
                    onChange={(e) => modifierMatiere(index, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Optionnel"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => supprimerMatiere(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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

  const loadNiveaux = async () => {
    setLoading(true);
    try {
      const response = await adminService.getNiveaux();
      if (response.success && response.data) {
        setNiveaux(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
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

  const handleCreateNiveau = async (niveau: Omit<Niveau, 'id' | 'dateCreation'>) => {
    try {
      const response = await adminService.createNiveau(niveau);
      if (response.success) {
        setShowModalAjout(false);
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
        setShowModalModification(false);
        setNiveauAModifier(null);
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
    setShowModalModification(true);
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

  const handleSubmit = (niveau: Niveau) => {
    if (showModalModification) { // Changed to showModalModification
      handleUpdateNiveau(niveau.id, niveau);
    } else {
      handleCreateNiveau(niveau);
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
              {showModalModification ? "Modifier le niveau" : "Ajouter un nouveau niveau"}
            </h2>
            <FormulaireNiveau
              onSubmit={handleSubmit}
              onClose={() => {
                setActiveTab("liste");
                setNiveauAModifier(null);
                setShowModalModification(false); // Changed to showModalModification
              }}
              niveauAModifier={niveauAModifier || undefined}
              modeEdition={showModalModification} // Changed to showModalModification
              utilisateurRole={utilisateur?.role}
              utilisateurSection={"college"}
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