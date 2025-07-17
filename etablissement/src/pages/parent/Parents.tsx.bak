import React, { useEffect, useState } from "react";
import { Parent } from "../../models/Parent";

const Parents: React.FC = () => {
  const [parents, setParents] = useState<Parent[]>([]);

  useEffect(() => {
    fetch("/data/parents.json")
      .then(res => res.json())
      .then(data => setParents(data));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Liste des parents</h1>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary-50">
              <th className="px-2 py-1">Nom</th>
              <th className="px-2 py-1">Prénom</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Enfants</th>
              <th className="px-2 py-1">Téléphone secondaire</th>
              <th className="px-2 py-1">Adresse secondaire</th>
            </tr>
          </thead>
          <tbody>
            {parents.map(p => (
              <tr key={p.id} className="border-b">
                <td className="px-2 py-1">{p.nom}</td>
                <td className="px-2 py-1">{p.prenom}</td>
                <td className="px-2 py-1">{p.email}</td>
                <td className="px-2 py-1">{p.enfantsIds?.join(", ")}</td>
                <td className="px-2 py-1">{p.telephoneSecondaire || "-"}</td>
                <td className="px-2 py-1">{p.adresseSecondaire || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Parents; 