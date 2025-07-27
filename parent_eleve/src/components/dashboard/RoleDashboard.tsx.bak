import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/ContexteAuth";
import { useTenant } from "../../contexts/ContexteTenant";
import {
  Shield, Users, BookOpen, GraduationCap, User, Heart,
  School, Settings, BarChart3, MessageSquare, Calendar,
  FileText, Award, Target, Clock
} from "lucide-react";

// Labels des rôles
const roleLabels: Record<string, string> = {
  superAdmin: "Super Administrateur",
  adminEcole: "Administrateur d'École", 
  gestionnaire: "Gestionnaire",
  professeur: "Professeur",
  eleve: "Élève",
  parent: "Parent/Tuteur"
};

// Configuration des rôles avec leurs spécificités
const roleConfigurations = {
  superAdmin: {
    icon: <Shield className="w-8 h-8" />,
    color: "bg-red-500",
    description: "Gestion complète de la plateforme SaaS",
    responsibilities: [
      "Gestion de tous les établissements",
      "Configuration des abonnements",
      "Support technique global",
      "Analytics de la plateforme"
    ],
    features: [
      "Dashboard global multi-tenant",
      "Gestion des écoles clientes", 
      "Facturation et abonnements",
      "Support et maintenance"
    ]
  },
  adminEcole: {
    icon: <School className="w-8 h-8" />,
    color: "bg-blue-500",
    description: "Administration complète de l'établissement",
    responsibilities: [
      "Configuration de l'établissement",
      "Gestion des utilisateurs",
      "Supervision générale",
      "Rapports et analytics"
    ],
    features: [
      "Tableau de bord administratif",
      "Gestion utilisateurs et rôles",
      "Configuration établissement",
      "Rapports détaillés"
    ]
  },
  gestionnaire: {
    icon: <Users className="w-8 h-8" />,
    color: "bg-green-500", 
    description: "Gestion opérationnelle quotidienne",
    responsibilities: [
      "Gestion des professeurs",
      "Organisation des classes",
      "Suivi des élèves",
      "Communication avec parents"
    ],
    features: [
      "Gestion des emplois du temps",
      "Suivi pédagogique",
      "Communication multi-canal",
      "Rapports opérationnels"
    ]
  },
  professeur: {
    icon: <GraduationCap className="w-8 h-8" />,
    color: "bg-purple-500",
    description: "Enseignement et suivi pédagogique",
    responsibilities: [
      "Gestion des notes",
      "Suivi des élèves", 
      "Communication parents",
      "Planification des cours"
    ],
    features: [
      "Carnet de notes numérique",
      "Suivi des présences",
      "Messagerie intégrée",
      "Ressources pédagogiques"
    ]
  },
  eleve: {
    icon: <BookOpen className="w-8 h-8" />,
    color: "bg-orange-500",
    description: "Apprentissage et suivi personnel",
    responsibilities: [
      "Consultation des notes",
      "Accès aux cours",
      "Communication enseignants",
      "Suivi personnel"
    ],
    features: [
      "Espace personnel sécurisé", 
      "Cours et ressources",
      "Messagerie étudiante",
      "Suivi des progrès"
    ]
  },
  parent: {
    icon: <Heart className="w-8 h-8" />,
    color: "bg-pink-500",
    description: "Suivi et accompagnement familial",
    responsibilities: [
      "Suivi multi-enfants",
      "Communication école",
      "Rendez-vous professeurs",
      "Notifications importantes"
    ],
    features: [
      "Dashboard familial consolidé",
      "Messagerie parent-école",
      "Planification RDV",
      "Alertes personnalisées"
    ]
  }
};

// Composant pour afficher les fonctionnalités
const FeatureCard: React.FC<{ title: string; features: string[]; delay: number }> = ({ 
  title, 
  features, 
  delay 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-lg border border-neutral-200 p-6"
  >
    <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
          className="flex items-center gap-2 text-sm text-neutral-600"
        >
          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
          {feature}
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

// Composant pour les statistiques rapides par rôle
const RoleStats: React.FC<{ role: string; delay: number }> = ({ role, delay }) => {
  const getStatsForRole = (userRole: string) => {
    switch (userRole) {
      case "superAdmin":
        return [
          { label: "Établissements", value: "25", icon: <School className="w-5 h-5" /> },
          { label: "Utilisateurs totaux", value: "3,247", icon: <Users className="w-5 h-5" /> },
          { label: "Revenus mensuels", value: "45K€", icon: <BarChart3 className="w-5 h-5" /> }
        ];
      case "adminEcole":
        return [
          { label: "Utilisateurs", value: "120", icon: <Users className="w-5 h-5" /> },
          { label: "Classes", value: "12", icon: <BookOpen className="w-5 h-5" /> },
          { label: "Taux d'activité", value: "94%", icon: <BarChart3 className="w-5 h-5" /> }
        ];
      case "gestionnaire":
        return [
          { label: "Élèves gérés", value: "248", icon: <Users className="w-5 h-5" /> },
          { label: "Classes", value: "12", icon: <BookOpen className="w-5 h-5" /> },
          { label: "Messages", value: "8", icon: <MessageSquare className="w-5 h-5" /> }
        ];
      case "professeur":
        return [
          { label: "Mes classes", value: "6", icon: <BookOpen className="w-5 h-5" /> },
          { label: "Élèves", value: "142", icon: <Users className="w-5 h-5" /> },
          { label: "Progression", value: "80%", icon: <Target className="w-5 h-5" /> }
        ];
      case "eleve":
        return [
          { label: "Matières", value: "8", icon: <BookOpen className="w-5 h-5" /> },
          { label: "Devoirs", value: "5", icon: <FileText className="w-5 h-5" /> },
          { label: "Moyenne", value: "14.2", icon: <Award className="w-5 h-5" /> }
        ];
      case "parent":
        return [
          { label: "Enfants", value: "2", icon: <Users className="w-5 h-5" /> },
          { label: "RDV", value: "1", icon: <Calendar className="w-5 h-5" /> },
          { label: "Messages", value: "3", icon: <MessageSquare className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole(role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Aperçu rapide</h3>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
            className="text-center"
          >
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-2 text-primary-600">
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
            <p className="text-xs text-neutral-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant pour les actions recommandées
const RecommendedActions: React.FC<{ role: string; delay: number }> = ({ role, delay }) => {
  const getActionsForRole = (userRole: string) => {
    switch (userRole) {
      case "superAdmin":
        return [
          { title: "Consulter les analytics", icon: <BarChart3 className="w-5 h-5" />, urgent: false },
          { title: "Vérifier les abonnements", icon: <Settings className="w-5 h-5" />, urgent: true },
          { title: "Support client", icon: <MessageSquare className="w-5 h-5" />, urgent: false }
        ];
      case "adminEcole":
        return [
          { title: "Valider les inscriptions", icon: <Users className="w-5 h-5" />, urgent: true },
          { title: "Consulter les rapports", icon: <FileText className="w-5 h-5" />, urgent: false },
          { title: "Configurer l'année scolaire", icon: <Calendar className="w-5 h-5" />, urgent: false }
        ];
      case "gestionnaire":
        return [
          { title: "Planifier les emplois du temps", icon: <Calendar className="w-5 h-5" />, urgent: true },
          { title: "Suivre les absences", icon: <Clock className="w-5 h-5" />, urgent: true },
          { title: "Organiser les réunions", icon: <Users className="w-5 h-5" />, urgent: false }
        ];
      case "professeur":
        return [
          { title: "Saisir les notes", icon: <Award className="w-5 h-5" />, urgent: true },
          { title: "Prendre les présences", icon: <Clock className="w-5 h-5" />, urgent: true },
          { title: "Répondre aux messages", icon: <MessageSquare className="w-5 h-5" />, urgent: false }
        ];
      case "eleve":
        return [
          { title: "Consulter les nouveaux cours", icon: <BookOpen className="w-5 h-5" />, urgent: false },
          { title: "Rendre les devoirs", icon: <FileText className="w-5 h-5" />, urgent: true },
          { title: "Vérifier l'emploi du temps", icon: <Calendar className="w-5 h-5" />, urgent: false }
        ];
      case "parent":
        return [
          { title: "Consulter les notes", icon: <Award className="w-5 h-5" />, urgent: false },
          { title: "Planifier un RDV", icon: <Calendar className="w-5 h-5" />, urgent: false },
          { title: "Répondre aux messages", icon: <MessageSquare className="w-5 h-5" />, urgent: true }
        ];
      default:
        return [];
    }
  };

  const actions = getActionsForRole(role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Actions recommandées</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
              action.urgent 
                ? 'border-orange-200 bg-orange-50 hover:bg-orange-100' 
                : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              action.urgent ? 'bg-orange-500 text-white' : 'bg-primary-500 text-white'
            }`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-neutral-900">{action.title}</span>
            {action.urgent && (
              <span className="ml-auto text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                Urgent
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export const RoleDashboard: React.FC = () => {
  const { utilisateur } = useAuth();
  const { tenant } = useTenant();

  if (!utilisateur || !tenant) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const roleConfig = roleConfigurations[utilisateur.role as keyof typeof roleConfigurations];
  
  if (!roleConfig) {
    return (
      <div className="p-8 text-center">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <p className="text-orange-800">Rôle non reconnu: {utilisateur.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête du rôle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-neutral-200 p-8"
      >
        <div className="flex items-start gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`w-16 h-16 ${roleConfig.color} rounded-xl flex items-center justify-center text-white`}
          >
            {roleConfig.icon}
          </motion.div>
          
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-neutral-900 mb-2"
            >
              Bienvenue, {roleLabels[utilisateur.role] || utilisateur.role} !
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-neutral-600 mb-4"
            >
              Établissement: <span className="font-semibold">{tenant.nom || tenant.idEcole || tenant.sousDomaine}</span>
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-neutral-600"
            >
              {roleConfig.description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Grille de contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistiques rapides */}
        <RoleStats role={utilisateur.role} delay={0.4} />
        
        {/* Actions recommandées */}
        <RecommendedActions role={utilisateur.role} delay={0.5} />
        
        {/* Responsabilités */}
        <FeatureCard 
          title="Vos responsabilités" 
          features={roleConfig.responsibilities} 
          delay={0.6} 
        />
      </div>

      {/* Fonctionnalités disponibles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureCard 
          title="Fonctionnalités principales" 
          features={roleConfig.features} 
          delay={0.7} 
        />
        
        {/* Conseils et bonnes pratiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-primary-50 border border-primary-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-primary-900 mb-4">
            Conseils pour optimiser votre usage
          </h3>
          <div className="space-y-3 text-sm text-primary-800">
            {utilisateur.role === "adminEcole" && (
              <>
                <p>• Configurez d'abord les paramètres de votre établissement</p>
                <p>• Créez les classes et assignez les professeurs</p>
                <p>• Activez les notifications importantes pour les parents</p>
              </>
            )}
            {utilisateur.role === "gestionnaire" && (
              <>
                <p>• Planifiez les emplois du temps en début de période</p>
                <p>• Suivez régulièrement les présences et absences</p>
                <p>• Maintenez une communication active avec l'équipe</p>
              </>
            )}
            {utilisateur.role === "professeur" && (
              <>
                <p>• Saisissez les notes régulièrement pour un suivi optimal</p>
                <p>• Utilisez la messagerie pour communiquer avec les parents</p>
                <p>• Consultez les ressources pédagogiques disponibles</p>
              </>
            )}
            {utilisateur.role === "eleve" && (
              <>
                <p>• Consultez régulièrement vos cours et devoirs</p>
                <p>• Suivez votre progression dans chaque matière</p>
                <p>• N'hésitez pas à contacter vos professeurs en cas de besoin</p>
              </>
            )}
            {utilisateur.role === "parent" && (
              <>
                <p>• Consultez régulièrement les notes et absences</p>
                <p>• Planifiez des rendez-vous avec les professeurs si nécessaire</p>
                <p>• Activez les notifications pour rester informé</p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Pied de page informatif */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 text-center"
      >
        <p className="text-sm text-neutral-600">
          Ce dashboard est adapté à votre rôle et à votre établissement. 
          Toutes les fonctionnalités sont contextualisées pour optimiser votre expérience.
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          Dernière connexion: Aujourd'hui • Version: 2.1.0
        </p>
      </motion.div>
    </div>
  );
};

export default RoleDashboard;