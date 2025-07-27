import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/ContexteAuth';
import { Loader2 } from 'lucide-react';

interface RouteProtegeeProps {
  children: React.ReactNode;
  rolesAutorises?: string[];
}

const RouteProtegee: React.FC<RouteProtegeeProps> = ({ children, rolesAutorises }) => {
  const { utilisateur, chargement } = useAuth();
  const location = useLocation();

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!utilisateur) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (rolesAutorises && rolesAutorises.length > 0) {
    const roleUtilisateur = utilisateur.role;
    
    // Vérifier si le rôle de l'utilisateur est autorisé
    const estAutorise = rolesAutorises.includes(roleUtilisateur);

    if (!estAutorise) {
      return <Navigate to="/non-autorise" replace />;
    }
  }

  return <>{children}</>;
};

export default RouteProtegee;

export {};