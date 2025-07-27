import React, { useEffect, useState } from "react";
import { Professeur } from "../../models/utilisateur.model";
import { MATIERES_COURANTES } from "../../models/matiere.model";

const Professeurs: React.FC = () => {
  const [profs, setProfs] = useState<Professeur[]>([]);

  useEffect(() => {
    // Données mock pour le développement
    const professeursMock: Professeur[] = [
      {
        id: 1,
        nom: "Dupont",
        prenom: "Marie",
        email: "marie.dupont@ecole.fr",
        role: "professeur",
        sections: ["college", "lycee"],
        matieres: [1, 7], // Mathématiques, Physique-Chimie
        cours: [1, 2, 3],
        dateCreation: "2023-09-01T00:00:00Z",
        actif: true
      },
      {
        id: 2,
        nom: "Martin",
        prenom: "Pierre",
        email: "pierre.martin@ecole.fr",
        role: "professeur",
        sections: ["lycee"],
        matieres: [2, 13], // Français, Philosophie
        cours: [4, 5],
        dateCreation: "2023-09-01T00:00:00Z",
        actif: true
      }
    ];
    setProfs(professeursMock);
  }, []);

  const getNomMatiere = (matiereId: number): string => {
    // Pour l'instant, on utilise un mapping simple basé sur l'index
    // Dans un vrai projet, il faudrait une correspondance ID -> matière
    const matiereIndex = matiereId - 1;
    if (matiereIndex >= 0 && matiereIndex < MATIERES_COURANTES.length) {
      return MATIERES_COURANTES[matiereIndex].nom;
    }
    return `Matière ${matiereId}`;
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Liste des professeurs</h1>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary-50">
              <th className="px-2 py-1">Nom</th>
              <th className="px-2 py-1">Prénom</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Matières</th>
              <th className="px-2 py-1">Sections</th>
              <th className="px-2 py-1">Cours</th>
              <th className="px-2 py-1">Statut</th>
            </tr>
          </thead>
          <tbody>
            {profs.map(p => (
              <tr key={p.id} className="border-b">
                <td className="px-2 py-1">{p.nom}</td>
                <td className="px-2 py-1">{p.prenom}</td>
                <td className="px-2 py-1">{p.email}</td>
                <td className="px-2 py-1">
                  {p.matieres?.map(matiereId => getNomMatiere(matiereId)).join(", ") || "-"}
                </td>
                <td className="px-2 py-1">
                  {p.sections?.map(s => s === "college" ? "Collège" : "Lycée").join(", ") || "-"}
                </td>
                <td className="px-2 py-1">{p.cours?.length || 0} cours</td>
                <td className="px-2 py-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    p.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {p.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Professeurs;