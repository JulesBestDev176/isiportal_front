import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, MessageSquare, Calendar, User, FileText, CheckCircle, TrendingUp, Bell, Users,
  Award, Clock, Target, ArrowUpRight, ArrowDownRight, GraduationCap, UserCheck, AlertTriangle
} from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useTenant } from "../../contexts/ContexteTenant";

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
      user: <User className="w-5 h-5" />,
      analytics: <TrendingUp className="w-5 h-5" />,
      notif: <Bell className="w-5 h-5" />,
      notification: <Bell className="w-5 h-5" />,
      class: <BookOpen className="w-5 h-5" />,
      discussion: <MessageSquare className="w-5 h-5" />,
      document: <FileText className="w-5 h-5" />,
      calendar: <Calendar className="w-5 h-5" />,
      grade: <Award className="w-5 h-5" />,
      chat: <MessageSquare className="w-5 h-5" />,
      enrollment: <UserCheck className="w-5 h-5" />,
      absence: <AlertTriangle className="w-5 h-5" />
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
    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
      {action.icon}
    </div>
    <p className="text-sm font-medium text-neutral-900">{action.title}</p>
    {action.description && (
      <p className="text-xs text-neutral-500 mt-1">{action.description}</p>
    )}
  </motion.button>
);

const TableauDeBord: React.FC = () => {
  const { utilisateur } = useAuth();
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Stats et activités selon le rôle
  const getStats = () => {
    switch (utilisateur?.role) {
      case "adminEcole":
        return {
          users: { value: "120", trend: 8 },
          teachers: { value: "24", trend: 12 },
          students: { value: "248", trend: 15 },
          subscription: { value: "Pro", trend: 0 },
          analytics: { value: "98%", trend: 5 },
          notifications: { value: "5", trend: -20 }
        };
      case "gestionnaire":
        return {
          users: { value: "45", trend: 6 },
          classes: { value: "12", trend: 0 },
          students: { value: "248", trend: 10 },
          analytics: { value: "92%", trend: 3 },
          notifications: { value: "3", trend: -15 }
        };
      case "professeur":
        return {
          classes: { value: "6", trend: 0 },
          students: { value: "142", trend: 5 },
          discussions: { value: "14", trend: 25 },
          progression: { value: "80%", trend: 8 },
          notifications: { value: "2", trend: -10 }
        };
      case "eleve":
        return {
          documents: { value: "8", trend: 33 },
          courses: { value: "12", trend: 0 },
          discussions: { value: "5", trend: 15 },
          progression: { value: "65%", trend: 12 },
          notifications: { value: "2", trend: 0 }
        };
      case "parent":
        return {
          enfants: { value: "2", trend: 0 },
          meetings: { value: "1", trend: 0 },
          notifications: { value: "1", trend: -50 },
          alerts: { value: "0", trend: -100 }
        };
      default:
        return {};
    }
  };

  const getActivities = (): Activity[] => {
    switch (utilisateur?.role) {
      case "adminEcole":
        return [
          { type: "enrollment", text: "Nouvelle inscription - Fatou Diallo en CE2", time: "2h", user: "Secrétariat", status: "success" },
          { type: "user", text: "Nouveau professeur ajouté - M. Sow", time: "3h", user: "Direction", status: "success" },
          { type: "analytics", text: "Rapport mensuel généré automatiquement", time: "5h", user: "Système", status: "info" },
          { type: "notification", text: "Notification envoyée à tous les parents", time: "1j", user: "Administration", status: "info" }
        ];
      case "gestionnaire":
        return [
          { type: "class", text: "Emploi du temps CM1-B mis à jour", time: "3h", user: "Planning", status: "success" },
          { type: "user", text: "Compte professeur suspendu temporairement", time: "6h", user: "Gestion", status: "warning" },
          { type: "enrollment", text: "Transfert d'élève validé", time: "1j", user: "Scolarité", status: "success" }
        ];
      case "professeur":
        return [
          { type: "discussion", text: "Nouveau message de Aminata Ba", time: "1h", status: "info" },
          { type: "grade", text: "Notes déposées pour CM1-A - Mathématiques", time: "4h", status: "success" },
          { type: "calendar", text: "Réunion parents-professeurs programmée", time: "1j", status: "info" }
        ];
      case "eleve":
        return [
          { type: "document", text: "Nouveau cours : Les fractions en mathématiques", time: "2h", status: "info" },
          { type: "grade", text: "Note reçue en Sciences : 15/20", time: "5h", status: "success" },
          { type: "calendar", text: "Rappel : Devoir de français à rendre demain", time: "1j", status: "warning" }
        ];
      case "parent":
        return [
          { type: "notification", text: "Invitation réunion parents-professeurs", time: "2j", status: "info" },
          { type: "grade", text: "Nouvelle note pour Aminata - Français: 16/20", time: "3j", status: "success" }
        ];
      default:
        return [];
    }
  };

  const getQuickActions = (): QuickAction[] => {
    const baseActions = [
      { title: "Messagerie", icon: <MessageSquare className="w-6 h-6" />, color: "bg-green-500", description: "Messages" },
      { title: "Calendrier", icon: <Calendar className="w-6 h-6" />, color: "bg-purple-500", description: "Événements" },
      { title: "Profil", icon: <User className="w-6 h-6" />, color: "bg-orange-500", description: "Mon compte" }
    ];

    switch (utilisateur?.role) {
      case "adminEcole":
      case "gestionnaire":
        return [
          { title: "Gestion", icon: <Users className="w-6 h-6" />, color: "bg-primary-500", description: "Utilisateurs" },
          ...baseActions,
          { title: "Rapports", icon: <FileText className="w-6 h-6" />, color: "bg-indigo-500", description: "Analytics" }
        ];
      case "professeur":
        return [
          { title: "Mes Classes", icon: <BookOpen className="w-6 h-6" />, color: "bg-primary-500", description: "Enseignement" },
          { title: "Notes", icon: <Award className="w-6 h-6" />, color: "bg-green-500", description: "Évaluations" },
          ...baseActions
        ];
      case "eleve":
        return [
          { title: "Mes Cours", icon: <BookOpen className="w-6 h-6" />, color: "bg-primary-500", description: "Matières" },
          { title: "Devoirs", icon: <FileText className="w-6 h-6" />, color: "bg-green-500", description: "À rendre" },
          ...baseActions
        ];
      case "parent":
        return [
          { title: "Mes Enfants", icon: <Users className="w-6 h-6" />, color: "bg-primary-500", description: "Suivi" },
          ...baseActions
        ];
      default:
        return baseActions;
    }
  };

  const getWelcome = () => {
    const roleNames = {
      adminEcole: "Administrateur d'École",
      gestionnaire: "Gestionnaire", 
      professeur: "Professeur",
      eleve: "Élève",
      parent: "Parent"
    };

    return `Bienvenue ${utilisateur?.prenom || utilisateur?.email}, ${roleNames[utilisateur?.role as keyof typeof roleNames] || utilisateur?.role}`;
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

  const stats = getStats();
  const activities = getActivities();
  const quickActions = getQuickActions();

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
            {getWelcome()}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-600 mt-1"
          >
            Établissement: {tenant?.nom || tenant?.idEcole || tenant?.sousDomaine}
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
        {utilisateur?.role === "adminEcole" && (
          <>
            <DashboardCard title="Élèves" value={stats.students?.value || ""} icon={<Users className="w-6 h-6" />} color="bg-primary-500" description="Total inscrits" trend={stats.students?.trend} delay={0.1} />
            <DashboardCard title="Professeurs" value={stats.teachers?.value || ""} icon={<GraduationCap className="w-6 h-6" />} color="bg-green-500" description="Équipe pédagogique" trend={stats.teachers?.trend} delay={0.2} />
            <DashboardCard title="Activité" value={stats.analytics?.value || ""} icon={<TrendingUp className="w-6 h-6" />} color="bg-purple-500" description="Taux global" trend={stats.analytics?.trend} delay={0.3} />
            <DashboardCard title="Notifications" value={stats.notifications?.value || ""} icon={<Bell className="w-6 h-6" />} color="bg-orange-500" description="Non lues" trend={stats.notifications?.trend} delay={0.4} />
          </>
        )}
        
        {utilisateur?.role === "gestionnaire" && (
          <>
            <DashboardCard title="Élèves" value={stats.students?.value || ""} icon={<Users className="w-6 h-6" />} color="bg-primary-500" description="Sous gestion" trend={stats.students?.trend} delay={0.1} />
            <DashboardCard title="Classes" value={stats.classes?.value || ""} icon={<BookOpen className="w-6 h-6" />} color="bg-green-500" description="Gérées" trend={stats.classes?.trend} delay={0.2} />
            <DashboardCard title="Activité" value={stats.analytics?.value || ""} icon={<TrendingUp className="w-6 h-6" />} color="bg-purple-500" description="Taux global" trend={stats.analytics?.trend} delay={0.3} />
            <DashboardCard title="Notifications" value={stats.notifications?.value || ""} icon={<Bell className="w-6 h-6" />} color="bg-orange-500" description="Non lues" trend={stats.notifications?.trend} delay={0.4} />
          </>
        )}

        {utilisateur?.role === "professeur" && (
          <>
            <DashboardCard title="Mes Classes" value={stats.classes?.value || ""} icon={<BookOpen className="w-6 h-6" />} color="bg-primary-500" description="Enseignées" trend={stats.classes?.trend} delay={0.1} />
            <DashboardCard title="Élèves" value={stats.students?.value || ""} icon={<Users className="w-6 h-6" />} color="bg-green-500" description="Total élèves" trend={stats.students?.trend} delay={0.2} />
            <DashboardCard title="Progression" value={stats.progression?.value || ""} icon={<Target className="w-6 h-6" />} color="bg-purple-500" description="Objectifs" trend={stats.progression?.trend} delay={0.3} />
            <DashboardCard title="Messages" value={stats.notifications?.value || ""} icon={<MessageSquare className="w-6 h-6" />} color="bg-orange-500" description="Non lus" trend={stats.notifications?.trend} delay={0.4} />
          </>
        )}

        {utilisateur?.role === "eleve" && (
          <>
            <DashboardCard title="Cours" value={stats.documents?.value || ""} icon={<BookOpen className="w-6 h-6" />} color="bg-primary-500" description="Disponibles" trend={stats.documents?.trend} delay={0.1} />
            <DashboardCard title="Matières" value={stats.courses?.value || ""} icon={<GraduationCap className="w-6 h-6" />} color="bg-green-500" description="Inscrit" trend={stats.courses?.trend} delay={0.2} />
            <DashboardCard title="Progression" value={stats.progression?.value || ""} icon={<Target className="w-6 h-6" />} color="bg-purple-500" description="Compétences" trend={stats.progression?.trend} delay={0.3} />
            <DashboardCard title="Messages" value={stats.notifications?.value || ""} icon={<MessageSquare className="w-6 h-6" />} color="bg-orange-500" description="Non lus" trend={stats.notifications?.trend} delay={0.4} />
          </>
        )}

        {utilisateur?.role === "parent" && (
          <>
            <DashboardCard title="Enfants" value={stats.enfants?.value || ""} icon={<Users className="w-6 h-6" />} color="bg-primary-500" description="Suivis" trend={stats.enfants?.trend} delay={0.1} />
            <DashboardCard title="RDV" value={stats.meetings?.value || ""} icon={<Calendar className="w-6 h-6" />} color="bg-green-500" description="Programmés" trend={stats.meetings?.trend} delay={0.2} />
            <DashboardCard title="Messages" value={stats.notifications?.value || ""} icon={<MessageSquare className="w-6 h-6" />} color="bg-purple-500" description="Non lus" trend={stats.notifications?.trend} delay={0.3} />
            <DashboardCard title="Alertes" value={stats.alerts?.value || ""} icon={<Bell className="w-6 h-6" />} color="bg-orange-500" description="Importantes" trend={stats.alerts?.trend} delay={0.4} />
          </>
        )}
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
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} index={index} />
              ))
            ) : (
              <div className="text-center py-8 text-neutral-500">
                Aucune activité récente
              </div>
            )}
          </div>
        </motion.div>

        {/* Raccourcis rapides */}
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
    </div>
  );
};

export default TableauDeBord;