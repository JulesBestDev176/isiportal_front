import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit3, Trash2, Users, User, 
  School, Mail, Phone, MapPin, Calendar,
  UserCheck, AlertCircle, CheckCircle, UserPlus, List, X,
  Baby, GraduationCap, Heart, FileText, Eye, ChevronDown,
  BookOpen, Clock, Target, PlayCircle, Video, Volume2, Image, Link, File, Check, CalendarDays,
  Info, Settings, BarChart3, Users2, Clock3, BookOpenCheck, CalendarCheck,
  EyeOff, Eye as EyeIcon, Lock, Unlock, Shield, ShieldOff
} from "lucide-react";
import { 
  Utilisateur, 
  Gestionnaire, 
  Professeur, 
  Eleve, 
  Parent, 
  FormDataUtilisateur,
  SECTIONS,
  MATIERES_LIST,
  CLASSES_LIST
} from "../../models";
import { adminService } from '../../services/adminService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';
import { NoteDetails, SemestreNotes, AnneeNotes, NotesEleve } from '../../models/utilisateur.model';

// Données de référence
const sections: Array<{ value: "college" | "lycee"; label: string; description: string }> = [
  { value: "college", label: "Collège", description: "Classes de 6ème à 3ème" },
  { value: "lycee", label: "Lycée", description: "Classes de 2nde à Terminale" }
];

// Suppression des interfaces locales - maintenant importées depuis les modèles

// Fonction pour charger les notes d'un élève
const loadNotesEleve = async (eleveId: number) => {
  try {
    // TODO: Implémenter l'appel au service pour charger les notes
    return {};
  } catch (error) {
    console.error('Erreur lors du chargement des notes:', error);
    return {};
  }
};

// Fonction pour charger les absences d'un élève
const loadAbsencesEleve = async (eleveId: number) => {
  try {
    // TODO: Implémenter l'appel au service pour charger les absences
    return {};
  } catch (error) {
    console.error('Erreur lors du chargement des absences:', error);
    return {};
  }
};

// Composant Modal
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
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
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

// Composant Formulaire adaptatif
const FormulaireUtilisateur: React.FC<{
  typeUtilisateur: string;
  onSubmit: (utilisateur: any) => void;
  onClose: () => void;
  utilisateurs: any[];
  utilisateurAModifier?: any;
  modeEdition?: boolean;
}> = ({ typeUtilisateur, onSubmit, onClose, utilisateurs, utilisateurAModifier, modeEdition = false }) => {
  const [formData, setFormData] = useState<Partial<FormDataUtilisateur>>(() => {
    if (modeEdition && utilisateurAModifier) {
      return {
        nom: utilisateurAModifier.nom || "",
        prenom: utilisateurAModifier.prenom || "",
        email: utilisateurAModifier.email || "",
        telephone: utilisateurAModifier.telephone || "",
        adresse: utilisateurAModifier.adresse || "",
        role: utilisateurAModifier.role || typeUtilisateur as any,
        sections: utilisateurAModifier.sections || [],
        matieres: utilisateurAModifier.matieres || [],
        cours: utilisateurAModifier.cours || [],
        classeId: utilisateurAModifier.classeId || 0,
        dateNaissance: utilisateurAModifier.dateNaissance || "",
        lieuNaissance: utilisateurAModifier.lieuNaissance || "",
        numeroEtudiant: utilisateurAModifier.numeroEtudiant || "",
        parentsIds: utilisateurAModifier.parentsIds || [],
        enfantsIds: utilisateurAModifier.enfantsIds || [],
        profession: utilisateurAModifier.profession || ""
      };
    }
    return {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      role: typeUtilisateur as any,
      sections: [],
      matieres: [],
      cours: [],
      classeId: 0,
      dateNaissance: "",
      lieuNaissance: "",
      numeroEtudiant: "",
      parentsIds: [],
      enfantsIds: [],
      profession: ""
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [parentSearch, setParentSearch] = useState("");
  const [parentDropdown, setParentDropdown] = useState(false);
  const [enfantSearch, setEnfantSearch] = useState("");
  
  // États pour la gestion des parents
  const [parentMode, setParentMode] = useState<"existing" | "new">("existing");
  const [newParents, setNewParents] = useState([
    {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      profession: ""
    }
  ]);

  // Fonctions pour gérer les parents
  const addParent = () => {
    if (newParents.length < 2) {
      setNewParents([...newParents, {
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        profession: ""
      }]);
    }
  };

  const removeParent = (index: number) => {
    if (index > 0) { // Ne pas supprimer le premier parent
      setNewParents(newParents.filter((_, i) => i !== index));
    }
  };

  const updateParent = (index: number, updatedParent: any) => {
    setNewParents(newParents.map((parent, i) => i === index ? updatedParent : parent));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom?.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom?.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email?.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";

    // Validation spécifique par type
    if (typeUtilisateur === "gestionnaire") {
      if (!formData.sections?.length) newErrors.sections = "Au moins une section est requise";
    } else if (typeUtilisateur === "professeur") {
      if (!formData.matieres?.length) newErrors.matieres = "Au moins une matière est requise";
    } else if (typeUtilisateur === "eleve") {
      if (!formData.classeId) newErrors.classeId = "La classe est requise";
      if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
      
      // Validation des parents selon le mode
      if (parentMode === "existing") {
        if (!formData.parentsIds?.length) newErrors.parentsIds = "Au moins un parent est requis";
      } else if (parentMode === "new") {
        // Vérifier que le premier parent a les informations requises
        const firstParent = newParents[0];
        if (!firstParent.nom || !firstParent.prenom || !firstParent.email) {
          newErrors.parentsIds = "Les informations du parent 1 sont requises (Nom, Prénom, Email)";
        }
        
        // Vérifier que tous les parents ont des informations complètes si remplis
        newParents.forEach((parent, index) => {
          if (parent.nom || parent.prenom || parent.email) {
            if (!parent.nom || !parent.prenom || !parent.email) {
              newErrors.parentsIds = `Les informations du parent ${index + 1} sont incomplètes`;
            }
          }
        });
      }
      
      // Génération automatique du numéro étudiant si vide
      if (!formData.numeroEtudiant) {
        const numero = `2024${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        setFormData(prev => ({ ...prev, numeroEtudiant: numero }));
      }
    } else if (typeUtilisateur === "parent") {
      if (!formData.enfantsIds?.length) newErrors.enfantsIds = "Au moins un enfant doit être sélectionné";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Gestion des nouveaux parents si mode "new"
      let parentsIds = formData.parentsIds || [];
      if (typeUtilisateur === "eleve" && parentMode === "new") {
        // Créer les nouveaux parents
        const createdParents = newParents
          .filter(parent => parent.nom && parent.prenom && parent.email) // Filtrer les parents avec des informations complètes
          .map((parent, index) => {
            const parentId = Math.floor(Math.random() * 10000) + 2000 + index;
            return {
              id: parentId,
              nom: parent.nom,
              prenom: parent.prenom,
              email: parent.email,
              telephone: parent.telephone || "",
              adresse: parent.adresse || "",
              profession: parent.profession || "",
              role: "parent",
              enfantsIds: [],
              actif: true,
              dateCreation: new Date().toISOString().split('T')[0]
            };
          });
        
        // Mettre à jour les IDs des parents
        parentsIds = createdParents.map(parent => parent.id);
        
        // Ajouter les nouveaux parents à la liste des utilisateurs
        // Note: Dans une vraie application, cela serait géré par l'API
        console.log("Nouveaux parents à créer:", createdParents);
      }

      const nouvelUtilisateur = {
        ...formData,
        parentsIds: parentsIds,
        id: modeEdition && utilisateurAModifier ? utilisateurAModifier.id : Math.floor(Math.random() * 10000) + 1000,
        actif: modeEdition && utilisateurAModifier ? utilisateurAModifier.actif : true,
        dateCreation: modeEdition && utilisateurAModifier ? utilisateurAModifier.dateCreation : new Date().toISOString().split('T')[0],
        dateModification: modeEdition ? new Date().toISOString().split('T')[0] : undefined
      };

      // TODO: Avec le backend Laravel, générer le mot de passe et envoyer un email avec les informations de connexion
      if (!modeEdition) {
        console.log(`Email à envoyer à ${formData.email} avec les informations de connexion (mot de passe généré côté serveur)`);
      }

      onSubmit(nouvelUtilisateur);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSpecificFields = () => {
    switch (typeUtilisateur) {
      case "gestionnaire":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Sections *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sections.map(section => (
                  <label key={section.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sections?.includes(section.value) || false}
                      onChange={(e) => {
                        const sectionsArray = formData.sections || [];
                        if (e.target.checked) {
                          setFormData({...formData, sections: [...sectionsArray, section.value]});
                        } else {
                          setFormData({...formData, sections: sectionsArray.filter(s => s !== section.value)});
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{section.label}</span>
                  </label>
                ))}
              </div>
              {errors.sections && (
                <p className="text-red-500 text-sm mt-1">{errors.sections}</p>
              )}
            </div>
          </div>
        );

      case "professeur":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Sections
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sections.map(section => (
                  <label key={section.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sections?.includes(section.value) || false}
                      onChange={(e) => {
                        const sectionsArray = formData.sections || [];
                        if (e.target.checked) {
                          setFormData({...formData, sections: [...sectionsArray, section.value]});
                        } else {
                          setFormData({...formData, sections: sectionsArray.filter(s => s !== section.value)});
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Matières enseignées *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MATIERES_LIST.map((matiere, index) => (
                  <label key={index + 1} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.matieres?.includes(index + 1) || false}
                      onChange={(e) => {
                        const matieres = formData.matieres || [];
                        if (e.target.checked) {
                          setFormData({...formData, matieres: [...matieres, index + 1]});
                        } else {
                          setFormData({...formData, matieres: matieres.filter(m => m !== index + 1)});
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{matiere}</span>
                  </label>
                ))}
              </div>
              {errors.matieres && (
                <p className="text-red-500 text-sm mt-1">{errors.matieres}</p>
              )}
            </div>


          </div>
        );

      case "eleve":
        const parents = utilisateurs.filter(u => u.role === "parent");
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Classe *
              </label>
              <select
                value={formData.classeId || ""}
                onChange={(e) => setFormData({...formData, classeId: parseInt(e.target.value)})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.classeId ? 'border-red-500' : 'border-neutral-300'
                }`}
              >
                <option value="">Sélectionner une classe</option>
                {CLASSES_LIST.map((classe, index) => (
                  <option key={index + 1} value={index + 1}>
                    {classe}
                  </option>
                ))}
              </select>
              {errors.classeId && (
                <p className="text-red-500 text-sm mt-1">{errors.classeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date de naissance *
              </label>
              <input
                type="date"
                value={formData.dateNaissance || ""}
                onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dateNaissance ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.dateNaissance && (
                <p className="text-red-500 text-sm mt-1">{errors.dateNaissance}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Lieu de naissance
              </label>
              <input
                type="text"
                value={formData.lieuNaissance || ""}
                onChange={(e) => setFormData({...formData, lieuNaissance: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Dakar, Sénégal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Numéro étudiant
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.numeroEtudiant || ""}
                  onChange={(e) => setFormData({...formData, numeroEtudiant: e.target.value})}
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Numéro d'étudiant"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => {
                    const numero = `2024${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
                    setFormData({...formData, numeroEtudiant: numero});
                  }}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Générer
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Le numéro sera généré automatiquement si laissé vide</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Parents *
              </label>
              
              {/* Options pour les parents */}
              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setParentMode("existing")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      parentMode === "existing" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Parents existants
                  </button>
                  <button
                    type="button"
                    onClick={() => setParentMode("new")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      parentMode === "new" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Nouveaux parents
                  </button>
                </div>
              </div>

              {/* Mode Parents existants */}
              {parentMode === "existing" && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={parentSearch}
                      onChange={e => {
                        setParentSearch(e.target.value);
                        setParentDropdown(true);
                      }}
                      onFocus={() => setParentDropdown(true)}
                      onBlur={() => setTimeout(() => setParentDropdown(false), 150)}
                      placeholder="Rechercher un parent..."
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {parentDropdown && (
                      <div className="absolute z-10 bg-white border border-neutral-200 rounded shadow w-full max-h-40 overflow-y-auto">
                        {parents.filter(p =>
                          (p.prenom + " " + p.nom).toLowerCase().includes(parentSearch.toLowerCase())
                        ).map(parent => (
                          <div
                            key={parent.id}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            onMouseDown={() => {
                              const parentsIds = formData.parentsIds || [];
                              if (!parentsIds.includes(parent.id) && parentsIds.length < 2) {
                                setFormData({...formData, parentsIds: [...parentsIds, parent.id]});
                              }
                              setParentSearch("");
                              setParentDropdown(false);
                            }}
                          >
                            {parent.prenom} {parent.nom}
                          </div>
                        ))}
                        {parents.filter(p =>
                          (p.prenom + " " + p.nom).toLowerCase().includes(parentSearch.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-2 text-gray-400">Aucun parent trouvé</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Affichage des parents sélectionnés */}
                  {formData.parentsIds && formData.parentsIds.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Parents sélectionnés ({formData.parentsIds.length}/2) :</p>
                      {formData.parentsIds.map(parentId => {
                        const parent = parents.find(p => p.id === parentId);
                        return parent ? (
                          <div key={parentId} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                            <div>
                              <span className="font-medium">{parent.prenom} {parent.nom}</span>
                              <p className="text-xs text-gray-600">{parent.email}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData, 
                                  parentsIds: formData.parentsIds?.filter(id => id !== parentId) || []
                                });
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Mode Nouveaux parents */}
              {parentMode === "new" && (
                <div className="space-y-4">
                  {/* Liste des parents */}
                  {newParents.map((parent, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Parent {index + 1} {index === 0 ? "(obligatoire)" : "(optionnel)"}
                        </h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeParent(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de famille *
                          </label>
                          <input
                            type="text"
                            value={parent.nom || ""}
                            onChange={(e) => updateParent(index, { ...parent, nom: e.target.value })}
                            placeholder="Nom de famille"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prénom *
                          </label>
                          <input
                            type="text"
                            value={parent.prenom || ""}
                            onChange={(e) => updateParent(index, { ...parent, prenom: e.target.value })}
                            placeholder="Prénom"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={parent.email || ""}
                            onChange={(e) => updateParent(index, { ...parent, email: e.target.value })}
                            placeholder="exemple@email.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            value={parent.telephone || ""}
                            onChange={(e) => updateParent(index, { ...parent, telephone: e.target.value })}
                            placeholder="+221 XX XXX XX XX"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse
                          </label>
                          <input
                            type="text"
                            value={parent.adresse || ""}
                            onChange={(e) => updateParent(index, { ...parent, adresse: e.target.value })}
                            placeholder="Adresse complète"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profession
                          </label>
                          <input
                            type="text"
                            value={parent.profession || ""}
                            onChange={(e) => updateParent(index, { ...parent, profession: e.target.value })}
                            placeholder="Profession"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Bouton pour ajouter un parent */}
                  {newParents.length < 2 && (
                    <button
                      type="button"
                      onClick={addParent}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Ajouter un parent
                    </button>
                  )}
                </div>
              )}
              
              {errors.parentsIds && (
                <p className="text-red-500 text-sm mt-1">{errors.parentsIds}</p>
              )}
            </div>
          </div>
        );

      case "parent":
        const eleves = utilisateurs.filter(u => u.role === "eleve");
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Profession
              </label>
              <input
                type="text"
                value={formData.profession || ""}
                onChange={(e) => setFormData({...formData, profession: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Profession du parent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Enfants *
              </label>
              <input
                type="text"
                value={enfantSearch}
                onChange={e => setEnfantSearch(e.target.value)}
                placeholder="Rechercher un enfant..."
                className="w-full mb-2 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {eleves.filter(eleve =>
                  (eleve.prenom + " " + eleve.nom).toLowerCase().includes(enfantSearch.toLowerCase())
                ).map(eleve => (
                  <label key={eleve.id} className="flex items-center p-2 border rounded hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={formData.enfantsIds?.includes(eleve.id) || false}
                      onChange={(e) => {
                        const enfantsIds = formData.enfantsIds || [];
                        if (e.target.checked) {
                          setFormData({...formData, enfantsIds: [...enfantsIds, eleve.id]});
                        } else {
                          setFormData({...formData, enfantsIds: enfantsIds.filter(id => id !== eleve.id)});
                        }
                      }}
                      className="mr-2"
                    />
                    <span>{eleve.prenom} {eleve.nom} (Classe {CLASSES_LIST[eleve.classeId - 1] || eleve.classeId})</span>
                  </label>
                ))}
                {eleves.filter(eleve =>
                  (eleve.prenom + " " + eleve.nom).toLowerCase().includes(enfantSearch.toLowerCase())
                ).length === 0 && (
                  <div className="px-4 py-2 text-gray-400">Aucun enfant trouvé</div>
                )}
              </div>
              {errors.enfantsIds && (
                <p className="text-red-500 text-sm mt-1">{errors.enfantsIds}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations personnelles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={formData.nom || ""}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nom ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Nom de famille"
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              value={formData.prenom || ""}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.prenom ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Prénom"
            />
            {errors.prenom && (
              <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="exemple@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.telephone || ""}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+221 XX XXX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={formData.adresse || ""}
              onChange={(e) => setFormData({...formData, adresse: e.target.value})}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Adresse complète"
            />
          </div>
        </div>
      </div>

      {/* Champs spécifiques */}
      {renderSpecificFields()}

      {/* Actions */}
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

// Composant Liste adaptative
const ListeUtilisateurs: React.FC<{
  liste: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeUtilisateur: string;
  utilisateurs: any[];
  onModifierUtilisateur: (utilisateur: any) => void;
  onSupprimerUtilisateur: (utilisateur: any) => void;
}> = ({ liste, searchTerm, setSearchTerm, typeUtilisateur, utilisateurs, onModifierUtilisateur, onSupprimerUtilisateur }) => {

  const getSpecificInfo = (user: any) => {
    switch (typeUtilisateur) {
      case "gestionnaire":
        return (
          <div className="text-sm space-y-1">
            <p className="font-medium">
              {user.sections?.map((s: string) => sections.find(sec => sec.value === s)?.label).join(", ") || "N/A"}
            </p>
          </div>
        );

      case "professeur":
        return (
          <div className="text-sm space-y-1">
            <p><strong>Sections:</strong> {user.sections?.map((s: string) => sections.find(sec => sec.value === s)?.label).join(", ") || "N/A"}</p>
            <p><strong>Matières:</strong> {user.matieres?.map((id: number) => MATIERES_LIST[id - 1]).join(", ") || "N/A"}</p>
          </div>
        );

      case "eleve":
        const parents = user.parentsIds?.map((id: number) => utilisateurs.find(u => u.id === id)).filter(Boolean) || [];
        return (
          <div className="text-sm space-y-1">
            <p><strong>Classe:</strong> {CLASSES_LIST[user.classeId - 1] || user.classeId}</p>
            <p><strong>Naissance:</strong> {user.dateNaissance}</p>
            <p><strong>Lieu:</strong> {user.lieuNaissance || "Non renseigné"}</p>
            {user.numeroEtudiant && <p><strong>N° Étudiant:</strong> {user.numeroEtudiant}</p>}
            {parents.length > 0 && (
              <p><strong>Parents:</strong> {parents.length} parent(s)</p>
            )}
          </div>
        );

      case "parent":
        const enfants = user.enfantsIds?.map((id: number) => utilisateurs.find(u => u.id === id)).filter(Boolean) || [];
        return (
          <div className="text-sm space-y-1">
            {user.profession && <p><strong>Profession:</strong> {user.profession}</p>}
            <p><strong>Enfants:</strong></p>
            {enfants.map((enfant: any) => (
              <p key={enfant.id} className="ml-4">
                • {enfant.prenom} {enfant.nom} (Classe {CLASSES_LIST[enfant.classeId - 1] || enfant.classeId})
              </p>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const [utilisateurFiche, setUtilisateurFiche] = useState<any>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Recherche */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Informations spécifiques
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
              {liste.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-neutral-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {user.prenom} {user.nom}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-2">
                      {user.email && (
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className="truncate max-w-48">{user.email}</span>
                        </div>
                      )}
                      {user.telephone && (
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span>{user.telephone}</span>
                        </div>
                      )}
                      {user.adresse && (
                        <div className="flex items-center gap-2 text-neutral-500">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="truncate max-w-32">{user.adresse}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getSpecificInfo(user)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.actif ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        user.actif ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.dateCreation}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUtilisateurFiche(user);
                        }}
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onModifierUtilisateur(user);
                        }}
                        className="p-2 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSupprimerUtilisateur(user);
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

        {liste.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Aucun {typeUtilisateur} trouvé
            </h3>
            <p className="text-neutral-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </div>
      {typeUtilisateur === "eleve" && utilisateurs.some(u => u.role === "gestionnaire") && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => alert("Bulletins générés pour tous les élèves (simulation)")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Générer les bulletins
          </button>
        </div>
      )}
      {utilisateurFiche && (
        <Modal isOpen={!!utilisateurFiche} onClose={() => setUtilisateurFiche(null)} title={`Détails de ${utilisateurFiche.prenom} ${utilisateurFiche.nom}`}>
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nom complet :</strong> {utilisateurFiche.prenom} {utilisateurFiche.nom}</p>
                  <p><strong>Rôle :</strong> {utilisateurFiche.role.charAt(0).toUpperCase() + utilisateurFiche.role.slice(1)}</p>
                  <p><strong>Statut :</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      utilisateurFiche.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {utilisateurFiche.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </p>
                  <p><strong>Date de création :</strong> {utilisateurFiche.dateCreation}</p>
                </div>
                <div>
                  {utilisateurFiche.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <strong>Email :</strong> 
                      <a href={`mailto:${utilisateurFiche.email}`} className="text-blue-600 hover:underline">
                        {utilisateurFiche.email}
                      </a>
                    </p>
                  )}
                  {utilisateurFiche.telephone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <strong>Téléphone :</strong> 
                      <a href={`tel:${utilisateurFiche.telephone}`} className="text-green-600 hover:underline">
                        {utilisateurFiche.telephone}
                      </a>
                    </p>
                  )}
                  {utilisateurFiche.adresse && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <strong>Adresse :</strong> {utilisateurFiche.adresse}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Informations spécifiques selon le rôle */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3">Informations spécifiques</h3>
              {utilisateurFiche.role === "eleve" ? (
                <div className="text-sm space-y-2">
                  <p><strong>Classe:</strong> {CLASSES_LIST[utilisateurFiche.classeId - 1] || utilisateurFiche.classeId}</p>
                  <p><strong>Date de naissance:</strong> {utilisateurFiche.dateNaissance}</p>
                  <p><strong>Lieu de naissance:</strong> {utilisateurFiche.lieuNaissance || "Non renseigné"}</p>
                  {utilisateurFiche.numeroEtudiant && <p><strong>Numéro étudiant:</strong> {utilisateurFiche.numeroEtudiant}</p>}
                  {utilisateurFiche.parentsIds && utilisateurFiche.parentsIds.length > 0 && (
                    <div>
                      <p><strong>Parents:</strong></p>
                      {utilisateurFiche.parentsIds.map((parentId: number, index: number) => {
                        const parent = utilisateurs.find(u => u.id === parentId);
                        return parent ? (
                          <p key={parentId} className="ml-4">
                            • {parent.prenom} {parent.nom} ({parent.email})
                          </p>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              ) : (
                getSpecificInfo(utilisateurFiche)
              )}
            </div>

            {/* Section des notes pour les élèves */}
            {utilisateurFiche.role === "eleve" && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  Notes et résultats
                </h3>
                <div className="space-y-4">
                  {/* TODO: Charger les notes depuis le service */}
                  <p className="text-gray-500">Notes à charger depuis le service</p>
                </div>
              </div>
            )}

            {/* Section des absences pour les élèves */}
            {utilisateurFiche.role === "eleve" && (
              <div className="bg-red-50 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Absences
                </h3>
                <div className="space-y-4">
                  {/* TODO: Charger les absences depuis le service */}
                  <p className="text-gray-500">Absences à charger depuis le service</p>
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  onModifierUtilisateur(utilisateurFiche);
                  setUtilisateurFiche(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => setUtilisateurFiche(null)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

// Composant principal
const Utilisateurs: React.FC = () => {
  const { utilisateur } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterStatut, setFilterStatut] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"liste" | "ajouter">("liste");
  const [activeRoleTab, setActiveRoleTab] = useState<string>("tous");
  const [utilisateurFiche, setUtilisateurFiche] = useState<Utilisateur | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [modalType, setModalType] = useState<string>("");
  const [utilisateurAModifier, setUtilisateurAModifier] = useState<Utilisateur | null>(null);
  const [modalSuppression, setModalSuppression] = useState(false);
  const [utilisateurASupprimer, setUtilisateurASupprimer] = useState<Utilisateur | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showModalAjout, setShowModalAjout] = useState(false);
  const [showModalModification, setShowModalModification] = useState(false);

  // Onglets disponibles selon les permissions
  const availableTabs = [
    { id: "tous", label: "Tous", canAdd: true, icon: <Users className="w-4 h-4" /> },
    { id: "gestionnaire", label: "Gestionnaires", canAdd: true, icon: <UserCheck className="w-4 h-4" /> },
    { id: "professeur", label: "Professeurs", canAdd: true, icon: <GraduationCap className="w-4 h-4" /> },
    { id: "eleve", label: "Élèves", canAdd: true, icon: <Baby className="w-4 h-4" /> },
    { id: "parent", label: "Parents", canAdd: true, icon: <Heart className="w-4 h-4" /> }
  ];

  const currentTab = availableTabs.find(tab => tab.id === activeRoleTab);
  const isAdmin = utilisateur?.role === "administrateur";
  const isGestionnaire = utilisateur?.role === "gestionnaire";
  const utilisateurConnecte = utilisateur;

  // Charger les données au montage
  useEffect(() => {
    loadUtilisateurs();
    loadNotifications();
  }, []);

  const loadUtilisateurs = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUtilisateurs({
        page: 1,
        limit: 100,
        search: searchTerm,
        filters: activeRoleTab !== "tous" ? { role: activeRoleTab } : undefined
      });
      
      if (response.success && response.data) {
        setUtilisateurs(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
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

  const handleCreateUtilisateur = async (utilisateur: Omit<Utilisateur, 'id' | 'dateCreation'>) => {
    try {
      const response = await adminService.createUtilisateur(utilisateur);
      if (response.success) {
        setModalOpen(false);
        loadUtilisateurs(); // Recharger la liste
        // Afficher une notification de succès
        console.log('Utilisateur créé avec succès');
      } else {
        console.error('Erreur lors de la création:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
  };

  const handleUpdateUtilisateur = async (id: number, updates: Partial<Utilisateur>) => {
    try {
      const response = await adminService.updateUtilisateur(id, updates);
      if (response.success) {
        setModalOpen(false);
        setUtilisateurAModifier(null);
        loadUtilisateurs(); // Recharger la liste
        console.log('Utilisateur mis à jour avec succès');
      } else {
        console.error('Erreur lors de la mise à jour:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  const handleDeleteUtilisateur = async (id: number) => {
    try {
      const response = await adminService.deleteUtilisateur(id);
      if (response.success) {
        loadUtilisateurs(); // Recharger la liste
        console.log('Utilisateur supprimé avec succès');
      } else {
        console.error('Erreur lors de la suppression:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    }
  };

  const handleToggleStatus = async (id: number, actif: boolean) => {
    try {
      const response = await adminService.toggleUtilisateurStatus(id, actif);
      if (response.success) {
        await loadUtilisateurs();
      }
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error);
    }
  };

  // Fonctions pour les modals
  const ouvrirModalAjout = (type: string) => {
    setModalType(type);
    setModeEdition(false);
    setUtilisateurAModifier(null);
    setModalOpen(true);
  };

  const ouvrirModalModification = (utilisateur: Utilisateur) => {
    setModalType(utilisateur.role);
    setModeEdition(true);
    setUtilisateurAModifier(utilisateur);
    setModalOpen(true);
  };

  const ouvrirModalSuppression = (utilisateur: Utilisateur) => {
    setUtilisateurASupprimer(utilisateur);
    setModalSuppression(true);
  };

  const ajouterUtilisateur = async (utilisateur: any) => {
    try {
      const response = await adminService.createUtilisateur(utilisateur);
      if (response.success) {
        // Envoyer les informations de connexion par email
        await adminService.envoyerInfosConnexion(response.data?.id || 0);
        
        await loadUtilisateurs();
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };

  const confirmerSuppression = async () => {
    if (!utilisateurASupprimer) return;
    
    try {
      const response = await adminService.deleteUtilisateur(utilisateurASupprimer.id);
      if (response.success) {
        await loadUtilisateurs();
        setModalSuppression(false);
        setUtilisateurASupprimer(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  // Liste filtrée
  const liste = utilisateurs;
  const filteredListe = liste.filter((u: Utilisateur) => {
    const matchSearch = !searchTerm || 
      u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    const matchStatut = !filterStatut || (u.actif ? "actif" : "inactif") === filterStatut;
    
    return matchSearch && matchRole && matchStatut;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestion des utilisateurs</h1>
          <p className="text-neutral-600 mt-1">
            Connecté en tant que: {utilisateurConnecte?.role}
            {utilisateurConnecte?.role === "professeur" && ` - Professeur`}
            {utilisateurConnecte?.role === "gestionnaire" && ` - Gestionnaire`}
            {utilisateurConnecte?.role === "administrateur" && ` - Administrateur`}
          </p>
        </div>
        
        {/* Bouton d'ajout selon les droits */}
        {currentTab?.canAdd && (
          <button
            onClick={() => ouvrirModalAjout(activeRoleTab)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter {activeRoleTab === "eleve" ? "un élève" : 
                    activeRoleTab === "parent" ? "un parent" :
                    activeRoleTab === "professeur" ? "un professeur" :
                    "un gestionnaire"}
          </button>
        )}
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRoleTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeRoleTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                  {liste.filter(u => u.role === tab.id).length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <ListeUtilisateurs
              key={activeRoleTab}
              liste={filteredListe}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              typeUtilisateur={activeRoleTab}
              utilisateurs={liste}
              onModifierUtilisateur={ouvrirModalModification}
              onSupprimerUtilisateur={ouvrirModalSuppression}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total utilisateurs",
            value: liste.length,
            icon: <Users className="w-5 h-5" />,
            color: "bg-blue-500"
          },
          {
            title: "Gestionnaires",
            value: liste.filter(u => u.role === "gestionnaire").length,
            icon: <UserCheck className="w-5 h-5" />,
            color: "bg-green-500"
          },
          {
            title: "Professeurs",
            value: liste.filter(u => u.role === "professeur").length,
            icon: <GraduationCap className="w-5 h-5" />,
            color: "bg-purple-500"
          },
          {
            title: "Élèves",
            value: liste.filter(u => u.role === "eleve").length,
            icon: <Baby className="w-5 h-5" />,
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

      {/* Modal d'ajout */}
              <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModeEdition(false);
            setUtilisateurAModifier(null);
          }}
          title={`${modeEdition ? "Modifier" : "Ajouter"} ${modalType === "eleve" ? "un élève" : 
                          modalType === "parent" ? "un parent" :
                          modalType === "professeur" ? "un professeur" :
                          "un gestionnaire"}`}
        >
          <FormulaireUtilisateur
            typeUtilisateur={modalType}
            onSubmit={ajouterUtilisateur}
            onClose={() => {
              setModalOpen(false);
              setModeEdition(false);
              setUtilisateurAModifier(null);
            }}
            utilisateurs={liste}
            utilisateurAModifier={utilisateurAModifier}
            modeEdition={modeEdition}
          />
        </Modal>

      {/* Informations sur les permissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Permissions actuelles ({utilisateurConnecte?.role}):
            </p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              {isAdmin && (
                <>
                  <li>• Peut ajouter et gérer tous les gestionnaires</li>
                  <li>• Peut ajouter et gérer tous les professeurs</li>
                  <li>• Peut ajouter et gérer tous les élèves</li>
                  <li>• Peut ajouter et gérer tous les parents</li>
                  <li>• Accès complet à toutes les fonctionnalités</li>
                </>
              )}
              {isGestionnaire && (
                <>
                  <li>• Peut ajouter et gérer les professeurs, élèves et parents de sa section</li>
                  <li>• Lecture seule sur les gestionnaires</li>
                </>
              )}
              {utilisateurConnecte?.role === "professeur" && (
                <li>• Lecture seule sur les élèves de sa section</li>
              )}
              {utilisateurConnecte?.role === "parent" && (
                <li>• Lecture seule sur ses enfants uniquement</li>
              )}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Modal de confirmation de suppression */}
      {modalSuppression && utilisateurASupprimer && (
        <Modal
          isOpen={modalSuppression}
          onClose={() => {
            setModalSuppression(false);
            setUtilisateurASupprimer(null);
          }}
          title="Confirmer la suppression"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Supprimer {utilisateurASupprimer.prenom} {utilisateurASupprimer.nom} ?
                </h3>
                <p className="text-neutral-600 mt-1">
                  Cette action est irréversible. L'utilisateur sera définitivement supprimé du système.
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4">
              <h4 className="font-medium text-neutral-900 mb-2">Informations de l'utilisateur :</h4>
              <div className="space-y-2 text-sm text-neutral-600">
                <p><strong>Nom :</strong> {utilisateurASupprimer.prenom} {utilisateurASupprimer.nom}</p>
                <p><strong>Email :</strong> {utilisateurASupprimer.email}</p>
                <p><strong>Rôle :</strong> {utilisateurASupprimer.role.charAt(0).toUpperCase() + utilisateurASupprimer.role.slice(1)}</p>
                {utilisateurASupprimer.telephone && (
                  <p><strong>Téléphone :</strong> {utilisateurASupprimer.telephone}</p>
                )}
                {utilisateurASupprimer.adresse && (
                  <p><strong>Adresse :</strong> {utilisateurASupprimer.adresse}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  setModalSuppression(false);
                  setUtilisateurASupprimer(null);
                }}
                className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmerSuppression}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer définitivement
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Utilisateurs;