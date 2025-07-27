import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Classe, ClasseAnneeScolaire, ProfMatiere } from '../../models/classe.model';
import { Utilisateur } from '../../models/utilisateur.model';
import { useAuth } from '../../contexts/ContexteAuth';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  GraduationCap,
  ArrowRight,
  Settings,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  UserX,
  Edit3,
  X,
  BookOpen
} from 'lucide-react';

type Professeur = Utilisateur;

// Composant Carte de Classe
const CarteClasse: React.FC<{
  classe: Classe;
  professeurs: Professeur[];
  onEdit: (classe: Classe) => void;
  onDelete: (id: number) => void;
  onView: (classe: Classe) => void;
}> = ({ classe, professeurs, onEdit, onDelete, onView }) => {
  const getProfName = (id: number) => {
    const prof = professeurs.find(p => p.id === id);
    return prof ? `${prof.prenom} ${prof.nom}` : "Non assigné";
  };

  const getClasseAnneeActuelle = (classe: Classe) => {
    return classe.anneesScolaires.find(annee => annee.statut === "active");
  };

  const getEffectifClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.effectif || 0;
  };

  const getEffectifMaxClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.effectifMax || 30;
  };

  const getProfesseurPrincipalClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.professeurPrincipalId;
  };

  const getProfesseurPrincipalNom = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.professeurPrincipalNom;
  };

  const getProfsMatieresClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.profsMatieres || [];
  };

  const professeurPrincipal = professeurs.find(p => p.id === getProfesseurPrincipalClasse(classe));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{classe.nom}</h3>
          <p className="text-sm text-gray-600">{classe.niveauNom}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
          classe.statut === "active" ? "bg-green-100 text-green-800" :
          classe.statut === "inactive" ? "bg-orange-100 text-orange-800" :
          "bg-gray-100 text-gray-800"
        }`}>
            {classe.statut === "active" ? "Active" : classe.statut === "inactive" ? "Inactive" : "Archivée"}
        </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Effectif</span>
          <span className="font-medium text-gray-900">
            {getEffectifClasse(classe)}/{getEffectifMaxClasse(classe)}
          </span>
        </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Professeur principal</span>
          <span className="font-medium text-gray-900">
            {getProfesseurPrincipalNom(classe) || "Non assigné"}
            </span>
          </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Matières enseignées</span>
          <span className="font-medium text-gray-900">
            {getProfsMatieresClasse(classe).length} matières
          </span>
          </div>
      </div>

      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => onView(classe)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Voir
        </button>
        <button
          onClick={() => onEdit(classe)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-orange-600 hover:text-orange-800 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Modifier
        </button>
        <button
          onClick={() => onDelete(classe.id)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </button>
      </div>
    </motion.div>
  );
};

// Composant Formulaire de Classe
const FormulaireClasse: React.FC<{
  classe?: Classe;
  professeurs: Professeur[];
  onSave: (classe: Omit<Classe, "id"> & { id?: number }) => void;
  onCancel: () => void;
}> = ({ classe, professeurs, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: classe?.nom || "",
    niveauId: classe?.niveauId || 0,
    niveauNom: classe?.niveauNom || "",
    description: classe?.description || "",
    statut: classe?.statut || "active" as const,
    anneesScolaires: classe?.anneesScolaires || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validerFormulaire = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de la classe est requis";
    }
    if (!formData.niveauId || formData.niveauId === 0) {
      newErrors.niveauId = "Le niveau est requis";
    }

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
          dateCreation: classe?.dateCreation || new Date().toISOString().split('T')[0],
          dateModification: new Date().toISOString().split('T')[0],
          niveauNom: formData.niveauNom,
          anneesScolaires: formData.anneesScolaires
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
          {classe ? "Modifier la classe" : "Nouvelle classe"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la classe *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.nom ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau *
              </label>
              <select
                value={formData.niveauId}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                niveauId: parseInt(e.target.value) || 0,
                niveauNom: e.target.options[e.target.selectedIndex]?.text || ""
              }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              >
              <option value="">Sélectionner un niveau</option>
              <option value={1}>6ème</option>
              <option value={2}>5ème</option>
              <option value={3}>4ème</option>
              <option value={4}>3ème</option>
              </select>
            {errors.niveauId && <p className="text-red-500 text-xs mt-1">{errors.niveauId}</p>}
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Sauvegarde..." : (classe ? "Modifier" : "Créer")}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant principal
const ClasseGestionnaire: React.FC = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [classeAModifier, setClasseAModifier] = useState<Classe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");

  // Fonctions utilitaires
  const getClasseAnneeActuelle = (classe: Classe) => {
    return classe.anneesScolaires.find(annee => annee.statut === "active");
  };

  const getEffectifClasse = (classe: Classe) => {
    const anneeActuelle = getClasseAnneeActuelle(classe);
    return anneeActuelle?.effectif || 0;
  };

  const handleSaveClasse = (classeData: Omit<Classe, "id"> & { id?: number }) => {
    if (classeData.id) {
      setClasses(prev => prev.map(c => c.id === classeData.id ? { ...classeData, id: classeData.id } as Classe : c));
    } else {
      const nouvelleClasse: Classe = {
        ...classeData,
        id: Date.now(),
        anneesScolaires: []
      };
      setClasses(prev => [...prev, nouvelleClasse]);
    }
    setShowForm(false);
    setClasseAModifier(null);
  };

  const handleEditClasse = (classe: Classe) => {
    setClasseAModifier(classe);
    setShowForm(true);
  };

  const handleDeleteClasse = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ?")) {
      setClasses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleViewClasse = (classe: Classe) => {
    console.log("Voir les détails de la classe:", classe);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setClasseAModifier(null);
  };

  const resetFiltres = () => {
    setSearchTerm("");
    setFilterStatut("all");
  };

  const classesFiltrees = classes.filter(classe => {
    const matchSearch = classe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       classe.niveauNom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === "all" || classe.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const statistiques = {
    total: classes.length,
    actives: classes.filter(c => c.statut === "active").length,
    totalEleves: classes.reduce((total, classe) => total + getEffectifClasse(classe), 0),
    professeursAssignes: new Set(classes.flatMap(c => {
      const anneeActuelle = getClasseAnneeActuelle(c);
      return [
        anneeActuelle?.professeurPrincipalId,
        ...(anneeActuelle?.profsMatieres?.map(pm => pm.professeurId) || [])
      ].filter((id): id is number => id !== undefined && id !== null);
    })).size
  };

  return (
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Classes</h1>
          <p className="text-gray-600">Gérez les classes et leurs affectations</p>
          </div>
          <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle classe
          </button>
        </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total classes</p>
              <p className="text-xl font-bold text-gray-900">{statistiques.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Classes actives</p>
              <p className="text-xl font-bold text-gray-900">{statistiques.actives}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Total élèves</p>
              <p className="text-xl font-bold text-gray-900">{statistiques.totalEleves}</p>
            </div>
          </div>
              </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Professeurs assignés</p>
              <p className="text-xl font-bold text-gray-900">{statistiques.professeursAssignes}</p>
              </div>
          </div>
                      </div>
                    </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                placeholder="Rechercher une classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archivee">Archivée</option>
                          </select>
                            <button
                              onClick={resetFiltres}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
            <Filter className="w-4 h-4" />
                              Réinitialiser
                            </button>
                        </div>
                      </div>

                      {/* Liste des classes */}
                      {classesFiltrees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesFiltrees.map(classe => (
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
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune classe trouvée</h3>
          <p className="text-gray-600">Aucune classe ne correspond à vos critères de recherche.</p>
                        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-4">
                  <FormulaireClasse
              classe={classeAModifier || undefined}
                    professeurs={professeurs}
                    onSave={handleSaveClasse}
                    onCancel={handleCancelForm}
                  />
          </div>
        </div>
      )}
      </div>
  );
};

export default ClasseGestionnaire;