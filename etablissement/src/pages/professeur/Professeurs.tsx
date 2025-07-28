import React, { useState, useEffect } from 'react';
import { Professeur } from '../../models/utilisateur.model';
import { adminService } from '../../services/adminService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  GraduationCap,
  ArrowRight,
  Settings,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  Activity
} from 'lucide-react';

const Professeurs: React.FC = () => {
  const [profs, setProfs] = useState<Professeur[]>([]);

  useEffect(() => {
    loadProfesseurs();
  }, []);

  const loadProfesseurs = async () => {
    try {
      const response = await adminService.getUsers({
        page: 1,
        limit: 100,
        filters: { role: 'professeur' }
      });
      if (response.success && response.data) {
        setProfs(response.data.data as Professeur[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des professeurs:', error);
    }
  };

  const getMatiereNom = (matiereId: number): string => {
    // Dans un vrai projet, il faudrait une correspondance ID -> matière
    const matiereIndex = matiereId - 1;
    if (matiereIndex >= 0 && matiereIndex < 13) {
      const matieres = ["Mathématiques", "Français", "Histoire-Géographie", "Anglais", "Sciences", "EPS", "Physique-Chimie", "SVT", "Musique", "Arts plastiques", "Technologie", "Philosophie", "Espagnol"];
      return matieres[matiereIndex] || `Matière ${matiereId}`;
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
                  {p.matieres?.map(matiereId => getMatiereNom(matiereId)).join(", ") || "-"}
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