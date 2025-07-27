import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, MessageSquare, Calendar, FileText, CheckCircle, Bell, Users,
  Award, Clock, Target, ArrowUpRight, ArrowDownRight, GraduationCap,
  Edit3, Eye, Download
} from "lucide-react";

// Définition des props pour DashboardCard amélioré
interface PropsCarteTableauDeBord {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
  trend?: number;
  delay?: number;
}

const DashboardCard: React.FC<PropsCarteTableauDeBord> = ({ 
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

// Interface pour les activités
interface Activity {
  type: string;
  text: string;
  time: string;
  user?: string;
  status?: "success" | "warning" | "error" | "info";
}

// Composant pour afficher une activité
const ActivityItem: React.FC<{ activity: Activity; index: number }> = ({ activity, index }) => {
  const getActivityIcon = (type: string) => {
    const iconMap = {
      document: <FileText className="w-5 h-5" />,
      grade: <Award className="w-5 h-5" />,
      calendar: <Calendar className="w-5 h-5" />,
      discussion: <MessageSquare className="w-5 h-5" />,
      course: <BookOpen className="w-5 h-5" />,
      homework: <Edit3 className="w-5 h-5" />,
      notification: <Bell className="w-5 h-5" />
    };
    return iconMap[type as keyof typeof iconMap] || <CheckCircle className="w-5 h-5" />;
  };

  const getStatusColor = (status?: string) => {
    const colorMap = {
      success: "bg-green-50 text-green-600",
      warning: "bg-orange-50 text-orange-600", 
      error: "bg-red-50 text-red-600",
      info: "bg-primary-50 text-primary-600"
    };
    return colorMap[status as keyof typeof colorMap] || "bg-primary-50 text-primary-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-start gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900">{activity.text}</p>
        {activity.user && (
          <p className="text-xs text-neutral-500 mt-1">Par {activity.user}</p>
        )}
        <p className="text-xs text-neutral-500 mt-1">Il y a {activity.time}</p>
      </div>
    </motion.div>
  );
};

// Interface pour les actions rapides
interface QuickAction {
  title: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

// Composant pour les actions rapides
const QuickActionCard: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="p-4 bg-white border border-neutral-200 rounded-lg hover:shadow-md transition-all group"
  >
    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-white`}>
      {action.icon}
    </div>
    <p className="text-sm font-medium text-neutral-900">{action.title}</p>
    {action.description && (
      <p className="text-xs text-neutral-500 mt-1">{action.description}</p>
    )}
  </motion.button>
);

// Composant pour les sections supplémentaires
const SectionCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ 
  title, 
  children, 
  icon 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.9 }}
    className="bg-white rounded-lg border border-neutral-200"
  >
    <div className="p-6 border-b border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
        {icon}
        {title}
      </h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

const StudentDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    courses: { value: "12", trend: 0 },
    average: { value: "14.2", trend: 8 },
    homework: { value: "3", trend: -25 },
    messages: { value: "2", trend: 0 }
  };

  const activities: Activity[] = [
    { type: "grade", text: "Nouvelle note en Mathématiques : 16/20", time: "2h", status: "success" },
    { type: "course", text: "Nouveau cours disponible : Les fractions", time: "4h", user: "M. Dubois", status: "info" },
    { type: "homework", text: "Devoir de français à rendre demain", time: "1j", status: "warning" },
    { type: "discussion", text: "Message reçu de Mme Leroy", time: "2j", status: "info" }
  ];

  const quickActions: QuickAction[] = [
    { title: "Mes Cours", icon: <BookOpen className="w-6 h-6" />, color: "bg-primary-500", description: "Matières" },
    { title: "Notes", icon: <Award className="w-6 h-6" />, color: "bg-green-500", description: "Évaluations" },
    { title: "Messagerie", icon: <MessageSquare className="w-6 h-6" />, color: "bg-green-500", description: "Messages" },
    { title: "Calendrier", icon: <Calendar className="w-6 h-6" />, color: "bg-purple-500", description: "Planning" }
  ];

  const nextCourses = [
    { name: "Mathématiques", teacher: "M. Dubois", time: "Demain 8h00", room: "Salle 101" },
    { name: "Français", teacher: "Mme Leroy", time: "Demain 10h00", room: "Salle 205" },
    { name: "Histoire-Géo", teacher: "M. Bernard", time: "Demain 14h00", room: "Salle 301" }
  ];

  const recentGrades = [
    { subject: "Mathématiques", type: "Contrôle", grade: 16, max: 20, date: "20/07/2025" },
    { subject: "Français", type: "Dissertation", grade: 13, max: 20, date: "18/07/2025" },
    { subject: "Histoire-Géo", type: "Exposé", grade: 15, max: 20, date: "16/07/2025" }
  ];

  const classInfo = {
    name: "3ème A",
    teacher: "Mme Martin",
    students: 28,
    room: "Salle 205"
  };

  const reports = [
    {
      period: "2ème Trimestre 2024-2025",
      date: "15/03/2025",
      status: "Disponible",
      average: 15.1,
      rank: "6/28",
      available: true
    },
    {
      period: "3ème Trimestre 2024-2025",
      date: "20/06/2025",
      status: "En cours",
      available: false
    }
  ];

  const getGradeColor = (grade: number, max: number = 20) => {
    const percentage = (grade / max) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-orange-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

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
            Bienvenue Alexandre, Élève
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-600 mt-1"
          >
            Établissement: Collège Victor Hugo
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
        <DashboardCard 
          title="Cours" 
          value={stats.courses.value} 
          icon={<BookOpen className="w-6 h-6" />} 
          color="bg-primary-500" 
          description="Disponibles" 
          trend={stats.courses.trend} 
          delay={0.1} 
        />
        <DashboardCard 
          title="Matières" 
          value="8" 
          icon={<GraduationCap className="w-6 h-6" />} 
          color="bg-green-500" 
          description="Inscrit" 
          trend={5} 
          delay={0.2} 
        />
        <DashboardCard 
          title="Progression" 
          value="65%" 
          icon={<Target className="w-6 h-6" />} 
          color="bg-purple-500" 
          description="Compétences" 
          trend={12} 
          delay={0.3} 
        />
        <DashboardCard 
          title="Messages" 
          value={stats.messages.value} 
          icon={<MessageSquare className="w-6 h-6" />} 
          color="bg-orange-500" 
          description="Non lus" 
          trend={stats.messages.trend} 
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
            {activities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} index={index} />
            ))}
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
        {/* Ma classe */}
        <SectionCard title="Ma classe" icon={<Users className="w-5 h-5 text-neutral-600" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-neutral-600">Classe</p>
                <p className="text-lg font-bold text-primary-600">{classInfo.name}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-neutral-600">Élèves</p>
                <p className="text-lg font-bold text-green-600">{classInfo.students}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Professeur principal:</span> {classInfo.teacher}</p>
              <p><span className="font-medium">Salle:</span> {classInfo.room}</p>
            </div>
          </div>
        </SectionCard>

        {/* Prochains cours */}
        <SectionCard title="Prochains cours" icon={<Calendar className="w-5 h-5 text-neutral-600" />}>
          <div className="space-y-3">
            {nextCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">{course.name}</p>
                  <p className="text-sm text-neutral-600">{course.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">{course.time}</p>
                  <p className="text-xs text-neutral-500">{course.room}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Notes récentes */}
      <SectionCard title="Notes récentes" icon={<Award className="w-5 h-5 text-neutral-600" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentGrades.map((grade, index) => (
            <div key={index} className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-neutral-900">{grade.subject}</p>
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

      {/* Bulletins */}
      <SectionCard title="Mes bulletins" icon={<FileText className="w-5 h-5 text-neutral-600" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => (
            <div key={index} className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-neutral-900">{report.period}</p>
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
  );
};

export default StudentDashboard;