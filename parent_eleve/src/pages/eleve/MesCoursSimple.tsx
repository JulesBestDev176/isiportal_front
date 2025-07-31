import React, { useState, useEffect } from "react";
import { BookOpen, User, Award } from "lucide-react";

interface Cours {
  id: number;
  titre: string;
  description: string;
  matiere: {
    nom: string;
    coefficient: number;
  };
  professeur?: {
    nom_complet: string;
  };
  moyenne?: number;
  nombre_notes: number;
  heures_par_semaine: number;
}

interface ApiResponse {
  cours: Cours[];
  eleve: {
    nom_complet: string;
    classe: {
      nom: string;
    };
  };
  statistiques: {
    total_cours: number;
    moyenne_generale?: number;
  };
}

const MesCoursSimple: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:8000/api/parent-eleve/mes-cours', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCours();
  }, []);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">Erreur: {error}</div>;
  if (!data) return <div className="p-4">Aucune donnée</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes Cours</h1>
        <p className="text-gray-600">
          {data.eleve.nom_complet} - Classe {data.eleve.classe.nom}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Total cours</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{data.statistiques.total_cours}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="font-medium">Moyenne générale</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {data.statistiques.moyenne_generale?.toFixed(1) || '--'}/20
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.cours.map((cours) => (
          <div key={cours.id} className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">{cours.titre}</h3>
            <p className="text-gray-600 text-sm mb-3">{cours.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{cours.matiere.nom}</span>
                <span className="text-gray-500">• Coef. {cours.matiere.coefficient}</span>
              </div>
              
              {cours.professeur && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{cours.professeur.nom_complet}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600">{cours.heures_par_semaine}h/semaine</span>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{cours.nombre_notes} notes</div>
                  {cours.moyenne && (
                    <div className="font-bold text-blue-600">
                      {cours.moyenne}/20
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MesCoursSimple;