import React, { useEffect, useState } from "react";
import { AdminEcole } from "../../models/AdminEcole";
import MainLayout from "../../components/layout/MainLayout";

const AdminsEcole: React.FC = () => {
  const [admins, setAdmins] = useState<AdminEcole[]>([]);

  useEffect(() => {
    fetch("/data/adminEcole.json")
      .then(res => res.json())
      .then(data => setAdmins(data));
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">Liste des administrateurs d'école</h1>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary-50">
              <th className="px-2 py-1">Nom</th>
              <th className="px-2 py-1">Prénom</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Téléphone</th>
              <th className="px-2 py-1">Adresse</th>
              <th className="px-2 py-1">Privilèges</th>
              <th className="px-2 py-1">Connexions récentes</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="border-b">
                <td className="px-2 py-1">{a.nom}</td>
                <td className="px-2 py-1">{a.prenom}</td>
                <td className="px-2 py-1">{a.email}</td>
                <td className="px-2 py-1">{a.telephone || "-"}</td>
                <td className="px-2 py-1">{a.adresse || "-"}</td>
                <td className="px-2 py-1">{a.privileges?.join(", ") || "-"}</td>
                <td className="px-2 py-1">{a.historiqueConnexions?.map(c => `${c.date} (${c.ip})`).join(", ") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default AdminsEcole; 