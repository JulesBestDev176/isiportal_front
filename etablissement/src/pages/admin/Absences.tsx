import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, User, Clock, FileText, Check, X, Upload, Eye,
  Search, Filter, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/ContexteAuth';

interface Absence {
  id: number;
  eleveId: number;
  eleveNom: string;
  elevePrenom: string;
  classeNom: string;
  coursNom: string;
  professeurNom: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  statut: 'non_justifiee' | 'justifiee' | 'en_attente';
  motif?: string;
  documentJustificatif?: string;
  dateJustification?: string;
}

const Absences: React.FC = () => {
  const { utilisateur } = useAuth();
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterClasse, setFilterClasse] = useState('');
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [justificationData, setJustificationData] = useState({
    motif: '',
    document: null as File | null
  });

  // Données de test
  useEffect(() => {
    setAbsences([
      {
        id: 1,
        eleveId: 1,
        eleveNom: 'DIOP',
        elevePrenom: 'Amadou',
        classeNom: 'L3-GL-A',
        coursNom: 'Génie Logiciel',
        professeurNom: 'M. THIAM',
        date: '2024-01-15',
        heureDebut: '08:00',
        heureFin: '10:00',
        statut: 'non_justifiee'
      },
      {
        id: 2,
        eleveId: 2,
        eleveNom: 'FALL',
        elevePrenom: 'Fatou',
        classeNom: 'L2-INFO-B',
        coursNom: 'Bases de Données',
        professeurNom: 'Mme GUEYE',
        date: '2024-01-14',
        heureDebut: '10:00',
        heureFin: '12:00',
        statut: 'justifiee',
        motif: 'Rendez-vous médical',
        documentJustificatif: 'certificat_medical.pdf',
        dateJustification: '2024-01-15'
      },
      {
        id: 3,
        eleveId: 3,
        eleveNom: 'NDIAYE',
        elevePrenom: 'Moussa',
        classeNom: 'L1-INFO-A',
        coursNom: 'Algorithmique',
        professeurNom: 'M. SARR',
        date: '2024-01-13',
        heureDebut: '14:00',
        heureFin: '16:00',
        statut: 'en_attente',
        motif: 'Problème familial',
        dateJustification: '2024-01-14'
      }
    ]);
  }, []);

  const getStatutBadge = (statut: string) => {
    const config = {
      non_justifiee: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-4 h-4" />, label: 'Non justifiée' },
      justifiee: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Justifiée' },
      en_attente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <AlertCircle className="w-4 h-4" />, label: 'En attente' }
    };
    
    const { bg, text, icon, label } = config[statut as keyof typeof config];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${bg} ${text}`}>
        {icon}
        {label}
      </span>
    );
  };

  const handleJustifier = (absence: Absence) => {
    setSelectedAbsence(absence);
    setShowJustificationModal(true);
  };

  const handleSaveJustification = () => {
    if (selectedAbsence) {
      setAbsences(prev => prev.map(abs => 
        abs.id === selectedAbsence.id 
          ? { 
              ...abs, 
              statut: 'justifiee' as const,
              motif: justificationData.motif,
              documentJustificatif: justificationData.document?.name,
              dateJustification: new Date().toISOString().split('T')[0]
            }
          : abs
      ));
      setShowJustificationModal(false);
      setJustificationData({ motif: '', document: null });
    }
  };

  const filteredAbsences = absences.filter(absence => {
    const matchesSearch = !searchTerm || 
      absence.eleveNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.elevePrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.classeNom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = !filterStatut || absence.statut === filterStatut;
    const matchesClasse = !filterClasse || absence.classeNom === filterClasse;
    
    return matchesSearch && matchesStatut && matchesClasse;
  });

  const classes = Array.from(new Set(absences.map(a => a.classeNom)));

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Absences</h1>
        <p className="text-gray-600 mt-1">
          Suivi et justification des absences des élèves
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom d'élève ou classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="non_justifiee">Non justifiées</option>
              <option value="en_attente">En attente</option>
              <option value="justifiee">Justifiées</option>
            </select>
            
            <select
              value={filterClasse}
              onChange={(e) => setFilterClasse(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les classes</option>
              {classes.map(classe => (
                <option key={classe} value={classe}>{classe}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          {filteredAbsences.length} absence(s) trouvée(s)
        </div>
      </div>

      {/* Liste des absences */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date & Heure</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAbsences.map((absence, index) => (
                <motion.tr
                  key={absence.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{absence.elevePrenom} {absence.eleveNom}</p>
                        <p className="text-sm text-gray-600">{absence.classeNom}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{absence.coursNom}</p>
                      <p className="text-sm text-gray-600">{absence.professeurNom}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{new Date(absence.date).toLocaleDateString('fr-FR')}</p>
                        <p className="text-xs text-gray-600">{absence.heureDebut} - {absence.heureFin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getStatutBadge(absence.statut)}
                      {absence.motif && (
                        <p className="text-xs text-gray-600">Motif: {absence.motif}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {absence.statut === 'non_justifiee' && (
                        <button
                          onClick={() => handleJustifier(absence)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Justifier
                        </button>
                      )}
                      {absence.statut === 'en_attente' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setAbsences(prev => prev.map(abs => 
                                abs.id === absence.id ? { ...abs, statut: 'justifiee' as const } : abs
                              ));
                            }}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setAbsences(prev => prev.map(abs => 
                                abs.id === absence.id ? { ...abs, statut: 'non_justifiee' as const } : abs
                              ));
                            }}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {absence.documentJustificatif && (
                        <button className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                          <Eye className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de justification */}
      {showJustificationModal && selectedAbsence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Justifier l'absence</h3>
              <button 
                onClick={() => setShowJustificationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{selectedAbsence.elevePrenom} {selectedAbsence.eleveNom}</strong> - {selectedAbsence.classeNom}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedAbsence.coursNom} - {new Date(selectedAbsence.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de l'absence *
                </label>
                <textarea
                  value={justificationData.motif}
                  onChange={(e) => setJustificationData(prev => ({ ...prev, motif: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Expliquez le motif de l'absence..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document justificatif (optionnel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setJustificationData(prev => ({ 
                      ...prev, 
                      document: e.target.files?.[0] || null 
                    }))}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-700">
                      Cliquez pour télécharger un fichier
                    </span>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                  </label>
                  {justificationData.document && (
                    <p className="text-sm text-green-600 mt-2">
                      Fichier sélectionné: {justificationData.document.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowJustificationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveJustification}
                disabled={!justificationData.motif.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Justifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Absences;