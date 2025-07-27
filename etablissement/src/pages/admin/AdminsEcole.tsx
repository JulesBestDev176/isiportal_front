import React, { useState, useEffect } from 'react';
import { Administrateur, HistoriqueConnexion } from "../../models/utilisateur.model";
import { adminService } from "../../services/adminService";
import { notificationService } from "../../services/notificationService";
import { useAuth } from "../../contexts/ContexteAuth";
import { 
  Users, 
  Shield, 
  Activity, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Eye,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import MainLayout from "../../components/layout/MainLayout";

const AdminsEcole: React.FC = () => {
  const [admins, setAdmins] = useState<Administrateur[]>([]);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const response = await adminService.getUtilisateurs({ page: 1, limit: 100 });
        if (response.success && response.data) {
          const admins = response.data.data.filter(user => user.role === 'administrateur') as Administrateur[];
          setAdmins(admins);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des administrateurs:', error);
      }
    };

    loadAdmins();
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
                <td className="px-2 py-1">
                  {a.historiqueConnexions?.map((c: HistoriqueConnexion) => 
                    `${new Date(c.date).toLocaleDateString()} (${c.ip})`
                  ).join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default AdminsEcole;