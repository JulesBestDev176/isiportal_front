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
  CLASSES_LIST,
  TYPES_PARENT
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
  niveaux?: any[];
  classes?: any[];
  loadingClasses?: boolean;
  onNiveauChange?: (niveauId: number, onClasseSelected?: (classeId: number) => void) => void;
}> = ({ typeUtilisateur, onSubmit, onClose, utilisateurs, utilisateurAModifier, modeEdition = false, niveaux = [], classes = [], loadingClasses = false, onNiveauChange }) => {
  const [formData, setFormData] = useState<Partial<FormDataUtilisateur>>(() => {
    if (modeEdition && utilisateurAModifier) {
      console.log('Initialisation du formulaire en mode édition:', utilisateurAModifier);
      
      // Mapper les données snake_case vers camelCase
      const enfantsIds = utilisateurAModifier.enfants_ids || utilisateurAModifier.enfantsIds || [];
      const parentsIds = utilisateurAModifier.parents_ids || utilisateurAModifier.parentsIds || [];
      
      console.log('Enfants IDs mappés:', enfantsIds);
      console.log('Parents IDs mappés:', parentsIds);
      
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
        classeId: typeUtilisateur === 'eleve' ? (utilisateurAModifier.classe_id || utilisateurAModifier.classeId || 0) : undefined,
        dateNaissance: typeUtilisateur === 'eleve' ? (utilisateurAModifier.date_naissance ? new Date(utilisateurAModifier.date_naissance).toISOString().split('T')[0] : "") : "",
        lieuNaissance: typeUtilisateur === 'eleve' ? (utilisateurAModifier.lieu_naissance || utilisateurAModifier.lieuNaissance || "") : "",
        niveauId: typeUtilisateur === 'eleve' ? (utilisateurAModifier.classe?.niveau_id || 0) : undefined,
        parentsIds: typeUtilisateur === 'eleve' ? parentsIds : [],
        enfantsIds: typeUtilisateur === 'parent' ? enfantsIds : [],
        profession: utilisateurAModifier.profession || "",
        type_parent: typeUtilisateur === 'parent' ? (utilisateurAModifier.type_parent || undefined) : undefined
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
      classeId: typeUtilisateur === 'eleve' ? 0 : undefined,
      dateNaissance: typeUtilisateur === 'eleve' ? "" : "",
      lieuNaissance: typeUtilisateur === 'eleve' ? "" : "",
      niveauId: typeUtilisateur === 'eleve' ? 0 : undefined,
      parentsIds: typeUtilisateur === 'eleve' ? [] : [],
      enfantsIds: typeUtilisateur === 'parent' ? [] : [],
      profession: "",
      type_parent: typeUtilisateur === 'parent' ? undefined : undefined
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

  // Charger automatiquement les classes pour un élève en mode modification
  useEffect(() => {
    if (modeEdition && utilisateurAModifier && typeUtilisateur === 'eleve' && formData.niveauId && onNiveauChange) {
      // Charger les classes pour le niveau de l'élève
      onNiveauChange(formData.niveauId, (classeId) => {
        // La classe sera automatiquement sélectionnée par la fonction onNiveauChange
      });
    }
  }, [modeEdition, utilisateurAModifier, typeUtilisateur, formData.niveauId, onNiveauChange]);

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
    if (!formData.role) newErrors.role = "Le rôle est requis";

    if (formData.role === "eleve") {
      if (!formData.classeId) newErrors.classeId = "La classe est requise";
      if (!formData.dateNaissance) {
        newErrors.dateNaissance = "La date de naissance est requise";
      } else {
        // Vérifier que l'élève a au moins 8 ans
        const birthDate = new Date(formData.dateNaissance);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
        if (age < 8) {
          newErrors.dateNaissance = "L'élève doit avoir au moins 8 ans.";
        }
      }
    }

    if (formData.role === "parent") {
      if (!formData.type_parent) newErrors.type_parent = "Le type de parent est requis";
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
      let createdParents: Array<{id: number, enfants_ids?: number[]}> = []; // Type explicite
      
      if (typeUtilisateur === "eleve" && parentMode === "new") {
        // Créer les nouveaux parents via l'API
        for (const parent of newParents) {
          if (parent.nom && parent.prenom && parent.email) {
            try {
              const parentData = {
                nom: parent.nom,
                prenom: parent.prenom,
                email: parent.email,
                telephone: parent.telephone || null,
                adresse: parent.adresse || null,
                profession: parent.profession || null,
                role: "parent",
                actif: true
                // Le mot de passe est généré côté backend
              };
              
              console.log("Création du parent:", parentData);
              const response = await adminService.createUser(parentData);
              
              if (response.success && response.data) {
                createdParents.push(response.data);
                console.log("Parent créé avec succès:", response.data);
              } else {
                console.error("Erreur lors de la création du parent:", response);
                throw new Error(`Erreur lors de la création du parent ${parent.nom} ${parent.prenom}`);
              }
            } catch (error) {
              console.error("Erreur lors de la création du parent:", error);
              throw error;
            }
          }
        }
        
        // Mettre à jour les IDs des parents avec les vrais IDs de la base de données
        parentsIds = createdParents.map(parent => parent.id);
        console.log("IDs des parents créés:", parentsIds);
      }

      // 1. Créer les parents (déjà fait plus haut)
      // 2. Créer l'élève avec les vrais IDs des parents
      let nouvelUtilisateur = {
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

      // 3. Créer l'élève via l'API et récupérer son ID
      let eleveCree = null;
      if (!modeEdition) {
        const response = await adminService.createUser(nouvelUtilisateur);
        if (response.success && response.data) {
          eleveCree = response.data;
          nouvelUtilisateur = eleveCree; // Pour la suite
        } else {
          throw new Error("Erreur lors de la création de l'élève");
        }
      } else {
        // Mode édition : onSubmit classique
        onSubmit(nouvelUtilisateur);
        onClose();
        setLoading(false);
        return;
      }

      // 4. Mettre à jour chaque parent nouvellement créé pour lui associer l'ID de l'enfant
      if (eleveCree && createdParents && createdParents.length > 0) {
        console.log("Mise à jour des parents avec l'ID de l'enfant:", eleveCree.id);
        for (const parent of createdParents) {
          const enfantsIds = Array.isArray(parent.enfants_ids) ? [...parent.enfants_ids, eleveCree.id] : [eleveCree.id];
          console.log(`Mise à jour du parent ${parent.id} avec enfantsIds:`, enfantsIds);
          await adminService.updateUser(parent.id, { enfantsIds });
        }
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
              <div className="space-y-3">
                {/* Sélection du niveau */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Niveau *
              </label>
              <select
                    value={formData.niveauId || ""}
                    onChange={(e) => {
                      const niveauId = parseInt(e.target.value);
                      setFormData({...formData, niveauId, classeId: undefined});
                      if (niveauId && onNiveauChange) {
                        onNiveauChange(niveauId, (classeId) => {
                          setFormData(prev => ({ ...prev, classeId }));
                        });
                      }
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un niveau</option>
                    {niveaux.length > 0 ? niveaux.map((niveau) => (
                      <option key={niveau.id} value={niveau.id}>
                        {niveau.nom}
                  </option>
                    )) : (
                      <option value="" disabled>Chargement des niveaux...</option>
                    )}
              </select>
                    {errors.niveauId && (
                      <p className="text-red-500 text-sm mt-1">{errors.niveauId}</p>
                    )}
                  </div>

                                {/* Classe sélectionnée automatiquement */}
                {formData.niveauId && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Classe assignée *
                    </label>
                    {loadingClasses ? (
                      <div className="w-full px-4 py-3 border border-blue-300 rounded-lg bg-blue-50 text-blue-800">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                          Recherche d'une classe disponible...
                        </div>
                      </div>
                    ) : formData.classeId && formData.classeId > 0 ? (
                      <div className="w-full px-4 py-3 border border-green-300 rounded-lg bg-green-50 text-green-800">
                        <div className="flex items-center justify-between">
                          <span>
                            {classes.find(c => c.id === formData.classeId)?.nom || 'Classe sélectionnée'}
                          </span>
                          <span className="text-sm text-green-600">
                            ✓ Assignation automatique
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-800">
                        <div className="flex items-center justify-between">
                          <span>❌ Aucune classe disponible pour ce niveau</span>
                          <span className="text-sm text-red-600">
                            Toutes les classes sont complètes
                          </span>
                        </div>
                      </div>
                    )}
              {errors.classeId && (
                <p className="text-red-500 text-sm mt-1">{errors.classeId}</p>
              )}
                  </div>
                )}
               </div>
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
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onMouseDown={() => {
                              const parentsIds = formData.parentsIds || [];
                              if (!parentsIds.includes(parent.id) && parentsIds.length < 2) {
                                setFormData({...formData, parentsIds: [...parentsIds, parent.id]});
                              }
                              setParentSearch("");
                              setParentDropdown(false);
                            }}
                          >
                            <div className="font-medium">{parent.prenom} {parent.nom}</div>
                            <div className="text-xs text-gray-500">{parent.email}</div>
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
        // Filtrer les élèves qui n'ont pas encore 2 parents OU qui sont déjà assignés à ce parent
        const eleves = utilisateurs.filter(u => {
          if (u.role !== "eleve") return false;
          
          // Compter le nombre de parents de cet élève
          const nombreParents = u.parents_ids ? u.parents_ids.length : 0;
          
          // Si c'est un mode édition et que l'utilisateur a des enfants assignés
          if (modeEdition && utilisateurAModifier && utilisateurAModifier.enfants_ids) {
            // Inclure les enfants déjà assignés à ce parent
            const enfantsAssignes = utilisateurAModifier.enfants_ids;
            if (enfantsAssignes.includes(u.id)) {
              console.log(`Enfant ${u.id} (${u.prenom} ${u.nom}) inclus car déjà assigné au parent`);
              return true; // Toujours inclure les enfants déjà assignés
            }
          }
          
          // Ne montrer que les élèves qui ont moins de 2 parents
          const shouldInclude = nombreParents < 2;
          if (u.id <= 10) { // Log pour les premiers enfants
            console.log(`Enfant ${u.id} (${u.prenom} ${u.nom}): ${nombreParents}/2 parents, inclus: ${shouldInclude}`);
          }
          return shouldInclude;
        });
        
        console.log(`Nombre total d'enfants disponibles: ${eleves.length}`);
        console.log(`Enfants assignés au parent: ${utilisateurAModifier?.enfants_ids || []}`);
        
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Type de parent *
              </label>
              <select
                value={formData.type_parent || ""}
                onChange={(e) => setFormData({...formData, type_parent: e.target.value as "mere" | "pere" | "tuteur"})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type_parent ? 'border-red-500' : 'border-neutral-300'
                }`}
              >
                <option value="">Sélectionner le type de parent</option>
                {TYPES_PARENT.map((type: { value: string; label: string }) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type_parent && (
                <p className="text-red-500 text-sm mt-1">{errors.type_parent}</p>
              )}
            </div>

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
                Enfants (max 2 par élève) *
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
                ).map(eleve => {
                  const nombreParents = eleve.parents_ids ? eleve.parents_ids.length : 0;
                  const placesDisponibles = 2 - nombreParents;
                  const isChecked = formData.enfantsIds?.includes(eleve.id) || false;
                  
                  // Debug: afficher les informations de débogage pour les premiers enfants
                  if (eleve.id <= 5) {
                    console.log(`Enfant ${eleve.id} (${eleve.prenom} ${eleve.nom}):`, {
                      enfantsIds: formData.enfantsIds,
                      isChecked,
                      nombreParents,
                      placesDisponibles
                    });
                  }
                  
                  return (
                    <label key={eleve.id} className="flex items-center p-2 border rounded hover:bg-neutral-50">
                      <input
                        type="checkbox"
                        checked={isChecked}
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
                      <span>
                        {eleve.prenom} {eleve.nom} 
                        (Classe {eleve.classe?.nom || eleve.classe_id || "Non assignée"}) 
                        - {placesDisponibles} place(s) disponible(s)
                      </span>
                    </label>
                  );
                })}
                {eleves.filter(eleve =>
                  (eleve.prenom + " " + eleve.nom).toLowerCase().includes(enfantSearch.toLowerCase())
                ).length === 0 && (
                  <div className="px-4 py-2 text-gray-400">
                    {enfantSearch ? "Aucun enfant trouvé" : "Tous les élèves ont déjà 2 parents"}
                  </div>
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
    switch (user.role) {
      case "gestionnaire":
        const sectionsLabels = user.sections?.map((sectionId: number) => {
          const sectionMap: { [key: number]: string } = { 1: "Collège", 2: "Lycée" };
          return sectionMap[sectionId] || "N/A";
        }).join(", ") || "N/A";
        return `Sections: ${sectionsLabels}`;
      
      case "professeur":
        const sectionsLabelsProf = user.sections?.map((sectionId: number) => {
          const sectionMap: { [key: number]: string } = { 1: "Collège", 2: "Lycée" };
          return sectionMap[sectionId] || "N/A";
        }).join(", ") || "N/A";
        return `Sections: ${sectionsLabelsProf}`;
      
      case "eleve":
        return `Classe: ${user.classe?.nom || user.classe_id || "Non assignée"}`;
      
      case "parent":
        const typeParentMap: { [key: string]: string } = { 
          "mere": "Mère", 
          "pere": "Père", 
          "tuteur": "Tuteur" 
        };
        const typeParent = typeParentMap[user.type_parent] || "N/A";
        return `Type: ${typeParent}`;
      
      default:
        return "";
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
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
            }}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
                  <p><strong>Classe:</strong> {utilisateurFiche.classe?.nom || utilisateurFiche.classe_id || "Non assignée"}</p>
                  <p><strong>Date de naissance:</strong> {utilisateurFiche.date_naissance ? new Date(utilisateurFiche.date_naissance).toLocaleDateString('fr-FR') : "Non renseignée"}</p>
                  <p><strong>Lieu de naissance:</strong> {utilisateurFiche.lieu_naissance || "Non renseigné"}</p>
                  <p><strong>Numéro étudiant:</strong> {utilisateurFiche.numero_etudiant || "Non assigné"}</p>
                  {utilisateurFiche.parents_ids && utilisateurFiche.parents_ids.length > 0 && (
                    <div>
                      <p><strong>Parents:</strong></p>
                      {utilisateurFiche.parents_ids.map((parentId: number, index: number) => {
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
              ) : utilisateurFiche.role === "parent" ? (
                <div className="text-sm space-y-2">
                  <p><strong>Type de parent:</strong> {
                    utilisateurFiche.type_parent === "mere" ? "Mère" :
                    utilisateurFiche.type_parent === "pere" ? "Père" :
                    utilisateurFiche.type_parent === "tuteur" ? "Tuteur" : "Non renseigné"
                  }</p>
                  {utilisateurFiche.profession && (
                    <p><strong>Profession:</strong> {utilisateurFiche.profession}</p>
                  )}
                  {utilisateurFiche.enfants_ids && utilisateurFiche.enfants_ids.length > 0 ? (
                    <div>
                      <p><strong>Enfants ({utilisateurFiche.enfants_ids.length}):</strong></p>
                      {utilisateurFiche.enfants_ids.map((enfantId: number, index: number) => {
                        const enfant = utilisateurs.find(u => u.id === enfantId);
                        return enfant ? (
                          <div key={enfantId} className="ml-4 p-2 bg-white rounded border">
                            <p className="font-medium">• {enfant.prenom} {enfant.nom}</p>
                            <p className="text-xs text-gray-600">
                              Classe: {enfant.classe?.nom || enfant.classe_id || "Non assignée"}
                            </p>
                            <p className="text-xs text-gray-600">
                              Numéro étudiant: {enfant.numero_etudiant || "Non assigné"}
                            </p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun enfant assigné</p>
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
  const [niveaux, setNiveaux] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

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
    loadNiveaux();
  }, []);

  // Recharger les utilisateurs quand l'onglet change
  useEffect(() => {
    if (utilisateurs.length > 0) {
      // Les utilisateurs sont déjà chargés, pas besoin de recharger
      // Le filtrage se fait côté client
    }
  }, [activeRoleTab]);

  const loadUtilisateurs = async () => {
    console.log('=== DÉBUT loadUtilisateurs ===');
    setLoading(true);
    try {
      console.log('Appel de adminService.getUsers avec params:', { search: searchTerm });
      
      const response = await adminService.getUsers({
        search: searchTerm
        // Ne pas spécifier de limite, le service chargera tous les utilisateurs par défaut
      });
      
      console.log('Réponse API utilisateurs complète:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        // L'API retourne les utilisateurs directement dans response.data
        const usersData = response.data;
        console.log('Type de response.data:', typeof usersData);
        console.log('Est-ce un array?', Array.isArray(usersData));
        console.log('Nombre d\'utilisateurs reçus:', usersData?.length || 0);
        
        if (Array.isArray(usersData)) {
          setUtilisateurs(usersData);
          console.log('Utilisateurs définis avec succès:', usersData.length);
        } else {
          console.warn('Structure de données inattendue:', response.data);
          setUtilisateurs([]);
        }
      } else {
        console.warn('Réponse API sans succès:', response);
        setUtilisateurs([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setUtilisateurs([]);
    } finally {
      setLoading(false);
      console.log('=== FIN loadUtilisateurs ===');
    }
  };

  // Méthode pour charger TOUS les utilisateurs sans limite (pour les cas spéciaux)
  const loadAllUsers = async () => {
    console.log('=== DÉBUT loadAllUsers ===');
    setLoading(true);
    try {
      const response = await adminService.getAllUsers();
      
      console.log('Réponse API tous les utilisateurs:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        const usersData = response.data.data || response.data;
        console.log('Nombre total d\'utilisateurs reçus:', usersData?.length || 0);
        
        if (Array.isArray(usersData)) {
          setUtilisateurs(usersData);
          console.log('Tous les utilisateurs définis avec succès:', usersData.length);
        } else {
          console.warn('Structure de données inattendue pour tous les utilisateurs:', response.data);
          setUtilisateurs([]);
        }
      } else {
        console.warn('Réponse API sans succès pour tous les utilisateurs:', response);
        setUtilisateurs([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de tous les utilisateurs:', error);
      setUtilisateurs([]);
    } finally {
      setLoading(false);
      console.log('=== FIN loadAllUsers ===');
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

  const loadNiveaux = async () => {
    try {
      const response = await adminService.getNiveaux();
      
      if (response.success && response.data && response.data.data) {
        // L'API retourne les niveaux dans response.data.data à cause de la pagination
        setNiveaux(response.data.data);
      } else if (response.success && response.data) {
        // Fallback si pas de pagination
        setNiveaux(response.data);
      } else {
        console.warn('Réponse API sans succès:', response);
        setNiveaux([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
      setNiveaux([]);
    }
  };

  const loadClasses = async (niveauId: number, onClasseSelected?: (classeId: number) => void) => {
    setLoadingClasses(true);
    try {
      const response = await adminService.getClasses({ niveau_id: niveauId });
      console.log('Response API classes:', response);
      
      if (response.success && response.data) {
        // L'API retourne directement les classes dans response.data (sans pagination)
        const classesData = response.data;
        console.log('Classes reçues:', classesData);
        setClasses(classesData);
        
        // Trouver la classe avec le plus de place disponible
        const classesDisponibles = classesData
          .filter((classe: any) => {
            console.log(`Classe ${classe.nom}: effectif_actuel=${classe.effectif_actuel}, effectif_max=${classe.effectif_max}`);
            return classe.effectif_actuel < classe.effectif_max;
          })
          .sort((a: any, b: any) => (b.effectif_max - b.effectif_actuel) - (a.effectif_max - a.effectif_actuel));
        
        console.log('Classes disponibles après filtrage:', classesDisponibles);
        
        if (classesDisponibles.length > 0 && onClasseSelected) {
          // Sélectionner automatiquement la classe avec le plus de place
          const classeOptimale = classesDisponibles[0];
          console.log(`Classe sélectionnée automatiquement: ${classeOptimale.nom} (${classeOptimale.effectif_actuel}/${classeOptimale.effectif_max})`);
          onClasseSelected(classeOptimale.id);
        } else if (classesDisponibles.length === 0) {
          console.warn('Aucune classe disponible pour ce niveau');
          // Réinitialiser la classe sélectionnée
          if (onClasseSelected) onClasseSelected(0);
        }
      } else {
        console.warn('Réponse API invalide:', response);
        setClasses([]);
        if (onClasseSelected) onClasseSelected(0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
      setClasses([]);
      if (onClasseSelected) onClasseSelected(0);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleCreateUtilisateur = async (utilisateur: Omit<Utilisateur, 'id' | 'dateCreation'>) => {
    try {
      const response = await adminService.createUser(utilisateur);
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
      const response = await adminService.updateUser(id, updates);
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
      const response = await adminService.deleteUser(id);
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
      const response = await adminService.updateUser(id, { actif });
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

  const handleSubmitUtilisateur = async (utilisateur: any) => {
    try {
      // Nettoyer les données pour correspondre à l'API Laravel
      const cleanData: any = {
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        telephone: utilisateur.telephone || null,
        adresse: utilisateur.adresse || null,
        actif: utilisateur.actif !== undefined ? utilisateur.actif : true,
        profession: utilisateur.profession || null,
      };

      // Ajouter les champs spécifiques selon le rôle
      if (utilisateur.role === 'gestionnaire') {
        cleanData.sections = utilisateur.sections || [];
      } else if (utilisateur.role === 'professeur') {
        cleanData.sections = utilisateur.sections || [];
        cleanData.matieres = utilisateur.matieres || [];
      } else if (utilisateur.role === 'eleve') {
        cleanData.classeId = utilisateur.classeId || null;
        cleanData.dateNaissance = utilisateur.dateNaissance || null;
        cleanData.lieuNaissance = utilisateur.lieuNaissance || null;
        cleanData.parentsIds = utilisateur.parentsIds || [];
      } else if (utilisateur.role === 'parent') {
        cleanData.type_parent = utilisateur.type_parent || null;
        cleanData.enfantsIds = utilisateur.enfantsIds || [];
      }

      console.log('Données envoyées à l\'API:', cleanData);

      if (modeEdition && utilisateurAModifier) {
        // Mode modification
        const response = await adminService.updateUser(utilisateurAModifier.id, cleanData);
        if (response.success) {
          console.log('Utilisateur modifié avec succès');
        await loadUtilisateurs();
        setModalOpen(false);
          setModeEdition(false);
          setUtilisateurAModifier(null);
        }
      } else {
        // Mode création
        cleanData.password = utilisateur.password || 'password123'; // Mot de passe par défaut
        const response = await adminService.createUser(cleanData);
        if (response.success) {
          console.log('Utilisateur créé avec succès. Email de bienvenue envoyé automatiquement.');
          await loadUtilisateurs();
          setModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
    }
  };

  const confirmerSuppression = async () => {
    if (!utilisateurASupprimer) return;
    
    try {
      const response = await adminService.deleteUser(utilisateurASupprimer.id);
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
    const matchRole = activeRoleTab === "tous" || u.role === activeRoleTab;
    const matchStatut = !filterStatut || (u.actif ? "actif" : "inactif") === filterStatut;
    
    return matchSearch && matchRole && matchStatut;
  });

  // Debug: afficher les informations de débogage
  const rolesDisponibles = Array.from(new Set(utilisateurs.map(u => u.role)));
  const utilisateursParRole = utilisateurs.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('État des utilisateurs:', {
    loading,
    utilisateursCount: utilisateurs.length,
    listeCount: liste.length,
    filteredListeCount: filteredListe.length,
    activeRoleTab,
    searchTerm,
    rolesDisponibles,
    utilisateursParRole
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
        
        {/* Boutons d'action */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadUtilisateurs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <div className={`w-4 h-4 ${loading ? 'animate-spin border-2 border-gray-300 border-t-blue-500 rounded-full' : ''}`}></div>
            Actualiser
          </button>
        
        {/* Bouton d'ajout selon les droits */}
          {currentTab?.canAdd && activeRoleTab !== "tous" && (
          <button
            onClick={() => ouvrirModalAjout(activeRoleTab)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter {activeRoleTab === "eleve" ? "un élève" : 
                    activeRoleTab === "parent" ? "un parent" :
                    activeRoleTab === "professeur" ? "un professeur" :
                      activeRoleTab === "gestionnaire" ? "un gestionnaire" :
                      "un utilisateur"}
          </button>
        )}
        </div>
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
                  {tab.id === "tous" ? utilisateurs.length : utilisateurs.filter(u => u.role === tab.id).length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Chargement des utilisateurs...</span>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total utilisateurs",
            value: utilisateurs.length,
            icon: <Users className="w-5 h-5" />,
            color: "bg-blue-500"
          },
          {
            title: "Gestionnaires",
            value: utilisateurs.filter(u => u.role === "gestionnaire").length,
            icon: <UserCheck className="w-5 h-5" />,
            color: "bg-green-500"
          },
          {
            title: "Professeurs",
            value: utilisateurs.filter(u => u.role === "professeur").length,
            icon: <GraduationCap className="w-5 h-5" />,
            color: "bg-purple-500"
          },
          {
            title: "Élèves",
            value: utilisateurs.filter(u => u.role === "eleve").length,
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
            onSubmit={handleSubmitUtilisateur}
            onClose={() => {
              setModalOpen(false);
              setModeEdition(false);
              setUtilisateurAModifier(null);
            }}
            utilisateurs={liste}
            utilisateurAModifier={utilisateurAModifier}
            modeEdition={modeEdition}
            niveaux={niveaux}
            classes={classes}
            loadingClasses={loadingClasses}
            onNiveauChange={(niveauId, onClasseSelected) => loadClasses(niveauId, onClasseSelected)}
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