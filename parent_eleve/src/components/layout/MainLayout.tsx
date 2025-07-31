import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  Home, Users, MessageSquare, BookOpen, BarChart2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const libellesRole: Record<string, string> = {
  adminEcole: "Administrateur d'École",
  gestionnaire: "Gestionnaire",
  professeur: "Professeur",
  eleve: "Élève",
  parent: "Parent/Tuteur"
};

const menuParRole: Record<string, { titre: string; lien: string; icone: React.ReactNode }[]> = {
  adminEcole: [
    { titre: "Tableau de bord", lien: "/dashboard", icone: <Home className="w-5 h-5" /> },
    { titre: "Utilisateurs", lien: "/utilisateurs", icone: <Users className="w-5 h-5" /> },
    // { titre: "Établissement", lien: "/etablissements", icone: <School className="w-5 h-5" /> },
    { titre: "Notifications", lien: "/messagerie", icone: <MessageSquare className="w-5 h-5" /> },
    { titre: "Analytics", lien: "/analytics", icone: <BarChart2 className="w-5 h-5" /> },
    // { titre: "Abonnements", lien: "/abonnements", icone: <BarChart2 className="w-5 h-5" /> },
    // { titre: "Paramètres", lien: "/parametres", icone: <Settings className="w-5 h-5" /> }
  ],
  gestionnaire: [
    { titre: "Tableau de bord", lien: "/dashboard", icone: <Home className="w-5 h-5" /> },
    { titre: "Utilisateurs", lien: "/utilisateurs", icone: <Users className="w-5 h-5" /> },
    { titre: "Cours", lien: "/cours", icone: <BookOpen className="w-5 h-5" /> },
    { titre: "Classes", lien: "/classes", icone: <Users className="w-5 h-5" /> },
    { titre: "Notifications", lien: "/messagerie", icone: <MessageSquare className="w-5 h-5" /> },
    // { titre: "Paramètres", lien: "/parametres", icone: <Settings className="w-5 h-5" /> }
  ],
  professeur: [
    { titre: "Tableau de bord", lien: "/dashboard", icone: <Home className="w-5 h-5" /> },
    { titre: "Mes Cours", lien: "/cours", icone: <BookOpen className="w-5 h-5" /> },
    { titre: "Mes Classes", lien: "/classes", icone: <BookOpen className="w-5 h-5" /> },
    { titre: "Notifications", lien: "/messagerie", icone: <MessageSquare className="w-5 h-5" /> },
    // { titre: "Paramètres", lien: "/parametres", icone: <Settings className="w-5 h-5" /> }
  ],
  eleve: [
    { titre: "Tableau de bord", lien: "/dashboard", icone: <Home className="w-5 h-5" /> },
    { titre: "Mes Cours", lien: "/cours", icone: <BookOpen className="w-5 h-5" /> },
    { titre: "Notifications", lien: "/messagerie", icone: <MessageSquare className="w-5 h-5" /> }
  ],
  parent: [
    { titre: "Tableau de bord", lien: "/dashboard", icone: <Home className="w-5 h-5" /> },
    { titre: "Mes Enfants", lien: "/enfants", icone: <Users className="w-5 h-5" /> },
    { titre: "Notifications", lien: "/messagerie", icone: <MessageSquare className="w-5 h-5" /> }
  ]
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const [sidebarRéduite, setSidebarRéduite] = useState(false);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const menu = menuParRole[user.role] || [];

  // Notifications simulées - À remplacer par une vraie API
  const notifications = [
    { 
      id: 1, 
      titre: "Nouvelle inscription", 
      message: "Un nouvel élève s'est inscrit en CE2", 
      lu: false, 
      type: "info" as const, 
      date: "Il y a 2h" 
    },
    { 
      id: 2, 
      titre: "Réunion programmée", 
      message: "Réunion pédagogique demain à 14h", 
      lu: false, 
      type: "alerte" as const, 
      date: "Il y a 4h" 
    },
    { 
      id: 3, 
      titre: "Mise à jour système", 
      message: "Le système sera mis à jour ce soir", 
      lu: true, 
      type: "info" as const, 
      date: "Hier" 
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-row">
      {/* Sidebar fixe à gauche */}
      <div className="fixed top-0 left-0 h-screen z-40">
        <Sidebar reduit={sidebarRéduite} onToggle={() => setSidebarRéduite((v) => !v)} />
      </div>
      {/* Wrapper pour header + main, décalé à droite du sidebar */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-200"
        style={{ marginLeft: sidebarRéduite ? '5rem' : '16rem' }}
      >
        {/* Header sticky en haut de la partie droite */}
        <div className="sticky top-0 z-30">
          <Header
            utilisateur={user}
            libellesRole={libellesRole}
            notifications={notifications}
            deconnexion={logout}
            sidebarRéduite={sidebarRéduite}
            onToggleSidebar={() => setSidebarRéduite((v) => !v)}
            onMenuToggle={() => {}}
            showMobileMenu={false}
          />
        </div>
        {/* Main scrollable, occupe tout l'espace restant */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;