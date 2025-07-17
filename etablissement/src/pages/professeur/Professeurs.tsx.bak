import React, { useEffect, useState } from "react";
import { Professeur } from "../../models/Professeur";

const Professeurs: React.FC = () => {
  const [profs, setProfs] = useState<Professeur[]>([]);

  useEffect(() => {
    fetch("/data/professeurs.json")
      .then(res => res.json())
      .then(data => setProfs(data));
  }, []);

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
              <th className="px-2 py-1">Classes</th>
              <th className="px-2 py-1">Téléphone pro</th>
              <th className="px-2 py-1">Email pro</th>
            </tr>
          </thead>
          <tbody>
            {profs.map(p => (
              <tr key={p.id} className="border-b">
                <td className="px-2 py-1">{p.nom}</td>
                <td className="px-2 py-1">{p.prenom}</td>
                <td className="px-2 py-1">{p.email}</td>
                <td className="px-2 py-1">{p.matieres?.join(", ")}</td>
                <td className="px-2 py-1">{p.classesIds?.join(", ")}</td>
                <td className="px-2 py-1">{p.telephonePro || "-"}</td>
                <td className="px-2 py-1">{p.emailPro || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Professeurs; 