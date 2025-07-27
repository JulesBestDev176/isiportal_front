import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { FournisseurTenant } from "./contexts/ContexteTenant";
import { FournisseurCommunication } from "./contexts/ContexteCommunication";
import Connexion from "./pages/commun/Connexion";
import NotFound from "./pages/commun/NotFound";
// Élève
import DashboardEleve from "./pages/eleve/Dashboard";
import MesCours from "./pages/eleve/MesCours";
import Bulletins from "./pages/eleve/Bulletins";
import MessagerieEleve from "./pages/eleve/Messagerie";
// Parent
import DashboardParent from "./pages/parent/Dashboard";
import MesEnfants from "./pages/parent/MesEnfants";
import MessagerieParent from "./pages/parent/Messagerie";
import MainLayout from "./components/layout/MainLayout";
import Notifications from "./pages/eleve/Messagerie";

const RouteProtegee = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/connexion" element={<Connexion />} />
      {/* Dashboard */}
      <Route path="/dashboard" element={
        <RouteProtegee>
          {user?.role === "eleve" ? (
            <MainLayout>
              <DashboardEleve />
            </MainLayout>
          ) : user?.role === "parent" ? (
            <MainLayout>
              <DashboardParent />
            </MainLayout>
          ) : (
            <Navigate to="/connexion" replace />
          )}
        </RouteProtegee>
      } />
      {/* Élève */}
      <Route path="/cours" element={
        <RouteProtegee>
          {user?.role === "eleve" ? (
            <MainLayout>
              <MesCours />
            </MainLayout>
          ) : <Navigate to="/dashboard" replace />}
        </RouteProtegee>
      } />
      <Route path="/bulletins" element={
        <RouteProtegee>
          {user?.role === "eleve" ? (
            <MainLayout>
              <Bulletins />
            </MainLayout>
          ) : <Navigate to="/dashboard" replace />}
        </RouteProtegee>
      } />
      <Route path="/messagerie" element={
        <RouteProtegee>
          {user?.role === "eleve" ? (
            <MainLayout>
              <Notifications />
            </MainLayout>
          ) : user?.role === "parent" ? (
            <MainLayout>
              <MessagerieParent />
            </MainLayout>
          ) : <Navigate to="/dashboard" replace />}
        </RouteProtegee>
      } />
      {/* Parent */}
      <Route path="/enfants" element={
        <RouteProtegee>
          {user?.role === "parent" ? (
            <MainLayout>
              <MesEnfants />
            </MainLayout>
          ) : <Navigate to="/dashboard" replace />}
        </RouteProtegee>
      } />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <FournisseurTenant>
      <FournisseurCommunication>
        <AppRoutes />
      </FournisseurCommunication>
    </FournisseurTenant>
  );
};

export default App;
