import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { FournisseurAuth, useAuth } from "./contexts/ContexteAuth";
import { FournisseurTenant } from "./contexts/ContexteTenant";
import { FournisseurCommunication } from "./contexts/ContexteCommunication";
import Accueil from "./pages/commun/Accueil";
import Connexion from "./pages/commun/Connexion";
import TableauDeBordPage from "./pages/commun/TableauDeBordPage";
import Messagerie from "./pages/commun/Messagerie";
import Notifications from "./pages/commun/Notifications";
import ClasseGestionnaire from "./pages/gestionnaire/ClasseGestionnaire";
import ClasseProfesseur from "./pages/professeur/ClasseProfesseur";
import ClasseEleve from "./pages/eleve/ClasseEleve";
import Utilisateurs from "./pages/admin/Utilisateurs";
import Etablissements from "./pages/admin/Etablissements";
import Abonnements from "./pages/admin/Abonnements";
import Analytics from "./pages/admin/Analytics";
import NotFound from "./pages/commun/NotFound";

// Route protégée (exemple simple)
const RouteProtegee = ({ children }: { children: React.ReactNode }) => {
  const { utilisateur } = useAuth();
  const location = useLocation();
  if (!utilisateur) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { utilisateur } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/dashboard" element={
        <RouteProtegee>
          <TableauDeBordPage />
        </RouteProtegee>
      } />
      <Route path="/messagerie" element={
        <RouteProtegee>
          <Messagerie />
        </RouteProtegee>
      } />
      <Route path="/notifications" element={
        <RouteProtegee>
          <Notifications />
        </RouteProtegee>
      } />
      <Route path="/classes" element={
        <RouteProtegee>
          {utilisateur?.role === "gestionnaire" ? <ClasseGestionnaire /> :
           utilisateur?.role === "professeur" ? <ClasseProfesseur /> :
           utilisateur?.role === "eleve" ? <ClasseEleve /> :
           <Navigate to="/dashboard" replace />}
        </RouteProtegee>
      } />
      <Route path="/utilisateurs" element={
        <RouteProtegee>
          <Utilisateurs />
        </RouteProtegee>
      } />
      <Route path="/etablissements" element={
        <RouteProtegee>
          <Etablissements />
        </RouteProtegee>
      } />
      <Route path="/abonnements" element={
        <RouteProtegee>
          <Abonnements />
        </RouteProtegee>
      } />
      <Route path="/analytics" element={
        <RouteProtegee>
          <Analytics />
        </RouteProtegee>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <FournisseurAuth>
      <FournisseurTenant>
        <FournisseurCommunication>
          <AppRoutes />
        </FournisseurCommunication>
      </FournisseurTenant>
    </FournisseurAuth>
  );
};

export default App;
