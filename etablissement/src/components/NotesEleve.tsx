import React, { useState, useEffect } from 'react';
import { noteService } from '../services/noteService';
import { ApiNote } from '../models/note.model';

interface NotesEleveProps {
  eleveId: number;
  anneesScolaires: any[];
}

const NotesEleve: React.FC<NotesEleveProps> = ({ eleveId, anneesScolaires }) => {
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [notesParAnnee, setNotesParAnnee] = useState<any[]>([]);
  const [matieresNiveau, setMatieresNiveau] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, [eleveId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Chargement des notes pour l\'élève:', eleveId);
      
      // Récupérer le niveau de l'élève
      const eleve = await noteService.getNiveauEleve(eleveId);
      console.log('Élève récupéré:', eleve);
      
      // Récupérer toutes les matières du niveau de l'élève
      const matieres = await noteService.getMatieresByNiveau(eleve.niveau_id);
      console.log('Matières du niveau récupérées:', matieres);
      setMatieresNiveau(matieres);
      
      // Récupérer les notes de l'élève
      const notesData = await noteService.getNotesEleve(eleveId);
      console.log('Notes reçues:', notesData);
      
      setNotes(notesData);
      
      // Organiser les notes par année scolaire avec toutes les matières du niveau
      const notesOrganisees = noteService.organiserNotesParAnnee(notesData, anneesScolaires, matieres);
      console.log('Notes organisées:', notesOrganisees);
      
      setNotesParAnnee(notesOrganisees);
    } catch (err) {
      console.error('Erreur lors du chargement des notes:', err);
      setError('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const getNoteByType = (notes: any[], type: string) => {
    const note = notes.find((n: any) => n.type_evaluation === type);
    return note ? note.note : 0;
  };

  const getAppreciationByType = (notes: any[], type: string) => {
    const note = notes.find((n: any) => n.type_evaluation === type);
    return note ? note.appreciation : '-';
  };

  const getNoteColor = (note: number | string) => {
    if (typeof note === 'string') return 'text-gray-500';
    const numNote = Number(note);
    if (numNote === 0) return 'text-gray-400'; // Gris clair pour les notes manquantes
    if (numNote >= 16) return 'text-green-600';
    if (numNote >= 12) return 'text-blue-600';
    if (numNote >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des notes...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  if (notesParAnnee.length === 0) {
    console.log('=== DIAGNOSTIC NOTES ===');
    console.log('Notes reçues:', notes);
    console.log('Années scolaires reçues:', anneesScolaires);
    console.log('Notes organisées:', notesParAnnee);
    
    return (
      <div className="text-center py-4 text-gray-500">
        Aucune note disponible pour cet élève.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notesParAnnee.map((annee) => (
        <div key={annee.anneeScolaireId} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {annee.anneeScolaireNom}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              annee.statut === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {annee.statut === 'active' ? 'Active' : 'Terminée'}
            </span>
          </div>

          {annee.semestres.map((semestre: any) => (
            <div key={semestre.semestre} className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">
                Semestre {semestre.semestre}
              </h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        MATIÈRE
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        COEF
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        DEVOIR 1
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        DEVOIR 2
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        EXAMEN
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        MOYENNE
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        APPRÉCIATION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {semestre.notesParMatiere.map((matiere: any) => (
                      <tr key={matiere.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                          {matiere.nom}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">
                          {matiere.coefficient}
                        </td>
                        <td className={`px-4 py-3 text-sm text-center font-medium border-b ${getNoteColor(getNoteByType(matiere.notes, 'devoir1'))}`}>
                          {getNoteByType(matiere.notes, 'devoir1')}
                        </td>
                        <td className={`px-4 py-3 text-sm text-center font-medium border-b ${getNoteColor(getNoteByType(matiere.notes, 'devoir2'))}`}>
                          {getNoteByType(matiere.notes, 'devoir2')}
                        </td>
                        <td className={`px-4 py-3 text-sm text-center font-medium border-b ${getNoteColor(getNoteByType(matiere.notes, 'examen'))}`}>
                          {getNoteByType(matiere.notes, 'examen')}
                        </td>
                        <td className={`px-4 py-3 text-sm text-center font-bold border-b ${getNoteColor(matiere.moyenne)}`}>
                          {matiere.moyenne > 0 ? matiere.moyenne.toFixed(2) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700 border-b">
                          {getAppreciationByType(matiere.notes, 'examen') || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NotesEleve; 