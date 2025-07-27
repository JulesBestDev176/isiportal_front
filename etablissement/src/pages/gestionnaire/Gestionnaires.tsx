import React, { useEffect, useState } from "react";
import { Gestionnaire } from "../../models/utilisateur.model";

const Gestionnaires: React.FC = () => {
  const [gestionnaires, setGestionnaires] = useState<Gestionnaire[]>([]);

  useEffect(() => {
    fetch("/data/gestionnaires.json")
      .then(res => res.json())
      .then(data => setGestionnaires(data));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Liste des gestionnaires</h1>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary-50">
              <th className="px-2 py-1">Nom</th>
              <th className="px-2 py-1">Prénom</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Sections</th>
            </tr>
          </thead>
          <tbody>
            {gestionnaires.map(g => (
              <tr key={g.id} className="border-b">
                <td className="px-2 py-1">{g.nom}</td>
                <td className="px-2 py-1">{g.prenom}</td>
                <td className="px-2 py-1">{g.email}</td>
                <td className="px-2 py-1">{g.sections?.join(", ") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gestionnaires;