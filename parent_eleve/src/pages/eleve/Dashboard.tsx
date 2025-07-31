import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, MessageSquare, Calendar, FileText, CheckCircle, Bell, Users,
  Award, Clock, Target, ArrowUpRight, ArrowDownRight, GraduationCap,
  Eye, Loader2, AlertCircle
} from "lucide-react";

interface DashboardCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
  trend?: number;
  delay?: number;
}

interface Cours {
  id: number;
  titre: string;
  description: string;
  matiere: {
    id: number;
    nom: string;
    code: string;
    coefficient: number;
  };
  professeur?: {
    id: number;
    nom_complet: string;
  };
  moyenne?: number;
  nombre_notes: number;
  heures_par_semaine: number;
}

interface Note {
  id: number;
  note: number;
  coefficient: number;
  type_evaluation: string;
  date_evaluation: string;
  appreciation?: string;
  matiere: {
    nom: string;
    code: string;
  };
  cours: {
    titre: string;
  };
}

interface Notification {
  id: number;
  titre: string;
  contenu: string;
  type: string;
  type_libelle: string;
  priorite: string;
  date_creation: string;
  expediteur?: {
    nom_complet: string;
  };
}

interface ProchainCours {
  id: number;
  titre: string;
  matiere: string;
  professeur: string;
  heure: string;
  salle: string;
}

interface ApiResponse {
  eleve: {
    id: number;
    nom: string;
    prenom: string;
    nom_complet: string;
    classe: {
      id: number;
      nom: string;
      niveau: {
        id: number;
        nom: string;
      };
    };
  };
  statistiques: {
    total_cours: number;
    cours_avec_notes: number;
    moyenne_generale?: number;
    total_notes: number;
    notifications_non_lues: number;
  };
  cours_recents: Cours[];
  notes_recentes: Note[];
  notifications_recentes: Notification[];
  prochains_cours: ProchainCours[];
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    <span className="ml-2 text-neutral-600">Chargement du dashboard...</span>
  </div>
);

const ErrorMessage: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h3 className="text-lg font-medium text-neutral-900 mb-2">Erreur</h3>
    <p className="text-neutral-600 mb-4 text-center">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    >
      Réessayer
    </button>
  </div>
);

const StatCard: React.FC<DashboardCard> = ({ 
  title, 
  value, 
  icon, 
  color, 
  description, 
  trend,
  delay = 0 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          {description && (
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend >= 0 ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  </motion.div>
);

const CoursCard: React.FC<{ cours: Cours; index: number }> = ({ cours, index }) => {
  const getMoyenneColor = (moyenne?: number) => {
    if (!moyenne) return "text-gray-500";
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600";
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-4 border border-neutral-200 rounded-lg hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium text-neutral-900">{cours.titre}</h4>
          <p className="text-sm text-neutral-600">{cours.matiere.nom}</p>
          <p className="text-xs text-neutral-500">{cours.professeur?.nom_complet || 'Non assigné'}</p>
        </div>
        {cours.moyenne && (
          <span className={`font-bold ${getMoyenneColor(cours.moyenne)}`}>
            {cours.moyenne}/20
          </span>
        )}
      </div>
      <div className="flex justify-between text-xs text-neutral-500">
        <span>{cours.nombre_notes} note{cours.nombre_notes > 1 ? 's' : ''}</span>
        <span>{cours.heures_par_semaine}h/sem</span>
      </div>
    </motion.div>
  );
};

const NoteCard: React.FC<{ note: Note; index: number }> = ({ note, index }) => {
  const getNoteColor = (note: number) => {
    if (note >= 16) return "text-green-600";
    if (note >= 12) return "text-blue-600";
    if (note >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-4 border border-neutral-200 rounded-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-medium text-neutral-900">{note.matiere.nom}</p>
          <p className="text-sm text-neutral-600">{note.type_evaluation}</p>
        </div>
        <span className={`font-bold ${getNoteColor(note.note)}`}>
          {note.note}/20
        </span>
      </div>
      <div className="flex justify-between text-xs text-neutral-500">
        <span>Coef. {note.coefficient}</span>
        <span>{note.date_evaluation}</span>
      </div>
    </motion.div>
  );
};

const NotificationCard: React.FC<{ notification: Notification; index: number }> = ({ notification, index }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning": return "text-orange-600 bg-orange-50";
      case "error": return "text-red-600 bg-red-50";
      case "success": return "text-green-600 bg-green-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-4 border border-neutral-200 rounded-lg"
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
          <Bell className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-neutral-900 text-sm">{notification.titre}</h4>
          <p className="text-xs text-neutral-600 mt-1">{notification.contenu}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-neutral-500">
              {notification.expediteur?.nom_complet || 'Système'}
            </span>
            <span className="text-xs text-neutral-500">{notification.date_creation}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/parent-eleve/dashboard', {
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

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;
  if (!data) return <ErrorMessage message="Aucune donnée disponible" onRetry={fetchDashboard} />;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-neutral-900"
          >
            Bienvenue {data.eleve.nom_complet}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-600 mt-1"
          >
            Classe {data.eleve.classe.nom} - {data.eleve.classe.niveau.nom}
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-sm text-neutral-600"
        >
          <Clock className="w-4 h-4 mr-2" />
          <span>Dernière mise à jour : Aujourd'hui</span>
        </motion.div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Cours" 
          value={data.statistiques.total_cours} 
          icon={<BookOpen className="w-6 h-6" />} 
          color="bg-primary-500" 
          description="Assignés" 
          delay={0.1} 
        />
        <StatCard 
          title="Moyenne générale" 
          value={data.statistiques.moyenne_generale?.toFixed(1) || '--'} 
          icon={<Award className="w-6 h-6" />} 
          color="bg-green-500" 
          description="Sur 20" 
          delay={0.2} 
        />
        <StatCard 
          title="Notes" 
          value={data.statistiques.total_notes} 
          icon={<Target className="w-6 h-6" />} 
          color="bg-purple-500" 
          description="Total" 
          delay={0.3} 
        />
        <StatCard 
          title="Messages" 
          value={data.statistiques.notifications_non_lues} 
          icon={<MessageSquare className="w-6 h-6" />} 
          color="bg-orange-500" 
          description="Non lus" 
          delay={0.4} 
        />
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cours récents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg border border-neutral-200"
        >
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Mes cours
            </h2>
          </div>
          <div className="p-6">
            {data.cours_recents.length > 0 ? (
              <div className="space-y-4">
                {data.cours_recents.map((cours, index) => (
                  <CoursCard key={cours.id} cours={cours} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-4">Aucun cours assigné</p>
            )}
          </div>
        </motion.div>

        {/* Notes récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg border border-neutral-200"
        >
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Notes récentes
            </h2>
          </div>
          <div className="p-6">
            {data.notes_recentes.length > 0 ? (
              <div className="space-y-4">
                {data.notes_recentes.map((note, index) => (
                  <NoteCard key={note.id} note={note} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-4">Aucune note récente</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sections supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prochains cours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-lg border border-neutral-200"
        >
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Prochains cours
            </h2>
          </div>
          <div className="p-6">
            {data.prochains_cours.length > 0 ? (
              <div className="space-y-3">
                {data.prochains_cours.map((cours, index) => (
                  <div key={cours.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">{cours.titre}</p>
                      <p className="text-sm text-neutral-600">{cours.professeur}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">{cours.heure}</p>
                      <p className="text-xs text-neutral-500">{cours.salle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-4">Aucun cours programmé</p>
            )}
          </div>
        </motion.div>

        {/* Notifications récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-lg border border-neutral-200"
        >
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications récentes
            </h2>
          </div>
          <div className="p-6">
            {data.notifications_recentes.length > 0 ? (
              <div className="space-y-4">
                {data.notifications_recentes.map((notification, index) => (
                  <NotificationCard key={notification.id} notification={notification} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-4">Aucune notification récente</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;