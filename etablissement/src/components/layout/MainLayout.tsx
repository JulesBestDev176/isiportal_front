import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/ContexteAuth';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const libellesRole: Record<string, string> = {
  administrateur: "Administrateur",
  gestionnaire: "Gestionnaire", 
  professeur: "Professeur"
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { utilisateur } = useAuth();
  const [sidebarReduite, setSidebarReduite] = useState(false);

  // Notifications mock - à remplacer par de vraies données
  const notifications = [
    {
      id: 1,
      titre: "Nouvelle inscription",
      message: "Un nouvel élève s'est inscrit dans votre classe",
      lu: false,
      type: "info" as const,
      date: "Il y a 2 heures"
    }
  ];

  if (!utilisateur) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const deconnexion = () => {
    // Logique de déconnexion
    console.log('Déconnexion');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar fixe à gauche */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar 
          reduit={sidebarReduite} 
          onToggle={() => setSidebarReduite((v) => !v)} 
        />
      </div>
      {/* Wrapper pour header + main, décalé à droite du sidebar */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-200"
        style={{ marginLeft: sidebarReduite ? '5rem' : '16rem' }}
      >
        {/* Header sticky en haut de la partie droite */}
        <div className="sticky top-0 z-30">
          <Header
            utilisateur={utilisateur}
            tenant={{ nom: 'Établissement Scolaire' }}
            libellesRole={libellesRole}
            notifications={notifications}
            deconnexion={deconnexion}
            sidebarRéduite={sidebarReduite}
            onToggleSidebar={() => setSidebarReduite((v) => !v)}
            onMenuToggle={() => {}}
            showMobileMenu={false}
          />
        </div>
        
        {/* Contenu principal */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;