import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Edit3, Trash2, Users, User, 
  School, Mail, Phone, MapPin, Calendar, GraduationCap,
  UserCheck, AlertCircle, CheckCircle, UserPlus, List, X,
  BookOpen, Clock, Target, PlayCircle, Video, Volume2, Image, Link, File, Check, CalendarDays,
  Info, Settings, BarChart3, Users2, Clock3, BookOpenCheck, CalendarCheck,
  Building, MapPin as MapPinIcon, Layers, Home, Edit3 as Edit
} from "lucide-react";
import { Salle, TypeSalle, StatutSalle, TYPES_SALLE, STATUTS_SALLE, FormDataSalle, SalleErrors } from '../../models/salle.model';
import { Batiment, StatutBatiment, STATUTS_BATIMENT, FormDataBatiment, BatimentErrors } from '../../models/batiment.model';
import { adminService } from '../../services/adminService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';

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

// Composant formulaire salle
const FormulaireSalle: React.FC<{
  onSubmit: (salle: Salle) => void;
  onClose: () => void;
  salleAModifier?: Salle | null;
  modeEdition?: boolean;
  batiments: Batiment[];
}> = ({ onSubmit, onClose, salleAModifier, modeEdition = false, batiments }) => {
  const [formData, setFormData] = useState<FormDataSalle>({
    nom: salleAModifier?.nom || "",
    code: salleAModifier?.code || "",
    batimentId: salleAModifier?.batimentId?.toString() || "",
    etage: salleAModifier?.etage || 1,
    capacite: salleAModifier?.capacite || 30,
    type: salleAModifier?.type || "salle_cours",
    equipements: salleAModifier?.equipements || [],
    description: salleAModifier?.description || "",
    statut: salleAModifier?.statut || "active"
  });

  const [errors, setErrors] = useState<SalleErrors>({});
  const [nouvelEquipement, setNouvelEquipement] = useState("");

  const validateForm = () => {
    const errors: SalleErrors = {};

    if (!formData.nom.trim()) {
      errors.nom = "Le nom de la salle est requis";
    }

    if (!formData.batimentId) {
      errors.batimentId = "Le bâtiment est requis";
    }

    if (!formData.type) {
      errors.type = "Le type de salle est requis";
    }

    if (formData.capacite <= 0) {
      errors.capacite = "La capacité doit être supérieure à 0";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const batiment = batiments.find((b: Batiment) => b.id === parseInt(formData.batimentId));
      if (!batiment) {
        setErrors({ batimentId: "Bâtiment non trouvé" });
        return;
      }

      const nouvelleSalle: Salle = {
        id: salleAModifier?.id || Date.now(),
        nom: formData.nom,
        code: formData.code,
        batimentId: parseInt(formData.batimentId),
        batimentNom: batiment.nom,
        etage: formData.etage,
        type: formData.type as TypeSalle,
        capacite: formData.capacite,
        equipements: formData.equipements,
        statut: formData.statut as "active" | "inactive" | "maintenance",
        description: formData.description,
        dateCreation: salleAModifier?.dateCreation || new Date().toISOString(),
        dateModification: new Date().toISOString()
      };

      onSubmit(nouvelleSalle);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const ajouterEquipement = () => {
    setFormData(prev => ({
      ...prev,
      equipements: [...prev.equipements, ""]
    }));
  };

  const supprimerEquipement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.filter((_: string, i: number) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom et Code */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la salle *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Salle 101"
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code de la salle *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 101"
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>
        </div>

        {/* Bâtiment et Étage */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bâtiment *
            </label>
            <select
              value={formData.batimentId}
              onChange={(e) => setFormData({ ...formData, batimentId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.batimentId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un bâtiment</option>
              {batiments.map((batiment: Batiment) => (
                <option key={batiment.id} value={batiment.id}>
                  {batiment.nom}
                </option>
              ))}
            </select>
            {errors.batimentId && <p className="text-red-500 text-sm mt-1">{errors.batimentId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Étage
            </label>
            <input
              type="number"
              value={formData.etage}
              onChange={(e) => setFormData({ ...formData, etage: parseInt(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.etage ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
            />
            {errors.etage && <p className="text-red-500 text-sm mt-1">{errors.etage}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacité et Type */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacité *
            </label>
            <input
              type="number"
              value={formData.capacite}
              onChange={(e) => setFormData({ ...formData, capacite: parseInt(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.capacite ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
            />
            {errors.capacite && <p className="text-red-500 text-sm mt-1">{errors.capacite}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de salle *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TYPES_SALLE.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Équipements */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipements
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nouvelEquipement}
                onChange={(e) => setNouvelEquipement(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ajouter un équipement"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), ajouterEquipement())}
              />
              <button
                type="button"
                onClick={ajouterEquipement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {formData.equipements.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Équipements actuels
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.equipements.map((equipement, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm">{equipement}</span>
                    <button
                      type="button"
                      onClick={() => supprimerEquipement(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description de la salle..."
        />
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {modeEdition ? "Modifier" : "Ajouter"} la salle
        </button>
      </div>
    </form>
  );
};

// Composant formulaire bâtiment
const FormulaireBatiment: React.FC<{
  onSubmit: (batiment: Batiment) => void;
  onClose: () => void;
  batimentAModifier?: Batiment | null;
  modeEdition?: boolean;
}> = ({ onSubmit, onClose, batimentAModifier, modeEdition = false }) => {
  const [formData, setFormData] = useState<FormDataBatiment>({
    nom: batimentAModifier?.nom || "",
    code: batimentAModifier?.code || "",
    description: batimentAModifier?.description || "",
    adresse: batimentAModifier?.adresse || "",
    nombreEtages: batimentAModifier?.nombreEtages || 1,
    dateConstruction: batimentAModifier?.dateConstruction || ""
  });

  const [errors, setErrors] = useState<BatimentErrors>({});

  const validateForm = () => {
    const newErrors: BatimentErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom du bâtiment est requis";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Le code du bâtiment est requis";
    }

    if (formData.nombreEtages <= 0) {
      newErrors.nombreEtages = "Le nombre d'étages doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const nouveauBatiment: Batiment = {
      id: batimentAModifier?.id || Date.now(),
      nom: formData.nom,
      code: formData.code,
      description: formData.description,
      adresse: formData.adresse,
      nombreEtages: formData.nombreEtages,
      dateConstruction: formData.dateConstruction,
      dateCreation: batimentAModifier?.dateCreation || new Date().toISOString(),
      statut: batimentAModifier?.statut || "actif"
    };

    onSubmit(nouveauBatiment);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom et Code */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du bâtiment *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Bâtiment Principal"
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code du bâtiment *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: PRINCIPAL"
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>
        </div>

        {/* Adresse et Nombre d'étages */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 123 Rue de l'École"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'étages *
            </label>
            <input
              type="number"
              value={formData.nombreEtages}
              onChange={(e) => setFormData({ ...formData, nombreEtages: parseInt(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombreEtages ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
            />
            {errors.nombreEtages && <p className="text-red-500 text-sm mt-1">{errors.nombreEtages}</p>}
          </div>
        </div>
      </div>

      {/* Description et Date de construction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description du bâtiment..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de construction
          </label>
          <input
            type="date"
            value={formData.dateConstruction}
            onChange={(e) => setFormData({ ...formData, dateConstruction: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {modeEdition ? "Modifier" : "Ajouter"} le bâtiment
        </button>
      </div>
    </form>
  );
};

// Composant principal
const SallesAdmin: React.FC = () => {
  const { utilisateur } = useAuth();
  const [activeTab, setActiveTab] = useState<"salles" | "batiments">("salles");
  const [salles, setSalles] = useState<Salle[]>([]);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterBatiment, setFilterBatiment] = useState<string>("");
  const [showModalAjout, setShowModalAjout] = useState(false);
  const [salleAModifier, setSalleAModifier] = useState<Salle | null>(null);
  const [showModalModification, setShowModalModification] = useState(false);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [salleSelectionnee, setSalleSelectionnee] = useState<Salle | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showModalAjoutBatiment, setShowModalAjoutBatiment] = useState(false);
  const [batimentAModifier, setBatimentAModifier] = useState<Batiment | null>(null);

  // Charger les données au montage
  useEffect(() => {
    loadSalles();
    loadBatiments();
    loadNotifications();
  }, []);

  const loadSalles = async () => {
    setLoading(true);
    try {
      const response = await adminService.getSalles();
      if (response.success && response.data) {
        setSalles(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des salles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBatiments = async () => {
    try {
      const response = await adminService.getBatiments();
      if (response.success && response.data) {
        setBatiments(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des bâtiments:', error);
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

  const handleCreateSalle = async (salle: Omit<Salle, 'id' | 'dateCreation'>) => {
    try {
      const response = await adminService.createSalle(salle);
      if (response.success) {
        setShowModalAjout(false);
        loadSalles(); // Recharger la liste
      } else {
        console.error('Erreur lors de la création:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la salle:', error);
    }
  };

  const handleUpdateSalle = async (id: number, updates: Partial<Salle>) => {
    try {
      const response = await adminService.updateSalle(id, updates);
      if (response.success) {
        setShowModalModification(false);
        setSalleAModifier(null);
        loadSalles(); // Recharger la liste
      } else {
        console.error('Erreur lors de la mise à jour:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la salle:', error);
    }
  };

  const handleDeleteSalle = async (id: number) => {
    try {
      const response = await adminService.deleteSalle(id);
      if (response.success) {
        loadSalles(); // Recharger la liste
      } else {
        console.error('Erreur lors de la suppression:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la salle:', error);
    }
  };

  const handleCreateBatiment = async (batiment: Omit<Batiment, 'id' | 'dateCreation'>) => {
    try {
      const response = await adminService.createBatiment(batiment);
      if (response.success) {
        setShowModalAjoutBatiment(false);
        loadBatiments(); // Recharger la liste
      } else {
        console.error('Erreur lors de la création:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création du bâtiment:', error);
    }
  };

  const handleUpdateBatiment = async (id: number, updates: Partial<Batiment>) => {
    try {
      const response = await adminService.updateBatiment(id, updates);
      if (response.success) {
        setShowModalModification(false);
        setBatimentAModifier(null);
        loadBatiments(); // Recharger la liste
      } else {
        console.error('Erreur lors de la mise à jour:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bâtiment:', error);
    }
  };

  const handleDeleteBatiment = async (id: number) => {
    try {
      const response = await adminService.deleteBatiment(id);
      if (response.success) {
        loadBatiments(); // Recharger la liste
      } else {
        console.error('Erreur lors de la suppression:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du bâtiment:', error);
    }
  };

  const ouvrirModalAjoutSalle = () => {
    setSalleAModifier(null);
    setShowModalAjout(true);
  };

  const ouvrirModalModificationSalle = (salle: Salle) => {
    setSalleAModifier(salle);
    setShowModalModification(true);
  };

  const ouvrirModalAjoutBatiment = () => {
    setBatimentAModifier(null);
    setShowModalAjoutBatiment(true); // Reuse the same modal for both
  };

  const ouvrirModalModificationBatiment = (batiment: Batiment) => {
    setBatimentAModifier(batiment);
    setShowModalModification(true);
  };

  const fermerModalSalle = () => {
    setShowModalAjout(false);
    setShowModalModification(false);
    setSalleAModifier(null);
    setBatimentAModifier(null);
  };

  const fermerModalBatiment = () => {
    setShowModalAjout(false);
    setShowModalModification(false);
    setSalleAModifier(null);
    setBatimentAModifier(null);
  };

  const fermerFormulaireSalle = () => {
    setShowModalAjout(false);
    setShowModalModification(false);
    setSalleAModifier(null);
  };

  const fermerFormulaireBatiment = () => {
    setShowModalAjout(false);
    setShowModalModification(false);
    setBatimentAModifier(null);
  };

  const getStatutBadge = (statut: StatutSalle | StatutBatiment) => {
    const statutConfig = STATUTS_SALLE.find(s => s.value === statut) || STATUTS_BATIMENT.find(s => s.value === statut);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statutConfig?.couleur}-100 text-${statutConfig?.couleur}-800`}>
        {statutConfig?.label}
      </span>
    );
  };

  const getTypeBadge = (type: TypeSalle) => {
    const typeConfig = TYPES_SALLE.find(t => t.value === type);
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        {typeConfig?.label}
      </span>
    );
  };

  const sallesFiltrees = salles.filter(salle => {
    const matchSearch = salle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       salle.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       salle.batimentNom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !filterType || salle.type === filterType;
    const matchBatiment = !filterBatiment || salle.batimentId === parseInt(filterBatiment);
    
    return matchSearch && matchType && matchBatiment;
  });

  const batimentsFiltres = batiments.filter(batiment => {
    return batiment.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
           batiment.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Salles et Bâtiments</h1>
        <p className="text-gray-600">Gérez les salles de cours et les bâtiments de l'établissement</p>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("salles")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "salles"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Salles ({salles.length})
            </button>
            <button
              onClick={() => setActiveTab("batiments")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "batiments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Bâtiments ({batiments.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "salles" && (
        <div>
          {/* Filtres et recherche */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une salle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les types</option>
                {TYPES_SALLE.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                value={filterBatiment}
                onChange={(e) => setFilterBatiment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les bâtiments</option>
                {batiments.map((batiment: Batiment) => (
                  <option key={batiment.id} value={batiment.id}>
                    {batiment.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bouton ajouter */}
          <div className="mb-6">
            <button
              onClick={ouvrirModalAjoutSalle}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une salle
            </button>
          </div>

          {/* Tableau des salles */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bâtiment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacité
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
                {sallesFiltrees.map((salle) => (
                  <tr key={salle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{salle.nom}</div>
                        <div className="text-sm text-gray-500">{salle.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{salle.batimentNom}</span>
                        <span className="text-sm text-gray-500">(Étage {salle.etage})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(salle.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{salle.capacite} places</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatutBadge(salle.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => ouvrirModalModificationSalle(salle)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSalle(salle.id)}
                          className="text-red-600 hover:text-red-900"
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
      )}

      {activeTab === "batiments" && (
        <div>
          {/* Filtres et recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un bâtiment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bouton ajouter */}
          <div className="mb-6">
            <button
              onClick={ouvrirModalAjoutBatiment}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un bâtiment
            </button>
          </div>

          {/* Tableau des bâtiments */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bâtiment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salles
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
                {batimentsFiltres.map((batiment) => {
                  const sallesDuBatiment = salles.filter(s => s.batimentId === batiment.id);
                  return (
                    <tr key={batiment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{batiment.nom}</div>
                          <div className="text-sm text-gray-500">{batiment.code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{batiment.adresse || "Non spécifiée"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{batiment.nombreEtages} étage(s)</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{sallesDuBatiment.length} salle(s)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatutBadge(batiment.statut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => ouvrirModalModificationBatiment(batiment)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBatiment(batiment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal pour les salles */}
      <Modal
        isOpen={showModalAjout || showModalModification}
        onClose={fermerModalSalle}
        title={salleAModifier ? "Modifier la salle" : "Ajouter une salle"}
      >
        <FormulaireSalle
          onSubmit={(salle: Salle) => {
            if (salleAModifier) {
              handleUpdateSalle(salle.id, salle);
            } else {
              handleCreateSalle(salle);
            }
          }}
          onClose={fermerFormulaireSalle}
                                  salleAModifier={salleAModifier}
            modeEdition={!!salleAModifier}
            batiments={batiments}
        />
      </Modal>

      {/* Modal pour les bâtiments */}
      <Modal
        isOpen={showModalAjoutBatiment || showModalModification}
        onClose={fermerModalBatiment}
        title={batimentAModifier ? "Modifier le bâtiment" : "Ajouter un bâtiment"}
      >
        <FormulaireBatiment
          onSubmit={(batiment: Batiment) => {
            if (batimentAModifier) {
              handleUpdateBatiment(batiment.id, batiment);
            } else {
              handleCreateBatiment(batiment);
            }
          }}
          onClose={fermerFormulaireBatiment}
          batimentAModifier={batimentAModifier}
          modeEdition={!!batimentAModifier}
        />
      </Modal>
    </div>
  );
};

export default SallesAdmin;
