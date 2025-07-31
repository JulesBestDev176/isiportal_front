import React, { useState, useEffect } from 'react';
import { UserX, User, Calendar, BarChart3, AlertCircle, Eye } from 'lucide-react';
import { adminService } from '../services/adminService';
import { noteService } from '../services/noteService';

interface EleveRedoublant {
  id: number;
  nom: string;
  prenom: string;
  classe: {
    id: number;
    nom: string;
    niveau: {
      id: number;
      nom: string;
    };
  };
  moyenneAnnuelle: number;
  anneeScolaire: string;
  dateInscription: string;
  motifRedoublement: string;
}

interface OngletRedoublantsProps {
  classes: any[];
  eleves: any[];
  reglesTransfert: any;
  onTransfererEleve: (eleveId: number, classeDestination: string) => void;
}

const OngletRedoublants: React.FC<OngletRedoublantsProps> = ({
  classes,
  eleves,
  reglesTransfert,
  onTransfererEleve
}) => {
  const [redoublants, setRedoublants] = useState<EleveRedoublant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEleve, setSelectedEleve] = useState<EleveRedoublant | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadRedoublants();
  }, []);

  const loadRedoublants = async () => {
    setLoading(true);
    try {
      // Récupérer tous les élèves avec leurs classes
      const response = await adminService.getUsers();
      if (response.success && response.data) {
        const elevesData = response.data.filter((user: any) => user.role === 'eleve');
        
        const redoublantsData: EleveRedoublant[] = [];
        
        for (const eleve of elevesData) {
          if (eleve.classe_id) {
            // Calculer la moyenne de la dernière année terminée
            const moyenneAnnuelle = await calculerMoyenneEleve(eleve.id);
            
            // Si la moyenne est < 10, c'est un redoublant potentiel
            if (moyenneAnnuelle < 10 && moyenneAnnuelle > 0) {
              const classe = classes.find(c => c.id === eleve.classe_id);
              if (classe) {
                redoublantsData.push({
                  id: eleve.id,
                  nom: eleve.nom,
                  prenom: eleve.prenom,
                  classe: {
                    id: classe.id,
                    nom: classe.nom,
                    niveau: {
                      id: classe.niveau_id,
                      nom: classe.niveauNom || 'Niveau inconnu'
                    }
                  },
                  moyenneAnnuelle,
                  anneeScolaire: '2024-2025',
                  dateInscription: eleve.created_at || new Date().toISOString(),
                  motifRedoublement: moyenneAnnuelle < 10 ? 'Moyenne insuffisante' : 'Autre'
                });
              }
            }
          }
        }
        
        setRedoublants(redoublantsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des redoublants:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculerMoyenneEleve = async (eleveId: number): Promise<number> => {
    try {
      // Récupérer les notes de l'élève pour l'année terminée (2023-2024)
      const notes = await noteService.getNotesEleve(eleveId);
      if (!notes || notes.length === 0) return 0;

      // Filtrer les notes de l'année 2023-2024 (ID = 1)
      const notesAnnee = notes.filter(note => note.annee_scolaire_id === 1);
      if (notesAnnee.length === 0) return 0;

      // Coefficients par type d'évaluation
      const coeffsEvaluation = {
        'devoir1': 1,
        'devoir2': 1,
        'examen': 2
      };

      // Calculer moyennes par semestre
      const notesSemestre1 = notesAnnee.filter(n => n.semestre === 1 && n.note > 0);
      const notesSemestre2 = notesAnnee.filter(n => n.semestre === 2 && n.note > 0);

      let moyS1 = 0;
      if (notesSemestre1.length > 0) {
        let totalPondere = 0;
        let totalCoeff = 0;
        notesSemestre1.forEach(note => {
          const coeff = coeffsEvaluation[note.type_evaluation as keyof typeof coeffsEvaluation] || 1;
          totalPondere += note.note * coeff;
          totalCoeff += coeff;
        });
        moyS1 = totalCoeff > 0 ? totalPondere / totalCoeff : 0;
      }

      let moyS2 = 0;
      if (notesSemestre2.length > 0) {
        let totalPondere = 0;
        let totalCoeff = 0;
        notesSemestre2.forEach(note => {
          const coeff = coeffsEvaluation[note.type_evaluation as keyof typeof coeffsEvaluation] || 1;
          totalPondere += note.note * coeff;
          totalCoeff += coeff;
        });
        moyS2 = totalCoeff > 0 ? totalPondere / totalCoeff : 0;
      }

      // Moyenne annuelle
      let moyenneAnnuelle = 0;
      if (moyS1 > 0 && moyS2 > 0) {
        moyenneAnnuelle = (moyS1 + moyS2) / 2;
      } else if (moyS1 > 0) {
        moyenneAnnuelle = moyS1;
      } else if (moyS2 > 0) {
        moyenneAnnuelle = moyS2;
      }

      return Math.round(moyenneAnnuelle * 100) / 100;
    } catch (error) {
      console.error('Erreur calcul moyenne:', error);
      return 0;
    }
  };

  const getColorByMoyenne = (moyenne: number) => {
    if (moyenne >= 10) return 'text-green-600 bg-green-50';
    if (moyenne >= 8) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Chargement des redoublants...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-800">{redoublants.length}</p>
              <p className="text-sm text-red-600">Redoublants</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-800">
                {redoublants.length > 0 
                  ? (redoublants.reduce((sum, r) => sum + r.moyenneAnnuelle, 0) / redoublants.length).toFixed(2)
                  : '0.00'
                }
              </p>
              <p className="text-sm text-orange-600">Moyenne générale</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-800">
                {redoublants.filter(r => r.moyenneAnnuelle < 8).length}
              </p>
              <p className="text-sm text-blue-600">Moyenne &lt; 8/20</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des redoublants */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UserX className="w-5 h-5 text-red-600" />
            Liste des élèves redoublants
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Élèves ayant une moyenne annuelle inférieure à 10/20
          </p>
        </div>

        {redoublants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe actuelle
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moyenne annuelle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Année scolaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motif
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {redoublants.map((redoublant) => (
                  <tr key={redoublant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {redoublant.prenom} {redoublant.nom}
                          </p>
                          <p className="text-sm text-gray-500">
                            Inscrit le {formatDate(redoublant.dateInscription)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{redoublant.classe.nom}</p>
                        <p className="text-sm text-gray-500">{redoublant.classe.niveau.nom}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getColorByMoyenne(redoublant.moyenneAnnuelle)}`}>
                        {redoublant.moyenneAnnuelle.toFixed(2)}/20
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{redoublant.anneeScolaire}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {redoublant.motifRedoublement}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedEleve(redoublant);
                          setShowDetailsModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun redoublant
            </h3>
            <p className="text-gray-500">
              Tous les élèves ont une moyenne suffisante pour passer au niveau supérieur.
            </p>
          </div>
        )}
      </div>

      {/* Modal détails redoublant */}
      {showDetailsModal && selectedEleve && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Détails du redoublant - {selectedEleve.prenom} {selectedEleve.nom}
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedEleve(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Informations générales</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Nom complet:</span>
                    <p>{selectedEleve.prenom} {selectedEleve.nom}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Classe actuelle:</span>
                    <p>{selectedEleve.classe.nom} ({selectedEleve.classe.niveau.nom})</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Moyenne annuelle:</span>
                    <p className={`font-semibold ${selectedEleve.moyenneAnnuelle < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedEleve.moyenneAnnuelle.toFixed(2)}/20
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Année scolaire:</span>
                    <p>{selectedEleve.anneeScolaire}</p>
                  </div>
                </div>
              </div>

              {/* Motif du redoublement */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Motif du redoublement</h3>
                <p className="text-red-700">{selectedEleve.motifRedoublement}</p>
                <p className="text-sm text-red-600 mt-2">
                  Seuil minimum requis: {reglesTransfert.moyenne_minimale || 10}/20
                </p>
              </div>

              {/* Recommandations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Recommandations</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Suivi pédagogique renforcé</li>
                  <li>• Soutien scolaire dans les matières faibles</li>
                  <li>• Entretien avec les parents</li>
                  <li>• Évaluation des difficultés d'apprentissage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngletRedoublants;