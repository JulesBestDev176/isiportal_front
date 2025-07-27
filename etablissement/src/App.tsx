import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FournisseurAuth } from './contexts/ContexteAuth';
import MainLayout from './components/layout/MainLayout';
import Connexion from './pages/commun/Connexion';
import TableauDeBord from './components/dashboard/TableauDeBord';
import Profil from './pages/commun/Profil';
import Utilisateurs from './pages/admin/Utilisateurs';
import Classes from './pages/admin/Classes';
import Cours from './pages/admin/Cours';
import Niveaux from './pages/admin/Niveaux';
import Salles from './pages/admin/Salles';

import Analytics from './pages/admin/Analytics';
import { useAuth } from './contexts/ContexteAuth';
import Messagerie from './pages/commun/Messagerie';

const AppContent: React.FC = () => {
  const { utilisateur } = useAuth();

  if (!utilisateur) {
    return (
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<TableauDeBord />} />
        <Route path="/profil" element={<Profil />} />
        
        {/* Routes administrateur */}
        {utilisateur.role === 'administrateur' && (
          <>
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/niveaux" element={<Niveaux />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/cours" element={<Cours />} />
            <Route path="/salles" element={<Salles />} />
            <Route path="/messagerie" element={<Messagerie />} />
            <Route path="/analytics" element={<Analytics />} />
          </>
        )}
        
        {/* Routes professeur */}
        {utilisateur.role === 'professeur' && (
          <>
            <Route path="/cours" element={<Cours />} />
            <Route path="/messagerie" element={<Messagerie />} />
          </>
        )}
        
        {/* Routes gestionnaire */}
        {utilisateur.role === 'gestionnaire' && (
          <>
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/niveaux" element={<Niveaux />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/messagerie" element={<Messagerie />} />
            <Route path="/analytics" element={<Analytics />} />
          </>
        )}
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <FournisseurAuth>
      <div className="min-h-screen bg-gray-50">
        <AppContent />
      </div>
    </FournisseurAuth>
  );
};

export default App;
