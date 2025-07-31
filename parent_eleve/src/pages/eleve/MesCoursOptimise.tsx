import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Calendar, Clock, Target, 
  TrendingUp, Eye, FileText, User, 
  Award, Search, AlertCircle, Loader2,
  BarChart3, GraduationCap
} from "lucide-react";
import { 
  EleveCoursService, 
  Cours, 
  EleveInfo, 
  StatistiquesGenerales,
  MesCoursResponse 
} from "../../services/eleveCoursService";

// Composant de chargement
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    <span className="ml-2 text-neutral-600">Chargement des cours...</span>
  </div>
);

// Composant d'erreur
const ErrorMessage: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-lg font-medium text-neutral-900 mb-2">Erreur</h3>
    <p className="text-neutral-600 mb-4 text-center">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    >
      Réessayer
    </button>
  </div>
);

// Composant Carte de Cours Optimisée
const CarteCoursOptimisee: React.FC<{
  cours: Cours;
  onVoir: (cours: Cours) => void;
}> = ({ cours, onVoir }) => {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-all duration-300"
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-neutral-900">{cours.titre}</h3>
          </div>
          <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{cours.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-neutral-600">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {cours.matiere.nom}
            </span>
            {cours.professeur && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {cours.professeur.nom_complet}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {cours.heures_par_semaine}h/sem
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${EleveCoursService.getStatutColor(cours.statut)}`}>
            {cours.statut_libelle}
          </span>
          {cours.moyenne !== undefined && (
            <div className="text-right">
              <span className="text-xs text-neutral-600">Moyenne</span>
              <p className={`text-lg font-bold ${EleveCoursService.getMoyenneColor(cours.moyenne)}`}>
                {EleveCoursService.formaterMoyenne(cours.moyenne)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-neutral-600">
            <Award className="w-4 h-4" />
            {cours.nombre_notes} note{cours.nombre_notes > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1 text-neutral-600">
            <Target className="w-4 h-4" />
            Coef. {cours.coefficient}
          </span>
        </div>
      </div>

      {/* Dernière note */}
      {cours.derniere_note && (
        <div className="mb-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-neutral-900">Dernière note</span>
              <p className="text-xs text-neutral-600">{cours.derniere_note.type_evaluation}</p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${EleveCoursService.getMoyenneColor(cours.derniere_note.note)}`}>
                {cours.derniere_note.note}/20
              </span>
              <p className="text-xs text-neutral-600">{cours.derniere_note.date_evaluation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onVoir(cours)}
          className="flex-1 py-2 px-3 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Voir détails
        </button>
      </div>
    </motion.div>
  );
};

// Composant Statistiques Rapides
const StatistiquesRapides: React.FC<{ 
  statistiques: StatistiquesGenerales;
  eleve: EleveInfo;
}> = ({ statistiques, eleve }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-primary-600">Total cours</p>
            <p className="text-2xl font-bold text-primary-900">{statistiques.total_cours}</p>
            <p className="text-xs text-primary-600">Assignés</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-green-600">Moyenne générale</p>
            <p className="text-2xl font-bold text-green-900">
              {statistiques.moyenne_generale ? statistiques.moyenne_generale.toFixed(1) : '--'}
            </p>
            <p className="text-xs text-green-600">Sur 20</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-600">Cours notés</p>
            <p className="text-2xl font-bold text-blue-900">{statistiques.cours_avec_notes}</p>
            <p className="text-xs text-blue-600">Avec notes</p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-purple-600">Classe</p>
            <p className="text-lg font-bold text-purple-900">{eleve.classe.nom}</p>
            <p className="text-xs text-purple-600">{eleve.classe.niveau.nom}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal optimisé
const MesCoursOptimise: React.FC = () => {
  const [donnees, setDonnees] = useState<MesCoursResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [filtreMatiere, setFiltreMatiere] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");

  // Charger les données
  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await EleveCoursService.getMesCours();
      setDonnees(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  // Filtrage des cours
  const coursFiltres = donnees ? EleveCoursService.filtrerCours(donnees.cours, {
    recherche: rechercheTexte,
    matiere: filtreMatiere,
    statut: filtreStatut
  }) : [];

  const matieres = donnees ? EleveCoursService.getMatieres(donnees.cours) : [];
  const statuts = donnees ? EleveCoursService.getStatuts(donnees.cours) : [];

  const resetFiltres = () => {
    setRechercheTexte("");
    setFiltreMatiere("");
    setFiltreStatut("");
  };

  const handleVoirCours = (cours: Cours) => {
    // TODO: Implémenter la modal de détails
    console.log('Voir cours:', cours);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={chargerDonnees} />;
  }

  if (!donnees) {
    return <ErrorMessage message="Aucune donnée disponible" onRetry={chargerDonnees} />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mes cours</h1>
          <p className="text-neutral-600 mt-1">
            Bonjour {donnees.eleve.nom_complet}, voici vos cours assignés
          </p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <StatistiquesRapides 
        statistiques={donnees.statistiques} 
        eleve={donnees.eleve}
      />

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={rechercheTexte}
                onChange={(e) => setRechercheTexte(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filtreMatiere}
              onChange={(e) => setFiltreMatiere(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Toutes les matières</option>
              {matieres.map(matiere => (
                <option key={matiere} value={matiere}>{matiere}</option>
              ))}
            </select>

            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              {statuts.map(statut => (
                <option key={statut.value} value={statut.value}>{statut.label}</option>
              ))}
            </select>

            {(rechercheTexte || filtreMatiere || filtreStatut) && (
              <button
                onClick={resetFiltres}
                className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Liste des cours */}
        {coursFiltres.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coursFiltres.map(cours => (
              <CarteCoursOptimisee
                key={cours.id}
                cours={cours}
                onVoir={handleVoirCours}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {rechercheTexte || filtreMatiere || filtreStatut 
                ? "Aucun cours trouvé" 
                : "Aucun cours assigné"}
            </h3>
            <p className="text-neutral-600">
              {rechercheTexte || filtreMatiere || filtreStatut
                ? "Aucun cours ne correspond à vos critères de recherche."
                : "Vos cours apparaîtront ici une fois qu'ils seront assignés à votre classe."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesCoursOptimise;