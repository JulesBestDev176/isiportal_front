import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Calendar, Clock, Target, 
  TrendingUp, Eye, FileText, PlayCircle, 
  BarChart, Search, Download, MessageSquare,
  User, Award, Bookmark, X
} from "lucide-react";

// Types
interface Cours {
  id: number;
  titre: string;
  description: string;
  matiere: {
    id: number;
    nom: string;
    code: string;
    coefficient: number;
  };
  niveau: {
    id: number;
    nom: string;
    cycle: string;
  };
  professeur?: {
    nom: string;
    prenom: string;
    nom_complet: string;
  };
  statut: string;
  statut_libelle: string;
  heures_par_semaine: number;
  coefficient: number;
  moyenne?: number;
  nombre_notes: number;
  derniere_note?: {
    note: number;
    type_evaluation: string;
    date_evaluation: string;
    appreciation?: string;
  };
}

interface ApiResponse {
  cours: Cours[];
  eleve: {
    id: number;
    nom: string;
    prenom: string;
    nom_complet: string;
    classe: {
      id: number;
      nom: string;
      niveau: {
        id: number;
        nom: string;
      };
    };
  };
  statistiques: {
    total_cours: number;
    moyenne_generale?: number;
    cours_avec_notes: number;
    cours_sans_notes: number;
  };
}











// Composant Carte de Cours Élève avec données de la base
const CarteCoursEleve: React.FC<{
  cours: Cours;
  onVoir: (cours: Cours) => void;
}> = ({ cours, onVoir }) => {
  
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "en_cours": return "bg-blue-100 text-blue-800";
      case "termine": return "bg-green-100 text-green-800";
      case "planifie": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMoyenneColor = (moyenne?: number) => {
    if (!moyenne) return "text-gray-500";
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600";
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">{cours.titre}</h3>
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
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(cours.statut)}`}>
            {cours.statut_libelle}
          </span>
          {cours.moyenne && (
            <div className="text-right">
              <span className="text-xs text-neutral-600">Moyenne</span>
              <p className={`text-lg font-bold ${getMoyenneColor(cours.moyenne)}`}>
                {cours.moyenne}/20
              </p>
            </div>
          )}
        </div>
      </div>

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

      {cours.derniere_note && (
        <div className="mb-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-neutral-900">Dernière note</span>
              <p className="text-xs text-neutral-600">{cours.derniere_note.type_evaluation}</p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${getMoyenneColor(cours.derniere_note.note)}`}>
                {cours.derniere_note.note}/20
              </span>
              <p className="text-xs text-neutral-600">{cours.derniere_note.date_evaluation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onVoir(cours)}
          className="flex-1 py-2 px-3 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Voir détails
        </button>
        <button className="py-2 px-3 text-sm border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
          <MessageSquare className="w-4 h-4" />
        </button>
        <button className="py-2 px-3 text-sm border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Composant Tableau de Bord avec données de la base
const TableauBordRapide: React.FC<{ 
  statistiques: ApiResponse['statistiques'];
  eleve: ApiResponse['eleve'];
}> = ({ statistiques, eleve }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-primary-600">Cours actifs</p>
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
              {statistiques.moyenne_generale?.toFixed(1) || '--'}
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
            <Calendar className="w-6 h-6 text-white" />
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

// Composant principal
const MesCours: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [coursSelectionne, setCoursSelectionne] = useState<Cours | null>(null);
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [filtreMatiere, setFiltreMatiere] = useState("");


  useEffect(() => {
    const fetchCours = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:8000/api/parent-eleve/mes-cours', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCours();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-12"><div className="text-lg">Chargement...</div></div>;
  if (error) return <div className="flex items-center justify-center py-12"><div className="text-red-600">Erreur: {error}</div></div>;
  if (!data) return <div className="flex items-center justify-center py-12"><div>Aucune donnée</div></div>;

  // Filtrage des cours
  const coursFiltres = data.cours.filter(c => {
    const matchTexte = c.titre.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      c.description.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchMatiere = !filtreMatiere || c.matiere.nom === filtreMatiere;
    
    return matchTexte && matchMatiere;
  });

  const handleVoirCours = (cours: Cours) => {
    setCoursSelectionne(cours);
    setShowModalDetails(true);
  };

  const resetFiltres = () => {
    setRechercheTexte("");
    setFiltreMatiere("");
  };

  const matieres = [...new Set(data.cours.map(c => c.matiere.nom))];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mes cours</h1>
          <p className="text-neutral-600 mt-1">
            Bonjour {data.eleve.nom_complet}, voici vos cours assignés
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Contacter prof
          </button>
        </div>
      </div>

      {/* Tableau de bord rapide */}
      <TableauBordRapide statistiques={data.statistiques} eleve={data.eleve} />

      {/* Liste des cours */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        {/* Barre de recherche et filtres */}
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

            {(rechercheTexte || filtreMatiere) && (
              <button
                onClick={resetFiltres}
                className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Grille des cours */}
        {coursFiltres.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coursFiltres.map(cours => (
              <CarteCoursEleve
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
              {rechercheTexte || filtreMatiere ? "Aucun cours trouvé" : "Aucun cours assigné"}
            </h3>
            <p className="text-neutral-600">
              {rechercheTexte || filtreMatiere
                ? "Aucun cours ne correspond à vos critères de recherche."
                : "Vos cours apparaîtront ici une fois qu'ils seront assignés à votre classe."}
            </p>
          </div>
        )}
      </div>

      {/* Modal détails cours */}
      <AnimatePresence>
        {showModalDetails && coursSelectionne && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">{coursSelectionne.titre}</h2>
                    <p className="text-neutral-600 mt-1">
                      {coursSelectionne.matiere.nom} • {coursSelectionne.professeur?.nom_complet || 'Professeur non assigné'}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowModalDetails(false);
                      setCoursSelectionne(null);
                    }}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-600">Coefficient</p>
                    <p className="text-2xl font-bold text-blue-900">{coursSelectionne.coefficient}</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-green-600">Moyenne</p>
                    <p className="text-2xl font-bold text-green-900">
                      {coursSelectionne.moyenne || '--'}/20
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-sm text-orange-600">Notes</p>
                    <p className="text-2xl font-bold text-orange-900">{coursSelectionne.nombre_notes}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Description</h3>
                  <p className="text-neutral-700">{coursSelectionne.description}</p>
                </div>

                {/* Informations du cours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">Matière</h4>
                    <p className="text-neutral-600">{coursSelectionne.matiere.nom}</p>
                    <p className="text-sm text-neutral-500">Code: {coursSelectionne.matiere.code}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">Niveau</h4>
                    <p className="text-neutral-600">{coursSelectionne.niveau.nom}</p>
                    <p className="text-sm text-neutral-500">Cycle: {coursSelectionne.niveau.cycle}</p>
                  </div>
                </div>

                {/* Dernière note */}
                {coursSelectionne.derniere_note && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">Dernière note</h3>
                    <div className="p-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neutral-900">{coursSelectionne.derniere_note.type_evaluation}</h4>
                        <span className="text-lg font-bold text-blue-600">
                          {coursSelectionne.derniere_note.note}/20
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-neutral-600">
                        <span>{coursSelectionne.derniere_note.date_evaluation}</span>
                      </div>
                      {coursSelectionne.derniere_note.appreciation && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                          {coursSelectionne.derniere_note.appreciation}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Informations supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-neutral-900">Heures par semaine:</span>
                    <span className="ml-2 text-neutral-600">{coursSelectionne.heures_par_semaine}h</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-900">Statut:</span>
                    <span className="ml-2 text-neutral-600">{coursSelectionne.statut_libelle}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MesCours;