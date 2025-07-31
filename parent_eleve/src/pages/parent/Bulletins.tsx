import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, FileText, TrendingUp, Eye, Download, 
  Clock, Star, X, Loader2, AlertCircle, User, BookOpen
} from "lucide-react";

interface Note {
  id: number;
  note: number;
  coefficient: number;
  type_evaluation: string;
  date_evaluation: string;
  appreciation?: string;
}

interface Matiere {
  id: number;
  nom: string;
  code: string;
  coefficient: number;
  moyenne: number;
  nombre_notes: number;
}

interface Bulletin {
  annee_scolaire: {
    id: number;
    nom: string;
    statut: string;
  };
  semestre: number;
  moyenne_generale?: number;
  mention?: {
    label: string;
    color: string;
  };
  reussi: boolean;
  matieres: Matiere[];
  total_notes: number;
}

interface Enfant {
  id: number;
  nom: string;
  prenom: string;
  nom_complet: string;
  classe?: {
    id: number;
    nom: string;
    niveau: {
      id: number;
      nom: string;
    };
  };
  moyenne_generale?: number;
  bulletins: Bulletin[];
  statistiques: {
    total_bulletins: number;
    bulletins_reussis: number;
    bulletins_echoues: number;
  };
}

interface ApiResponse {
  enfants: Enfant[];
  parent: {
    id: number;
    nom: string;
    prenom: string;
    nom_complet: string;
  };
  statistiques: {
    total_enfants: number;
    total_bulletins: number;
  };
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    <span className="ml-2 text-neutral-600">Chargement des bulletins...</span>
  </div>
);

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

const BulletinCard: React.FC<{
  bulletin: Bulletin;
  enfant: Enfant;
  onVoir: (bulletin: Bulletin, enfant: Enfant) => void;
}> = ({ bulletin, enfant, onVoir }) => {
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
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {bulletin.semestre === 1 ? "1er Semestre" : "2ème Semestre"}
          </h3>
          <p className="text-sm text-neutral-600 mb-2">
            Année scolaire {bulletin.annee_scolaire.nom}
          </p>
          <p className="text-xs text-neutral-500 mb-2">
            Enfant: {enfant.nom_complet}
          </p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              bulletin.reussi ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {bulletin.reussi ? "Réussi" : "Échec"}
            </span>
            {bulletin.mention && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${bulletin.mention.color}-100 text-${bulletin.mention.color}-800`}>
                {bulletin.mention.label}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          {bulletin.moyenne_generale && (
            <div className="mb-2">
              <span className="text-xs text-neutral-600">Moyenne</span>
              <p className={`text-2xl font-bold ${getMoyenneColor(bulletin.moyenne_generale)}`}>
                {bulletin.moyenne_generale}/20
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-neutral-600">Matières:</span>
          <span className="ml-2 font-medium">{bulletin.matieres.length}</span>
        </div>
        <div>
          <span className="text-neutral-600">Notes:</span>
          <span className="ml-2 font-medium">{bulletin.total_notes}</span>
        </div>
      </div>

      <button
        onClick={() => onVoir(bulletin, enfant)}
        className="w-full py-2 px-3 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
      >
        <Eye className="w-4 h-4" />
        Voir détails
      </button>
    </motion.div>
  );
};

const BulletinModal: React.FC<{
  bulletin: Bulletin;
  enfant: Enfant;
  onClose: () => void;
}> = ({ bulletin, enfant, onClose }) => {
  const getMoyenneColor = (moyenne: number) => {
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600";
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Bulletin - {bulletin.semestre === 1 ? "1er Semestre" : "2ème Semestre"}
              </h2>
              <p className="text-neutral-600 mt-1">
                {enfant.nom_complet} - Classe {enfant.classe?.nom} - {bulletin.annee_scolaire.nom}
              </p>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Résumé */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg text-center">
              <p className="text-sm text-primary-600">Moyenne générale</p>
              <p className={`text-2xl font-bold ${getMoyenneColor(bulletin.moyenne_generale || 0)}`}>
                {bulletin.moyenne_generale?.toFixed(1) || '--'}/20
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm text-blue-600">Matières</p>
              <p className="text-2xl font-bold text-blue-900">{bulletin.matieres.length}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-sm text-green-600">Total notes</p>
              <p className="text-2xl font-bold text-green-900">{bulletin.total_notes}</p>
            </div>
          </div>

          {/* Tableau des matières */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-300">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold">Matière</th>
                  <th className="border border-neutral-300 px-3 py-3 text-center font-semibold">Coef.</th>
                  <th className="border border-neutral-300 px-3 py-3 text-center font-semibold">Notes</th>
                  <th className="border border-neutral-300 px-3 py-3 text-center font-semibold">Moyenne</th>
                </tr>
              </thead>
              <tbody>
                {bulletin.matieres.map((matiere, index) => (
                  <tr key={matiere.id} className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                    <td className="border border-neutral-300 px-4 py-3">
                      <div className="font-medium text-neutral-900">{matiere.nom}</div>
                      <div className="text-xs text-neutral-600">{matiere.code}</div>
                    </td>
                    <td className="border border-neutral-300 px-3 py-3 text-center font-medium">
                      {matiere.coefficient}
                    </td>
                    <td className="border border-neutral-300 px-3 py-3 text-center">
                      {matiere.nombre_notes}
                    </td>
                    <td className="border border-neutral-300 px-3 py-3 text-center">
                      <span className={`text-base font-bold ${getMoyenneColor(matiere.moyenne)}`}>
                        {matiere.moyenne.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const EnfantCard: React.FC<{ enfant: Enfant }> = ({ enfant }) => {
  const getMoyenneColor = (moyenne?: number) => {
    if (!moyenne) return "text-gray-500";
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600";
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900">{enfant.nom_complet}</h3>
          <p className="text-sm text-neutral-600">{enfant.classe?.nom || 'Non assigné'}</p>
          <p className="text-xs text-neutral-500">{enfant.classe?.niveau.nom}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-neutral-600">Moyenne</p>
          <p className={`text-lg font-bold ${getMoyenneColor(enfant.moyenne_generale)}`}>
            {enfant.moyenne_generale?.toFixed(1) || '--'}/20
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-neutral-600">Bulletins</p>
          <p className="text-lg font-bold text-blue-600">{enfant.statistiques.total_bulletins}</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-neutral-600">Réussis</p>
          <p className="text-lg font-bold text-purple-600">{enfant.statistiques.bulletins_reussis}</p>
        </div>
      </div>
    </div>
  );
};

const Bulletins: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bulletinSelectionne, setBulletinSelectionne] = useState<{ bulletin: Bulletin; enfant: Enfant } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [enfantFiltre, setEnfantFiltre] = useState<string>("tous");

  const fetchBulletins = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/parent-eleve/mes-enfants-bulletins', {
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

  useEffect(() => {
    fetchBulletins();
  }, []);

  const handleVoirBulletin = (bulletin: Bulletin, enfant: Enfant) => {
    setBulletinSelectionne({ bulletin, enfant });
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBulletins} />;
  if (!data) return <ErrorMessage message="Aucune donnée disponible" onRetry={fetchBulletins} />;

  // Filtrer les bulletins par enfant
  const bulletinsFiltres = data.enfants.flatMap(enfant => 
    enfant.bulletins.map(bulletin => ({ bulletin, enfant }))
  ).filter(item => 
    enfantFiltre === "tous" || item.enfant.id.toString() === enfantFiltre
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Bulletins de mes enfants</h1>
          <p className="text-neutral-600 mt-1">
            Parent: {data.parent.nom_complet}
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-primary-600">Enfants</p>
              <p className="text-2xl font-bold text-primary-900">{data.statistiques.total_enfants}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600">Total bulletins</p>
              <p className="text-2xl font-bold text-green-900">{data.statistiques.total_bulletins}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Bulletins réussis</p>
              <p className="text-2xl font-bold text-blue-900">
                {data.enfants.reduce((acc, enfant) => acc + enfant.statistiques.bulletins_reussis, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes des enfants */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Mes enfants</h2>
        {data.enfants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.enfants.map((enfant) => (
              <EnfantCard key={enfant.id} enfant={enfant} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-4">Aucun enfant trouvé</p>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-neutral-700">Filtrer par enfant:</label>
          <select
            value={enfantFiltre}
            onChange={(e) => setEnfantFiltre(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="tous">Tous les enfants</option>
            {data.enfants.map((enfant) => (
              <option key={enfant.id} value={enfant.id.toString()}>
                {enfant.nom_complet}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des bulletins */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Bulletins ({bulletinsFiltres.length})
        </h2>
        {bulletinsFiltres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bulletinsFiltres.map((item, index) => (
              <BulletinCard
                key={`${item.enfant.id}-${item.bulletin.annee_scolaire.id}-${item.bulletin.semestre}`}
                bulletin={item.bulletin}
                enfant={item.enfant}
                onVoir={handleVoirBulletin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Aucun bulletin disponible</h3>
            <p className="text-neutral-600">
              Les bulletins de vos enfants apparaîtront ici une fois qu'ils seront générés.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && bulletinSelectionne && (
          <BulletinModal
            bulletin={bulletinSelectionne.bulletin}
            enfant={bulletinSelectionne.enfant}
            onClose={() => {
              setShowModal(false);
              setBulletinSelectionne(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bulletins;