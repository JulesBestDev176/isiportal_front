import React from 'react';
import { useAuth } from '../../contexts/ContexteAuth';

interface RouteProtegeeProps {
  children: React.ReactNode;
  rolesAutorises?: string[];
}

const RouteProtegee: React.FC<RouteProtegeeProps> = ({ 
  children, 
  rolesAutorises = ['administrateur', 'gestionnaire', 'professeur'] 
}) => {
  const { utilisateur, chargement, estRoleAutorise, doitChangerMotDePasse } = useAuth();

  if (chargement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur doit changer son mot de passe
  if (doitChangerMotDePasse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-blue-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Changement de mot de passe requis</h1>
          <p className="text-gray-600 mb-4">
            Pour des raisons de sécurité, vous devez changer votre mot de passe avant d'accéder à la plateforme.
          </p>
          <button 
            onClick={() => window.location.href = '/changer-mot-de-passe'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Changer mon mot de passe
          </button>
        </div>
      </div>
    );
  }

  // Vérifier si le rôle de l'utilisateur est autorisé sur cette plateforme
  if (!estRoleAutorise(utilisateur.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-4">
            Les utilisateurs avec le rôle <strong>"{utilisateur.role}"</strong> ne peuvent pas accéder à cette plateforme.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h2 className="font-semibold text-blue-800 mb-2">Plateformes disponibles :</h2>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Parents :</strong> Plateforme dédiée aux parents</li>
              <li>• <strong>Élèves :</strong> Plateforme dédiée aux élèves</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Vérifier les rôles spécifiques si fournis
  if (rolesAutorises.length > 0 && !rolesAutorises.includes(utilisateur.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteProtegee;