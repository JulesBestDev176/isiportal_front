import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, BookOpen, Award, TrendingUp, Eye, 
  Clock, Star, X, Loader2, AlertCircle, 
  Calendar, Target, GraduationCap
} from "lucide-react";

interface Note {
  id: number;
  note: number;
  coefficient: number;
  type_evaluation: string;
  date_evaluation: string;
  appreciation?: string;
  matiere: {
    nom: string;
    code: string;
  };
  cours: {
    titre: string;
  };
}

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
  professeur?: {
    id: number;
    nom_complet: string;
  };
  moyenne?: number;
  nombre_notes: number;
  heures_par_semaine: number;
}

interface Enfant {
  id: number;
  nom: string;
  prenom: string;
  nom_complet: string;
  email: string;
  date_naissance?: string;
  classe?: {
    id: number;
    nom: string;
    niveau: {
      id: number;
      nom: string;
    };
  };
  moyenne_generale?: number;
  cours: Cours[];
  notes_recentes: Note[];
  statistiques: {
    total_cours: number;
    cours_avec_notes: number;
    total_notes: number;
    notes_recentes: number;
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
    total_cours: number;
    total_notes: number;
  };
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    <span className="ml-2 text-neutral-600">Chargement des enfants...</span>
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

const EnfantCard: React.FC<{
  enfant: Enfant;
  onVoir: (enfant: Enfant) => void;
}> = ({ enfant, onVoir }) => {
  const getMoyenneColor = (moyenne?: number) => {
    if (!moyenne) return "text-gray-500";
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600";
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  const getAge = (dateNaissance?: string) => {
    if (!dateNaissance) return null;
    const today = new Date();
    const birth = new Date(dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{enfant.nom_complet}</h3>
            <p className="text-sm text-neutral-600">{enfant.classe?.nom || 'Non assigné'}</p>
            <p className="text-xs text-neutral-500">{enfant.classe?.niveau.nom}</p>
            {enfant.date_naissance && (
              <p className="text-xs text-neutral-500">{getAge(enfant.date_naissance)} ans</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          {enfant.moyenne_generale && (
            <div className="mb-2">
              <span className="text-xs text-neutral-600">Moyenne</span>
              <p className={`text-2xl font-bold ${getMoyenneColor(enfant.moyenne_generale)}`}>
                {enfant.moyenne_generale}/20
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-blue-900">{enfant.statistiques.total_cours}</p>
          <p className="text-xs text-blue-600">Cours</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-green-900">{enfant.statistiques.total_notes}</p>
          <p className="text-xs text-green-600">Notes</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-purple-900">{enfant.statistiques.cours_avec_notes}</p>
          <p className="text-xs text-purple-600">Notés</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-orange-900">{enfant.statistiques.notes_recentes}</p>
          <p className="text-xs text-orange-600">Récentes</p>
        </div>
      </div>

      {/* Notes récentes */}
      {enfant.notes_recentes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neutral-900 mb-2">Notes récentes</h4>
          <div className="space-y-2">
            {enfant.notes_recentes.slice(0, 3).map((note) => (
              <div key={note.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{note.matiere.nom}</p>
                  <p className="text-xs text-neutral-600">{note.type_evaluation}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${getMoyenneColor(note.note)}`}>
                    {note.note}/20
                  </span>
                  <p className="text-xs text-neutral-500">{note.date_evaluation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onVoir(enfant)}
        className="w-full py-2 px-3 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
      >
        <Eye className="w-4 h-4" />
        Voir détails
      </button>
    </motion.div>
  );
};

const EnfantModal: React.FC<{
  enfant: Enfant;
  onClose: () => void;
}> = ({ enfant, onClose }) => {
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
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{enfant.nom_complet}</h2>
                <p className="text-neutral-600 mt-1">
                  Classe {enfant.classe?.nom} - {enfant.classe?.niveau.nom}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistiques générales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg text-center">
              <p className="text-sm text-primary-600">Moyenne générale</p>
              <p className={`text-2xl font-bold ${getMoyenneColor(enfant.moyenne_generale || 0)}`}>
                {enfant.moyenne_generale?.toFixed(1) || '--'}/20
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm text-blue-600">Cours</p>
              <p className="text-2xl font-bold text-blue-900">{enfant.statistiques.total_cours}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-sm text-green-600">Notes</p>
              <p className="text-2xl font-bold text-green-900">{enfant.statistiques.total_notes}</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <p className="text-sm text-purple-600">Cours notés</p>
              <p className="text-2xl font-bold text-purple-900">{enfant.statistiques.cours_avec_notes}</p>
            </div>
          </div>

          {/* Cours de l'enfant */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Cours assignés</h3>
            {enfant.cours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enfant.cours.map((cours) => (
                  <div key={cours.id} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-neutral-900">{cours.titre}</h4>
                        <p className="text-sm text-neutral-600">{cours.matiere.nom}</p>
                        <p className="text-xs text-neutral-500">{cours.professeur?.nom_complet || 'Non assigné'}</p>
                      </div>
                      {cours.moyenne && (
                        <span className={`font-bold ${getMoyenneColor(cours.moyenne)}`}>
                          {cours.moyenne}/20
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>{cours.nombre_notes} note{cours.nombre_notes > 1 ? 's' : ''}</span>
                      <span>{cours.heures_par_semaine}h/sem</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-4">Aucun cours assigné</p>
            )}
          </div>

          {/* Notes récentes */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Notes récentes</h3>
            {enfant.notes_recentes.length > 0 ? (
              <div className="space-y-3">
                {enfant.notes_recentes.map((note) => (
                  <div key={note.id} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-neutral-900">{note.matiere.nom}</p>
                        <p className="text-sm text-neutral-600">{note.type_evaluation}</p>
                        <p className="text-xs text-neutral-500">{note.cours.titre}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${getMoyenneColor(note.note)}`}>
                          {note.note}/20
                        </span>
                        <p className="text-xs text-neutral-500">Coef. {note.coefficient}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">{note.date_evaluation}</span>
                      {note.appreciation && (
                        <span className="text-xs text-neutral-600 italic">{note.appreciation}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-4">Aucune note récente</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MesEnfants: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enfantSelectionne, setEnfantSelectionne] = useState<Enfant | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEnfants = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Chargement des données simulées...');
      
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const simulatedData = {
        enfants: [
          {
            id: 1,
            nom: 'Diallo',
            prenom: 'Aicha',
            nom_complet: 'Aicha Diallo',
            email: 'aicha@test.com',
            date_naissance: '2010-05-15',
            classe: {
              id: 1,
              nom: '6ème A',
              niveau: {
                id: 1,
                nom: '6ème',
              },
            },
            moyenne_generale: 14.5,
            cours: [],
            notes_recentes: [
              {
                id: 1,
                note: 16,
                coefficient: 1,
                type_evaluation: 'Contrôle',
                date_evaluation: '25/07/2025',
                appreciation: 'Bon travail',
                matiere: { nom: 'Mathématiques', code: 'MATH' },
                cours: { titre: 'Mathématiques 6ème' }
              },
              {
                id: 2,
                note: 13,
                coefficient: 1,
                type_evaluation: 'Devoir',
                date_evaluation: '23/07/2025',
                appreciation: 'Peut mieux faire',
                matiere: { nom: 'Français', code: 'FR' },
                cours: { titre: 'Français 6ème' }
              }
            ],
            statistiques: {
              total_cours: 8,
              cours_avec_notes: 6,
              total_notes: 15,
              notes_recentes: 2,
            }
          },
          {
            id: 2,
            nom: 'Diallo',
            prenom: 'Omar',
            nom_complet: 'Omar Diallo',
            email: 'omar@test.com',
            date_naissance: '2012-08-22',
            classe: {
              id: 2,
              nom: '4ème B',
              niveau: {
                id: 2,
                nom: '4ème',
              },
            },
            moyenne_generale: 12.8,
            cours: [],
            notes_recentes: [
              {
                id: 3,
                note: 15,
                coefficient: 1,
                type_evaluation: 'Interrogation',
                date_evaluation: '24/07/2025',
                appreciation: 'Très bien',
                matiere: { nom: 'Histoire-Géo', code: 'HG' },
                cours: { titre: 'Histoire-Géographie 4ème' }
              }
            ],
            statistiques: {
              total_cours: 10,
              cours_avec_notes: 8,
              total_notes: 22,
              notes_recentes: 1,
            }
          }
        ],
        parent: {
          id: 1,
          nom: 'Diallo',
          prenom: 'Mamadou',
          nom_complet: 'Mamadou Diallo',
        },
        statistiques: {
          total_enfants: 2,
          total_cours: 18,
          total_notes: 37,
        }
      };
      
      console.log('✅ Données simulées chargées:', simulatedData);
      setData(simulatedData);
    } catch (err: any) {
      console.error('💥 Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnfants();
  }, []);

  const handleVoirEnfant = (enfant: Enfant) => {
    setEnfantSelectionne(enfant);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEnfants} />;
  if (!data) return <ErrorMessage message="Aucune donnée disponible" onRetry={fetchEnfants} />;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mes enfants</h1>
          <p className="text-neutral-600 mt-1">
            Parent: {data.parent.nom_complet}
          </p>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600">Total cours</p>
              <p className="text-2xl font-bold text-green-900">{data.statistiques.total_cours}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Total notes</p>
              <p className="text-2xl font-bold text-blue-900">{data.statistiques.total_notes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des enfants */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Liste de mes enfants ({data.enfants.length})
        </h2>
        {data.enfants.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.enfants.map((enfant) => (
              <EnfantCard
                key={enfant.id}
                enfant={enfant}
                onVoir={handleVoirEnfant}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Aucun enfant trouvé</h3>
            <p className="text-neutral-600">
              Vos enfants apparaîtront ici une fois qu'ils seront liés à votre compte parent.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && enfantSelectionne && (
          <EnfantModal
            enfant={enfantSelectionne}
            onClose={() => {
              setShowModal(false);
              setEnfantSelectionne(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MesEnfants;