import React, { useState } from 'react';
import { User, UserX, ArrowRight } from 'lucide-react';
import { Classe } from '../models/classe.model';
import { EleveClasse } from '../models/eleve.model';
import { ReglesTransfert } from '../models/regles-transfert.model';

interface OngletRedoublantsProps {
  classes: Classe[];
  eleves: EleveClasse[];
  reglesTransfert: ReglesTransfert;
  onTransfererEleve: (eleveId: number, classeDestination: string) => void;
}

const OngletRedoublants: React.FC<OngletRedoublantsProps> = ({ 
  classes, 
  eleves, 
  reglesTransfert, 
  onTransfererEleve 
}) => {
  const [classeSelectionnee, setClasseSelectionnee] = useState<Classe | null>(null);

  // Fonction pour obtenir les redoublants d'une classe
  const getRedoublants = (classe: Classe) => {
    // Les redoublants sont les élèves qui n'ont pas été transférés
    // et qui ne respectent pas les règles de transfert
    return eleves.filter(eleve => {
      // Vérifier si l'élève est dans cette classe
      const estDansClasse = classe.anneesScolaires?.some(annee => 
        annee.elevesIds?.includes(eleve.id)
      );
      
      if (!estDansClasse) return false;
      
      // Un redoublant est un élève qui ne respecte pas les règles de transfert
      return eleve.statut === reglesTransfert.statut_requis && 
             eleve.moyenneAnnuelle < reglesTransfert.moyenne_minimale;
    });
  };

  // Fonction pour obtenir le niveau supérieur
  const getNiveauSuperieur = (niveauNom: string) => {
    const niveaux = {
      "6ème": "5ème",
      "5ème": "4ème", 
      "4ème": "3ème",
      "3ème": "2nde",
      "2nde": "1ère",
      "1ère": "Terminale"
    };
    return niveaux[niveauNom as keyof typeof niveaux] || "Niveau supérieur";
  };

  // Fonction pour transférer un élève individuellement
  const handleTransfererEleve = (eleve: EleveClasse, classe: Classe) => {
    const niveauSuperieur = getNiveauSuperieur(classe.niveauNom);
    const classeDestination = `${niveauSuperieur} ${classe.nom.split(' ')[1] || 'A'}`;
    onTransfererEleve(eleve.id, classeDestination);
  };

  return (
    <div className="space-y-6">
      {/* Sélection de classe */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner une classe pour voir les redoublants
        </label>
        <select
          value={classeSelectionnee?.id || ""}
          onChange={(e) => {
            const classeId = parseInt(e.target.value);
            const classe = classes.find(c => c.id === classeId);
            setClasseSelectionnee(classe || null);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choisir une classe</option>
          {classes.map(classe => (
            <option key={classe.id} value={classe.id}>
              {classe.nom} - {classe.niveauNom}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des redoublants */}
      {classeSelectionnee && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Redoublants de {classeSelectionnee.nom}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Élèves qui ne respectent pas les règles de transfert (moyenne &lt; {reglesTransfert.moyenne_minimale}/20)
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moyenne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getRedoublants(classeSelectionnee).map((eleve) => (
                  <tr key={eleve.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {eleve.prenom} {eleve.nom}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        eleve.moyenneAnnuelle >= reglesTransfert.moyenne_minimale 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {eleve.moyenneAnnuelle}/20
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Redoublant
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTransfererEleve(eleve, classeSelectionnee)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ArrowRight className="w-3 h-3 mr-1" />
                        Transférer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {getRedoublants(classeSelectionnee).length === 0 && (
            <div className="text-center py-8">
              <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun redoublant
              </h3>
              <p className="text-gray-500">
                Tous les élèves de cette classe respectent les règles de transfert.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OngletRedoublants; 