import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FournisseurAuth } from './contexts/ContexteAuth';
import RouteProtegee from './components/auth/RouteProtegee';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Accueil from './pages/commun/Accueil';
import Connexion from './pages/commun/Connexion';
import ChangerMotDePasse from './pages/commun/ChangerMotDePasse';
import TableauDeBord from './components/dashboard/TableauDeBord';
import Profil from './pages/commun/Profil';
import Utilisateurs from './pages/admin/Utilisateurs';
import Classes from './pages/admin/Classes';
import Cours from './pages/admin/Cours';
import Niveaux from './pages/admin/Niveaux';
import Salles from './pages/admin/Salles';
import Analytics from './pages/admin/Analytics';
import Messagerie from './pages/commun/Messagerie';
import Absences from './pages/admin/Absences';

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/changer-mot-de-passe" element={<ChangerMotDePasse />} />
      
      {/* Routes protégées */}
      <Route path="/dashboard" element={
        <RouteProtegee>
          <MainLayout>
            <TableauDeBord />
          </MainLayout>
        </RouteProtegee>
      } />
      
      <Route path="/profil" element={
        <RouteProtegee>
          <MainLayout>
            <Profil />
          </MainLayout>
        </RouteProtegee>
      } />
      
      {/* Routes administrateur */}
      <Route path="/utilisateurs" element={
        <RouteProtegee rolesAutorises={['administrateur', 'gestionnaire']}>
          <MainLayout>
            <Utilisateurs />
          </MainLayout>
        </RouteProtegee>
      } />
      
      <Route path="/niveaux" element={
        <RouteProtegee rolesAutorises={['administrateur', 'gestionnaire']}>
          <MainLayout>
            <Niveaux />
          </MainLayout>
        </RouteProtegee>
      } />
      
      <Route path="/classes" element={
        <RouteProtegee rolesAutorises={['administrateur', 'gestionnaire']}>
          <MainLayout>
            <Classes />
          </MainLayout>
        </RouteProtegee>
      } />
      
      <Route path="/cours" element={
        <RouteProtegee rolesAutorises={['administrateur', 'gestionnaire', 'professeur']}>
          <MainLayout>
            <Cours />
          </MainLayout>
        </RouteProtegee>
      } />
      
      <Route path="/salles" element={
        <RouteProtegee rolesAutorises={['administrateur', 'gestionnaire']}>
          <MainLayout>
            <Salles />
          </MainLayout>
        </RouteProtegee>
      } />
      
      <Route path="/analytics" element={
        <RouteProtegee rolesAutorises={['administrateur', 'gestionnaire']}>
          <MainLayout>
            <Analytics />
          </MainLayout>
        </RouteProtegee>
      } />
      
      <Route path="/messagerie" element={
        <RouteProtegee rolesAutorises={['administrateur', 'gestionnaire', 'professeur']}>
          <MainLayout>
            <Messagerie />
          </MainLayout>
        </RouteProtegee>
      } />
      
      <Route path="/absences" element={
        <RouteProtegee rolesAutorises={['administrateur', 'gestionnaire']}>
          <MainLayout>
            <Absences />
          </MainLayout>
        </RouteProtegee>
      } />
      
      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FournisseurAuth>
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </div>
      </FournisseurAuth>
    </ErrorBoundary>
  );
};

export default App;
