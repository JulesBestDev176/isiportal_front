import React from "react";
import { motion } from "framer-motion";
import { apiService } from '../../services/apiService';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  Target, 
  Calendar,
  Award,
  FileText,
  Eye,
  Download,
  Bell,
  Clock,
  User,
  ChevronRight
} from "lucide-react";

// Types pour les données des enfants
interface Child {
  id: number;
  name: string;
  class: string;
  average: number;
  teacher: string;
  photo?: string;
}

interface Activity {
  type: 'grade' | 'homework' | 'message' | 'event';
  title: string;
  description: string;
  time: string;
  child: string;
  icon: React.ReactNode;
  color: string;
}

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

interface Grade {
  subject: string;
  grade: number;
  max: number;
  type: string;
  date: string;
  child: string;
}

interface Report {
  period: string;
  date: string;
  available: boolean;
  status: string;
  average?: number;
  rank?: string;
  child: string;
}

interface NextCourse {
  name: string;
  teacher: string;
  time: string;
  room: string;
  child: string;
}

// Les données des enfants seront chargées depuis l'API

// Les statistiques seront chargées depuis l'API

// Activités récentes pour tous les enfants
const activities: Activity[] = [
  {
    type: 'grade',
    title: 'Nouvelle note en Mathématiques',
    description: 'Julie a obtenu 16/20 au contrôle',
    time: 'Il y a 2h',
    child: 'Julie',
    icon: <Award className="w-4 h-4" />,
    color: 'text-green-600'
  },
  {
    type: 'message',
    title: 'Message du professeur',
    description: 'Réunion parents-professeurs prévue',
    time: 'Il y a 4h',
    child: 'Thomas',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-blue-600'
  },
  {
    type: 'homework',
    title: 'Devoir à rendre',
    description: 'Exercices de français pour demain',
    time: 'Il y a 6h',
    child: 'Julie',
    icon: <BookOpen className="w-4 h-4" />,
    color: 'text-orange-600'
  },
  {
    type: 'event',
    title: 'Sortie scolaire',
    description: 'Visite du musée des sciences',
    time: 'Hier',
    child: 'Thomas',
    icon: <Calendar className="w-4 h-4" />,
    color: 'text-purple-600'
  }
];

// Actions rapides
const quickActions: QuickAction[] = [
  {
    title: 'Bulletins',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-blue-500',
    link: '/bulletins'
  },
  {
    title: 'Messages',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'bg-green-500',
    link: '/messagerie'
  },
  {
    title: 'Calendrier',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-purple-500',
    link: '/calendrier'
  },
  {
    title: 'Enfants',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-orange-500',
    link: '/enfants'
  }
];

// Prochains cours pour tous les enfants
const nextCourses: NextCourse[] = [
  {
    name: 'Mathématiques',
    teacher: 'M. Durand',
    time: '08h00',
    room: 'Salle 201',
    child: 'Julie'
  },
  {
    name: 'Histoire-Géo',
    teacher: 'Mme Martin',
    time: '09h00',
    room: 'Salle 105',
    child: 'Thomas'
  },
  {
    name: 'Français',
    teacher: 'Mme Rousseau',
    time: '10h00',
    room: 'Salle 302',
    child: 'Julie'
  }
];

// Notes récentes pour tous les enfants
const recentGrades: Grade[] = [
  {
    subject: 'Mathématiques',
    grade: 16,
    max: 20,
    type: 'Contrôle',
    date: '15/01/2024',
    child: 'Julie'
  },
  {
    subject: 'Français',
    grade: 14,
    max: 20,
    type: 'Devoir',
    date: '14/01/2024',
    child: 'Thomas'
  },
  {
    subject: 'Sciences',
    grade: 18,
    max: 20,
    type: 'TP',
    date: '13/01/2024',
    child: 'Julie'
  },
  {
    subject: 'Histoire',
    grade: 15,
    max: 20,
    type: 'Interrogation',
    date: '12/01/2024',
    child: 'Thomas'
  }
];

// Bulletins pour tous les enfants
const reports: Report[] = [
  {
    period: 'Trimestre 1',
    date: '20/12/2023',
    available: true,
    status: 'Disponible',
    average: 14.5,
    rank: '8/28',
    child: 'Julie'
  },
  {
    period: 'Trimestre 1',
    date: '20/12/2023',
    available: true,
    status: 'Disponible',
    average: 16.2,
    rank: '3/25',
    child: 'Thomas'
  },
  {
    period: 'Trimestre 2',
    date: 'À venir',
    available: false,
    status: 'En cours',
    child: 'Julie'
  },
  {
    period: 'Trimestre 2',
    date: 'À venir',
    available: false,
    status: 'En cours',
    child: 'Thomas'
  }
];

// Composants
const DashboardCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description: string;
  trend?: number;
  delay: number;
}> = ({ title, value, icon, color, description, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-lg border border-neutral-200 p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-neutral-600">{title}</p>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
    </div>
    {trend !== undefined && (
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-sm text-neutral-500 ml-2">vs mois dernier</span>
      </div>
    )}
  </motion.div>
);

const ActivityItem: React.FC<{ activity: Activity; index: number }> = ({ activity, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="flex items-start gap-4 p-3 hover:bg-neutral-50 rounded-lg transition-colors"
  >
    <div className={`w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center ${activity.color}`}>
      {activity.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
        <span className="text-xs text-neutral-500">{activity.time}</span>
      </div>
      <p className="text-sm text-neutral-600">{activity.description}</p>
      <p className="text-xs text-neutral-500 mt-1">Enfant: {activity.child}</p>
    </div>
  </motion.div>
);

const QuickActionCard: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="flex flex-col items-center gap-2 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
  >
    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white`}>
      {action.icon}
    </div>
    <span className="text-sm font-medium text-neutral-700">{action.title}</span>
  </motion.button>
);

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg border border-neutral-200"
  >
    <div className="p-6 border-b border-neutral-200">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

const getGradeColor = (grade: number, max: number): string => {
  const percentage = (grade / max) * 100;
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-orange-600';
  return 'text-red-600';
};

const ParentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await apiService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const children = dashboardData?.enfants || [];
  const stats = dashboardData?.stats || {};
  const activities = dashboardData?.activities || [];
  const notifications = dashboardData?.notifications || [];

  return (
    <>
      <div className="space-y-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Tableau de bord parent</h1>
            <p className="text-neutral-600">Suivez la scolarité de vos enfants</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              <Bell className="w-4 h-4" />
              Notifications
            </button>
          </div>
        </motion.div>

        {/* Cartes des enfants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {children.map((child: any, index: number) => (
            <div key={child.id} className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{child.prenom} {child.nom}</h3>
                  <p className="text-sm text-neutral-600">{child.classe?.nom || 'Non assigné'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-neutral-600">Moyenne</p>
                  <p className="text-lg font-bold text-green-600">{child.moyenne || 0}/20</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-neutral-600">Niveau</p>
                  <p className="text-sm font-medium text-blue-600">{child.classe?.niveau?.nom || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            title="Enfants" 
            value={stats.children?.value || 0} 
            icon={<Users className="w-6 h-6" />} 
            color="bg-primary-500" 
            description="Scolarisés" 
            trend={stats.children?.trend} 
            delay={0.1} 
          />
          <DashboardCard 
            title="Moyenne générale" 
            value={stats.averageGrade?.value || '--'} 
            icon={<GraduationCap className="w-6 h-6" />} 
            color="bg-green-500" 
            description="Sur 20" 
            trend={stats.averageGrade?.trend} 
            delay={0.2} 
          />
          <DashboardCard 
            title="Messages" 
            value={stats.messages?.value || 0} 
            icon={<MessageSquare className="w-6 h-6" />} 
            color="bg-orange-500" 
            description="Non lus" 
            trend={stats.messages?.trend} 
            delay={0.3} 
          />
          <DashboardCard 
            title="Événements" 
            value={stats.events?.value || 0} 
            icon={<Calendar className="w-6 h-6" />} 
            color="bg-purple-500" 
            description="À venir" 
            trend={stats.events?.trend} 
            delay={0.4} 
          />
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activités récentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-lg border border-neutral-200"
          >
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Activités récentes</h2>
            </div>
            <div className="p-3">
              {activities.length > 0 ? activities.map((activity: any, index: number) => (
                <ActivityItem key={index} activity={activity} index={index} />
              )) : (
                <div className="text-center py-8 text-neutral-500">
                  <p>Aucune activité récente</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Accès rapide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-lg border border-neutral-200"
          >
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Accès rapide</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} action={action} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sections supplémentaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prochains cours */}
          <SectionCard title="Prochains cours" icon={<Calendar className="w-5 h-5 text-neutral-600" />}>
            <div className="space-y-3">
              {nextCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">{course.name}</p>
                    <p className="text-sm text-neutral-600">{course.teacher}</p>
                    <p className="text-xs text-neutral-500">Enfant: {course.child}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">{course.time}</p>
                    <p className="text-xs text-neutral-500">{course.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Notes récentes */}
          <SectionCard title="Notes récentes" icon={<Award className="w-5 h-5 text-neutral-600" />}>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-neutral-900">{grade.subject}</p>
                      <p className="text-xs text-neutral-500">Enfant: {grade.child}</p>
                    </div>
                    <span className={`font-bold ${getGradeColor(grade.grade, grade.max)}`}>
                      {grade.grade}/{grade.max}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{grade.type}</p>
                  <p className="text-xs text-neutral-500">{grade.date}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Bulletins */}
        <SectionCard title="Bulletins des enfants" icon={<FileText className="w-5 h-5 text-neutral-600" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, index) => (
              <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-neutral-900">{report.period}</p>
                    <p className="text-sm text-neutral-600">Enfant: {report.child}</p>
                    <p className="text-sm text-neutral-600">Publié le {report.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    report.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                
                {report.available && (
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Moyenne:</span>
                      <span className="font-medium text-green-600">{report.average}/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Rang:</span>
                      <span className="font-medium text-neutral-900">{report.rank}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {report.available ? (
                    <>
                      <button className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2 px-3 rounded text-sm hover:bg-primary-700">
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 py-2 px-3 rounded text-sm hover:bg-neutral-200">
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </>
                  ) : (
                    <button disabled className="w-full py-2 px-3 bg-neutral-100 text-neutral-500 rounded text-sm cursor-not-allowed">
                      Non disponible
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
};

export default ParentDashboard;