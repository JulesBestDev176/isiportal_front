import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Download, RefreshCw, ArrowUpRight, ArrowDownRight,
  UserCheck, MessageSquare, Clock, Target,
  Award, AlertTriangle, CheckCircle, School, Bell
} from "lucide-react";
import {
  Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Bar,
  PieChart as RechartsPieChart, Cell, Pie, Area, AreaChart,
  ComposedChart
} from "recharts";
import { useAuth } from "../../contexts/ContexteAuth";
import { useTenant } from "../../contexts/ContexteTenant";
import MainLayout from "../../components/layout/MainLayout";

// Types pour les données analytiques
interface MetriqueKPI {
  label: string;
  valeur: number;
  unite: string;
  tendance: number;
  icone: React.ReactNode;
  couleur: string;
  description?: string;
}

interface DonneesTendance {
  periode: string;
  eleves: number;
  professeurs: number;
  connexions: number;
  messages: number;
}

interface PerformanceClasse {
  nom: string;
  niveau: string;
  effectif: number;
  moyenne: number;
  tauxPresence: number;
  progression: number;
}

interface ActiviteUtilisateur {
  date: string;
  connexions: number;
  messages: number;
  activites: number;
}

interface StatistiqueRole {
  role: string;
  nombre: number;
  actifs: number;
  couleur: string;
}

// Données mockées pour la démo
const kpiData: MetriqueKPI[] = [
  {
    label: "Élèves actifs",
    valeur: 248,
    unite: "",
    tendance: 12,
    icone: <Users className="w-6 h-6" />,
    couleur: "bg-blue-500",
    description: "Élèves connectés ce mois"
  },
  {
    label: "Taux de présence",
    valeur: 94.5,
    unite: "%",
    tendance: 2.3,
    icone: <UserCheck className="w-6 h-6" />,
    couleur: "bg-green-500",
    description: "Moyenne mensuelle"
  },
  {
    label: "Messages envoyés",
    valeur: 1247,
    unite: "",
    tendance: -8,
    icone: <MessageSquare className="w-6 h-6" />,
    couleur: "bg-purple-500",
    description: "Communications internes"
  },
  {
    label: "Activités créées",
    valeur: 89,
    unite: "",
    tendance: 15,
    icone: <BookOpen className="w-6 h-6" />,
    couleur: "bg-orange-500",
    description: "Cours et exercices"
  },
  {
    label: "Moyenne générale",
    valeur: 14.2,
    unite: "/20",
    tendance: 0.8,
    icone: <Award className="w-6 h-6" />,
    couleur: "bg-indigo-500",
    description: "Toutes classes confondues"
  },
  {
    label: "Temps connecté",
    valeur: 4.2,
    unite: "h/jour",
    tendance: -5,
    icone: <Clock className="w-6 h-6" />,
    couleur: "bg-red-500",
    description: "Moyenne par utilisateur"
  }
];

const tendanceData: DonneesTendance[] = [
  { periode: "Jan", eleves: 220, professeurs: 20, connexions: 1200, messages: 890 },
  { periode: "Fév", eleves: 235, professeurs: 22, connexions: 1450, messages: 1020 },
  { periode: "Mar", eleves: 242, professeurs: 23, connexions: 1380, messages: 1150 },
  { periode: "Avr", eleves: 248, professeurs: 24, connexions: 1520, messages: 1247 },
  { periode: "Mai", eleves: 250, professeurs: 24, connexions: 1680, messages: 1350 },
  { periode: "Juin", eleves: 248, professeurs: 24, connexions: 1420, messages: 1180 }
];

const performanceClasses: PerformanceClasse[] = [
  { nom: "CE2-A", niveau: "CE2", effectif: 25, moyenne: 15.2, tauxPresence: 96, progression: 8 },
  { nom: "CM1-B", niveau: "CM1", effectif: 28, moyenne: 14.8, tauxPresence: 94, progression: 12 },
  { nom: "CP-A", niveau: "CP", effectif: 22, moyenne: 16.1, tauxPresence: 98, progression: 15 },
  { nom: "CM2-A", niveau: "CM2", effectif: 26, moyenne: 13.9, tauxPresence: 92, progression: 5 },
  { nom: "CE1-B", niveau: "CE1", effectif: 24, moyenne: 14.5, tauxPresence: 95, progression: 10 }
];

const activiteData: ActiviteUtilisateur[] = [
  { date: "Lun", connexions: 180, messages: 250, activites: 45 },
  { date: "Mar", connexions: 220, messages: 320, activites: 52 },
  { date: "Mer", connexions: 195, messages: 280, activites: 38 },
  { date: "Jeu", connexions: 240, messages: 380, activites: 65 },
  { date: "Ven", connexions: 210, messages: 340, activites: 48 },
  { date: "Sam", connexions: 120, messages: 180, activites: 22 },
  { date: "Dim", connexions: 80, messages: 120, activites: 15 }
];

const roleData: StatistiqueRole[] = [
  { role: "Élèves", nombre: 248, actifs: 235, couleur: "#3b82f6" },
  { role: "Parents", nombre: 156, actifs: 142, couleur: "#10b981" },
  { role: "Professeurs", nombre: 24, actifs: 23, couleur: "#8b5cf6" },
  { role: "Gestionnaires", nombre: 8, actifs: 7, couleur: "#f59e0b" },
  { role: "Admins", nombre: 2, actifs: 2, couleur: "#ef4444" }
];

// Composant KPI Card
const KPICard: React.FC<{ metrique: MetriqueKPI; delay: number }> = ({ metrique, delay }) => {
  const estPositif = metrique.tendance >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${metrique.couleur} rounded-lg flex items-center justify-center text-white`}>
          {metrique.icone}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          estPositif ? 'text-green-600' : 'text-red-600'
        }`}>
          {estPositif ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {Math.abs(metrique.tendance)}%
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-bold text-neutral-900 mb-1">
          {metrique.valeur.toLocaleString()}{metrique.unite}
        </p>
        <h3 className="font-medium text-neutral-700 mb-1">{metrique.label}</h3>
        {metrique.description && (
          <p className="text-sm text-neutral-500">{metrique.description}</p>
        )}
      </div>
    </motion.div>
  );
};

// Composant Graphique de tendance
const GraphiqueTendance: React.FC = () => {
  const [metriqueActive, setMetriqueActive] = useState<keyof DonneesTendance>("eleves");

  const metriques = [
    { key: "eleves" as keyof DonneesTendance, label: "Élèves", couleur: "#3b82f6" },
    { key: "professeurs" as keyof DonneesTendance, label: "Professeurs", couleur: "#10b981" },
    { key: "connexions" as keyof DonneesTendance, label: "Connexions", couleur: "#8b5cf6" },
    { key: "messages" as keyof DonneesTendance, label: "Messages", couleur: "#f59e0b" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Évolution mensuelle</h3>
        <div className="flex items-center gap-2">
          {metriques.map((metrique) => (
            <button
              key={metrique.key}
              onClick={() => setMetriqueActive(metrique.key)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                metriqueActive === metrique.key
                  ? 'text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              style={{
                backgroundColor: metriqueActive === metrique.key ? metrique.couleur : 'transparent'
              }}
            >
              {metrique.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={tendanceData}>
            <defs>
              <linearGradient id="colorMetrique" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={metriques.find(m => m.key === metriqueActive)?.couleur} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={metriques.find(m => m.key === metriqueActive)?.couleur} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="periode" 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey={metriqueActive}
              stroke={metriques.find(m => m.key === metriqueActive)?.couleur}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMetrique)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Composant Performance des classes
const PerformanceClasses: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Performance par classe</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Voir détails
        </button>
      </div>

      <div className="space-y-4">
        {performanceClasses.map((classe, index) => (
          <motion.div
            key={classe.nom}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 border border-neutral-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <School className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">{classe.nom}</h4>
                  <p className="text-sm text-neutral-500">{classe.niveau} • {classe.effectif} élèves</p>
                </div>
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                classe.progression >= 10 ? 'bg-green-100 text-green-700' :
                classe.progression >= 5 ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                +{classe.progression}%
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-neutral-900">{classe.moyenne}</p>
                <p className="text-xs text-neutral-500">Moyenne</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{classe.tauxPresence}%</p>
                <p className="text-xs text-neutral-500">Présence</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{classe.effectif}</p>
                <p className="text-xs text-neutral-500">Effectif</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant Activité hebdomadaire
const ActiviteHebdomadaire: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Activité hebdomadaire</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-neutral-600">Connexions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-neutral-600">Messages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-neutral-600">Activités</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={activiteData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar dataKey="connexions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="messages" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="activites" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Composant Répartition par rôle
const RepartitionRoles: React.FC = () => {
  const total = roleData.reduce((sum, role) => sum + role.nombre, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Répartition des utilisateurs</h3>
        <span className="text-sm text-neutral-500">{total} total</span>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="nombre"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.couleur} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        {roleData.map((role, index) => (
          <div key={role.role} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: role.couleur }}
              />
              <span className="text-sm font-medium text-neutral-700">{role.role}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-900 font-medium">{role.nombre}</span>
              <span className="text-neutral-500">({role.actifs} actifs)</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant principal
const Analytics: React.FC = () => {
  const { utilisateur } = useAuth();
  const { tenant } = useTenant();
  const [selectedPeriod, setSelectedPeriod] = useState("30j");
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    // Simulation d'export
    setTimeout(() => {
      setLoading(false);
      // Ici vous implémenteriez l'export réel
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  if (!utilisateur || !tenant) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Chargement...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Analytics & Statistiques</h1>
            <p className="text-neutral-600 mt-1">
              Tableau de bord analytique - {tenant?.nom}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7j">7 derniers jours</option>
              <option value="30j">30 derniers jours</option>
              <option value="90j">3 derniers mois</option>
              <option value="365j">12 derniers mois</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              {loading ? 'Export...' : 'Exporter'}
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {kpiData.map((metrique, index) => (
            <KPICard key={metrique.label} metrique={metrique} delay={index * 0.1} />
          ))}
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GraphiqueTendance />
          <ActiviteHebdomadaire />
        </div>

        {/* Analyses détaillées */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PerformanceClasses />
          </div>
          <RepartitionRoles />
        </div>

        {/* Alertes et recommandations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-lg border border-neutral-200 p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alertes et recommandations
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Excellente performance</h4>
                <p className="text-sm text-green-700 mt-1">
                  Le taux de présence a augmenté de 2.3% ce mois-ci. Continuez sur cette lancée !
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">Attention requise</h4>
                <p className="text-sm text-orange-700 mt-1">
                  La classe CM2-A affiche une progression en baisse (-5%). Envisagez un suivi personnalisé.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Objectif en cours</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Vous êtes à 94.5% de votre objectif de taux de présence mensuel (95%).
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Analytics;