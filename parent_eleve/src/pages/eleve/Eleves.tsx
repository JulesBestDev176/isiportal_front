import React, { useEffect, useState } from "react";
import { Eleve } from "../../models/Eleve";

const Eleves: React.FC = () => {
  const [eleves, setEleves] = useState<Eleve[]>([]);

  useEffect(() => {
    fetch("/data/eleves.json")
      .then(res => res.json())
      .then(data => setEleves(data));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Liste des élèves</h1>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary-50">
              <th className="px-2 py-1">Nom</th>
              <th className="px-2 py-1">Prénom</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Date de naissance</th>
              <th className="px-2 py-1">Classe</th>
              <th className="px-2 py-1">Parents</th>
              <th className="px-2 py-1">Notes</th>
              <th className="px-2 py-1">Absences</th>
            </tr>
          </thead>
          <tbody>
            {eleves.map(e => (
              <tr key={e.id} className="border-b">
                <td className="px-2 py-1">{e.nom}</td>
                <td className="px-2 py-1">{e.prenom}</td>
                <td className="px-2 py-1">{e.email}</td>
                <td className="px-2 py-1">{e.dateNaissance}</td>
                <td className="px-2 py-1">{e.classeId}</td>
                <td className="px-2 py-1">{e.parentsIds?.join(", ")}</td>
                <td className="px-2 py-1">{e.notes ? Object.entries(e.notes).map(([matiere, note]) => `${matiere}: ${note}`).join(", ") : "-"}</td>
                <td className="px-2 py-1">{e.absences ? e.absences.length : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Eleves; 