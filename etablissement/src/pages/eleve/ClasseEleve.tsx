import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit, Trash2, Users, BookOpen, 
  GraduationCap, Calendar, Save, X, Eye, ChevronDown,
  UserCheck, Clock, MapPin, AlertCircle, CheckCircle, School
} from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

// Types
interface ProfMatiere {
  matiere: string;
  professeurId: string;
  heuresParSemaine?: number;
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
  anneeScolaire: string;
  effectif: number;
  effectifMax?: number;
  professeurPrincipalId?: string;
  profsMatieres?: ProfMatiere[];
  salle?: string;
  description?: string;
  dateCreation?: string;
  statut?: "active" | "inactive" | "archivee";
}

interface Professeur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  matieres?: string[];
  statut?: "actif" | "inactif";
}

// Constantes
const matieresList = [
  "Mathématiques", "Français", "Histoire-Géographie", "Sciences",
  "Anglais", "Espagnol", "Allemand", "EPS", "Arts plastiques",
  "Musique", "Technologie", "SVT", "Physique-Chimie"
];

const niveauxList = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"];

// Composant Carte de Classe
const CarteClasse: React.FC<{
  classe: Classe;
  professeurs: Professeur[];
  onEdit: (classe: Classe) => void;
  onDelete: (id: string) => void;
  onView: (classe: Classe) => void;
}> = ({ classe, professeurs, onEdit, onDelete, onView }) => {
  const getProfName = (id: string) => {
    const prof = professeurs.find(p => p.id === id);
    return prof ? `${prof.prenom} ${prof.nom}` : "Non assigné";
  };

  const professeurPrincipal = professeurs.find(p => p.id === classe.professeurPrincipalId);
  const tauxRemplissage = classe.effectifMax ? (classe.effectif / classe.effectifMax) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
    >
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{classe.nom}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              {classe.niveau}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {classe.anneeScolaire}
            </span>
            {classe.salle && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {classe.salle}
              </span>
            )}
          </div>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          classe.statut === "active" ? "bg-green-100 text-green-800" :
          classe.statut === "inactive" ? "bg-orange-100 text-orange-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {classe.statut === "active" ? "Active" :
           classe.statut === "inactive" ? "Inactive" : "Archivée"}
        </span>
      </div>

      {/* Informations détaillées */}
      <div className="space-y-3 mb-4">
        {/* Effectif avec indicateur visuel */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Effectif</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{classe.effectif}</span>
            {classe.effectifMax && (
              <span className="text-sm text-gray-500">/ {classe.effectifMax}</span>
            )}
            <div className={`w-3 h-3 rounded-full ${
              tauxRemplissage >= 90 ? "bg-red-500" : 
              tauxRemplissage >= 70 ? "bg-orange-500" : "bg-green-500"
            }`} />
          </div>
        </div>

        {/* Professeur principal */}
        {professeurPrincipal && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Professeur principal</span>
            <span className="text-sm font-medium text-gray-900">
              {professeurPrincipal.prenom} {professeurPrincipal.nom}
            </span>
          </div>
        )}

        {/* Description */}
        {classe.description && (
          <div>
            <p className="text-sm text-gray-600 line-clamp-2">{classe.description}</p>
          </div>
        )}
      </div>

      {/* Matières enseignées */}
      {classe.profsMatieres && classe.profsMatieres.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Matières ({classe.profsMatieres.length})</h4>
          <div className="space-y-1">
            {classe.profsMatieres.slice(0, 3).map((pm, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{pm.matiere}</span>
                <span className="text-gray-800">{getProfName(pm.professeurId)}</span>
              </div>
            ))}
            {classe.profsMatieres.length > 3 && (
              <div className="text-xs text-gray-500">
                +{classe.profsMatieres.length - 3} autres matières
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(classe)}
          className="flex-1 py-2 px-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Voir
        </button>
        <button
          onClick={() => onEdit(classe)}
          className="flex-1 py-2 px-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Modifier
        </button>
        <button
          onClick={() => onDelete(classe.id)}
          className="py-2 px-3 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Composant Formulaire de Classe
const FormulaireClasse: React.FC<{
  classe?: Classe;
  professeurs: Professeur[];
  onSave: (classe: Omit<Classe, "id"> & { id?: string }) => void;
  onCancel: () => void;
}> = ({ classe, professeurs, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: classe?.nom || "",
    niveau: classe?.niveau || "",
    anneeScolaire: classe?.anneeScolaire || "2024-2025",
    effectif: classe?.effectif || 0,
    effectifMax: classe?.effectifMax || 30,
    professeurPrincipalId: classe?.professeurPrincipalId || "",
    salle: classe?.salle || "",
    description: classe?.description || "",
    statut: classe?.statut || "active" as const,
    profsMatieres: classe?.profsMatieres || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const ajouterMatiere = () => {
    setFormData(prev => ({
      ...prev,
      profsMatieres: [...prev.profsMatieres, { matiere: "", professeurId: "", heuresParSemaine: 1 }]
    }));
  };

  const retirerMatiere = (index: number) => {
    setFormData(prev => ({
      ...prev,
      profsMatieres: prev.profsMatieres.filter((_, i) => i !== index)
    }));
  };

  const modifierMatiere = (index: number, field: keyof ProfMatiere, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      profsMatieres: prev.profsMatieres.map((pm, i) => 
        i === index ? { ...pm, [field]: value } : pm
      )
    }));
  };

  const validerFormulaire = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de la classe est requis";
    }
    if (!formData.niveau) {
      newErrors.niveau = "Le niveau est requis";
    }
    if (formData.effectif < 0) {
      newErrors.effectif = "L'effectif ne peut pas être négatif";
    }
    if (formData.effectifMax && formData.effectif > formData.effectifMax) {
      newErrors.effectif = "L'effectif ne peut pas dépasser l'effectif maximum";
    }

    // Validation des matières
    formData.profsMatieres.forEach((pm, index) => {
      if (pm.matiere && !pm.professeurId) {
        newErrors[`matiere_${index}`] = "Veuillez sélectionner un professeur pour cette matière";
      }
      if (pm.professeurId && !pm.matiere) {
        newErrors[`matiere_${index}`] = "Veuillez sélectionner une matière pour ce professeur";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validerFormulaire()) {
      setIsLoading(true);
      try {
        // Simulation d'une requête API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onSave({
          ...formData,
          id: classe?.id,
          dateCreation: classe?.dateCreation || new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {classe ? "Modifier la classe" : "Ajouter une classe"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section informations de base */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la classe *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.nom ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: 6ème A"
                disabled={isLoading}
              />
              {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau *
              </label>
              <select
                value={formData.niveau}
                onChange={(e) => setFormData(prev => ({ ...prev, niveau: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.niveau ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              >
                <option value="">Sélectionner un niveau</option>
                {niveauxList.map(niveau => (
                  <option key={niveau} value={niveau}>{niveau}</option>
                ))}
              </select>
              {errors.niveau && <p className="text-red-500 text-xs mt-1">{errors.niveau}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année scolaire
              </label>
              <input
                type="text"
                value={formData.anneeScolaire}
                onChange={(e) => setFormData(prev => ({ ...prev, anneeScolaire: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="2024-2025"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salle
              </label>
              <input
                type="text"
                value={formData.salle}
                onChange={(e) => setFormData(prev => ({ ...prev, salle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: B12"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effectif actuel
              </label>
              <input
                type="number"
                min="0"
                value={formData.effectif}
                onChange={(e) => setFormData(prev => ({ ...prev, effectif: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.effectif ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.effectif && <p className="text-red-500 text-xs mt-1">{errors.effectif}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effectif maximum
              </label>
              <input
                type="number"
                min="1"
                value={formData.effectifMax}
                onChange={(e) => setFormData(prev => ({ ...prev, effectifMax: parseInt(e.target.value) || 30 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Section professeur principal */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assignation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professeur principal
              </label>
              <select
                value={formData.professeurPrincipalId}
                onChange={(e) => setFormData(prev => ({ ...prev, professeurPrincipalId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              >
                <option value="">Sélectionner un professeur</option>
                {professeurs.filter(p => p.statut === "actif").map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.prenom} {prof.nom}
                    {prof.matieres && prof.matieres.length > 0 && ` (${prof.matieres.join(", ")})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as "active" | "inactive" | "archivee" }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archivee">Archivée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Description optionnelle de la classe..."
            disabled={isLoading}
          />
        </div>

        {/* Section matières */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Matières enseignées ({formData.profsMatieres.length})
            </h3>
            <button
              type="button"
              onClick={ajouterMatiere}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Ajouter une matière
            </button>
          </div>

          {formData.profsMatieres.length > 0 ? (
            <div className="space-y-3">
              {formData.profsMatieres.map((pm, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <select
                      value={pm.matiere}
                      onChange={(e) => modifierMatiere(index, "matiere", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      disabled={isLoading}
                    >
                      <option value="">Matière</option>
                      {matieresList.map(matiere => (
                        <option key={matiere} value={matiere}>{matiere}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <select
                      value={pm.professeurId}
                      onChange={(e) => modifierMatiere(index, "professeurId", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      disabled={isLoading}
                    >
                      <option value="">Professeur</option>
                      {professeurs.filter(p => p.statut === "actif").map(prof => (
                        <option key={prof.id} value={prof.id}>
                          {prof.prenom} {prof.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={pm.heuresParSemaine || 1}
                      onChange={(e) => modifierMatiere(index, "heuresParSemaine", parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="H/sem"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => retirerMatiere(index)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {errors[`matiere_${index}`] && (
                    <div className="md:col-span-5">
                      <p className="text-red-500 text-xs">{errors[`matiere_${index}`]}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Aucune matière ajoutée</p>
              <button
                type="button"
                onClick={ajouterMatiere}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                disabled={isLoading}
              >
                Ajouter la première matière
              </button>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Enregistrement..." : (classe ? "Modifier" : "Ajouter")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant principal
const ClasseEleve: React.FC = () => {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const [ongletActif, setOngletActif] = useState<"liste" | "ajouter">("liste");
  const [classes, setClasses] = useState<Classe[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [classeSelectionnee, setClasseSelectionnee] = useState<Classe | null>(null);
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [filtreNiveau, setFiltreNiveau] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification des autorisations
  useEffect(() => {
    if (utilisateur?.role === "adminEcole") {
      navigate("/dashboard", { replace: true });
    }
  }, [utilisateur, navigate]);

  // Chargement des données
  useEffect(() => {
    const chargerDonnees = async () => {
      setIsLoading(true);
      try {
        const [classesRes, profsRes] = await Promise.all([
          fetch("/data/classes.json"),
          fetch("/data/professeurs.json")
        ]);
        
        const classesData = await classesRes.json();
        const profsData = await profsRes.json();
        
        setClasses(classesData);
        setProfesseurs(profsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    chargerDonnees();
  }, []);

  // Filtrage des classes
  const classesFiltrees = classes.filter(classe => {
    const matchTexte = classe.nom.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      classe.niveau.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchNiveau = !filtreNiveau || classe.niveau === filtreNiveau;
    const matchStatut = !filtreStatut || classe.statut === filtreStatut;
    
    return matchTexte && matchNiveau && matchStatut;
  });

  // Statistiques
  const statistiques = {
    total: classes.length,
    actives: classes.filter(c => c.statut === "active").length,
    totalEleves: classes.reduce((total, classe) => total + classe.effectif, 0),
    professeursAssignes: new Set(classes.flatMap(c => 
      [c.professeurPrincipalId, ...(c.profsMatieres?.map(pm => pm.professeurId) || [])]
    ).filter(Boolean)).size
  };

  const handleSaveClasse = (classeData: Omit<Classe, "id"> & { id?: string }) => {
    if (classeData.id) {
      // Modification
      setClasses(prev => prev.map(c => 
        c.id === classeData.id ? { ...classeData, id: classeData.id } : c
      ));
    } else {
      // Ajout
      const nouvelleClasse: Classe = {
        ...classeData,
        id: `classe_${Date.now()}`
      };
      setClasses(prev => [...prev, nouvelleClasse]);
    }
    
    setClasseSelectionnee(null);
    setOngletActif("liste");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEditClasse = (classe: Classe) => {
    setClasseSelectionnee(classe);
    setOngletActif("ajouter");
  };

  const handleDeleteClasse = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ?")) {
      setClasses(prev => prev.filter(c => c.id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleViewClasse = (classe: Classe) => {
    console.log("Voir détails de la classe:", classe);
    // Ici vous pourriez ouvrir un modal ou naviguer vers une page de détails
  };

  const handleCancelForm = () => {
    setClasseSelectionnee(null);
    setOngletActif("liste");
  };

  const resetFiltres = () => {
    setRechercheTexte("");
    setFiltreNiveau("");
    setFiltreStatut("");
  };

  if (!utilisateur) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des classes</h1>
            <p className="text-gray-600 mt-1">
              Gérez les classes, assignez les professeurs et organisez les matières
            </p>
          </div>
          
          <button
            onClick={() => {
              setOngletActif("ajouter");
              setClasseSelectionnee(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle classe
          </button>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setOngletActif("liste");
                setClasseSelectionnee(null);
              }}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                ongletActif === "liste"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Liste des classes ({classes.length})
              </div>
            </button>
            <button
              onClick={() => {
                setOngletActif("ajouter");
                setClasseSelectionnee(null);
              }}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                ongletActif === "ajouter"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {classeSelectionnee ? "Modifier la classe" : "Ajouter une classe"}
              </div>
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {ongletActif === "liste" && (
                <motion.div
                  key="liste"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des classes...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Barre de recherche et filtres */}
                      <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Rechercher une classe par nom ou niveau..."
                              value={rechercheTexte}
                              onChange={(e) => setRechercheTexte(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <select
                            value={filtreNiveau}
                            onChange={(e) => setFiltreNiveau(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Tous les niveaux</option>
                            {niveauxList.map(niveau => (
                              <option key={niveau} value={niveau}>{niveau}</option>
                            ))}
                          </select>

                          <select
                            value={filtreStatut}
                            onChange={(e) => setFiltreStatut(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Tous les statuts</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archivee">Archivée</option>
                          </select>

                          {(rechercheTexte || filtreNiveau || filtreStatut) && (
                            <button
                              onClick={resetFiltres}
                              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Réinitialiser
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Statistiques rapides */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <School className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-blue-600">Total classes</p>
                              <p className="text-xl font-bold text-blue-900">{statistiques.total}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-green-600">Classes actives</p>
                              <p className="text-xl font-bold text-green-900">{statistiques.actives}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-purple-600">Total élèves</p>
                              <p className="text-xl font-bold text-purple-900">{statistiques.totalEleves}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <UserCheck className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm text-orange-600">Professeurs</p>
                              <p className="text-xl font-bold text-orange-900">{statistiques.professeursAssignes}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Liste des classes */}
                      {classesFiltrees.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                          {classesFiltrees.map((classe) => (
                            <CarteClasse
                              key={classe.id}
                              classe={classe}
                              professeurs={professeurs}
                              onEdit={handleEditClasse}
                              onDelete={handleDeleteClasse}
                              onView={handleViewClasse}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {rechercheTexte || filtreNiveau || filtreStatut 
                              ? "Aucune classe trouvée" 
                              : "Aucune classe créée"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {rechercheTexte || filtreNiveau || filtreStatut
                              ? "Aucune classe ne correspond à vos critères de recherche."
                              : "Commencez par créer votre première classe."}
                          </p>
                          {!rechercheTexte && !filtreNiveau && !filtreStatut && (
                            <button
                              onClick={() => {
                                setOngletActif("ajouter");
                                setClasseSelectionnee(null);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                            >
                              <Plus className="w-4 h-4" />
                              Créer la première classe
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {ongletActif === "ajouter" && (
                <motion.div
                  key="ajouter"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormulaireClasse
                    classe={classeSelectionnee || undefined}
                    professeurs={professeurs}
                    onSave={handleSaveClasse}
                    onCancel={handleCancelForm}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notification de succès */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>
                {classeSelectionnee ? "Classe modifiée" : "Classe ajoutée"} avec succès !
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default ClasseEleve;