// Modèles pour les analytics et statistiques

export interface MetriqueKPI {
  label: string;
  valeur: number;
  unite: string;
  tendance: number;
  icone: React.ReactNode;
  couleur: string;
  description?: string;
}

export interface DonneesTendance {
  periode: string;
  professeurs: number;
  gestionnaires: number;
  connexions: number;
}

export interface PerformanceClasse {
  nom: string;
  niveau: string;
  effectif: number;
  moyenne: number;
  tauxPresence: number;
  progression: number;
}

export interface StatistiqueRole {
  role: string;
  nombre: number;
  couleur: string;
}

export interface RapportAnalytics {
  periode: {
    debut: string;
    fin: string;
  };
  kpis: MetriqueKPI[];
  tendances: DonneesTendance[];
  performances: PerformanceClasse[];
  repartitionRoles: StatistiqueRole[];
}

// Types pour les graphiques
export interface DonneesGraphique {
  nom: string;
  valeur: number;
  couleur?: string;
}

export interface ConfigurationGraphique {
  type: "line" | "bar" | "pie" | "area";
  titre: string;
  axeX?: string;
  axeY?: string;
  couleurs?: string[];
}

// Constantes
export const PERIODES_ANALYTICS = [
  { value: "7j", label: "7 derniers jours" },
  { value: "30j", label: "30 derniers jours" },
  { value: "3m", label: "3 derniers mois" },
  { value: "6m", label: "6 derniers mois" },
  { value: "1a", label: "1 an" }
] as const;

export const COULEURS_GRAPHIQUES = [
  "#3b82f6", // blue
  "#10b981", // green
  "#8b5cf6", // purple
  "#f59e0b", // orange
  "#ef4444", // red
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316"  // orange-500
];

export type PeriodeAnalytics = typeof PERIODES_ANALYTICS[number]["value"];