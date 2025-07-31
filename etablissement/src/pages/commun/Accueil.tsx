import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Users, GraduationCap, Heart, Baby } from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";

const Accueil: React.FC = () => {
  const { utilisateur, chargement } = useAuth();

  if (chargement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (utilisateur) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Portail Établissement Scolaire
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Système de gestion intégré pour les établissements scolaires
          </p>
        </div>

        {/* Plateformes disponibles */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Plateforme Établissement */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3">
                Plateforme Établissement
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Gestion administrative, pédagogique et des ressources de l'établissement.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Accès :</strong> Administrateurs, Gestionnaires, Professeurs</p>
              <p><strong>Fonctionnalités :</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Gestion des utilisateurs</li>
                <li>Administration des classes</li>
                <li>Suivi pédagogique</li>
                <li>Gestion des ressources</li>
              </ul>
            </div>
            <a 
              href="/connexion" 
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Accéder
            </a>
          </div>

          {/* Plateforme Parents */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3">
                Plateforme Parents
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Suivi de la scolarité de vos enfants et communication avec l'établissement.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Accès :</strong> Parents uniquement</p>
              <p><strong>Fonctionnalités :</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Suivi des notes</li>
                <li>Communication avec les professeurs</li>
                <li>Consultation des bulletins</li>
                <li>Gestion des absences</li>
              </ul>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <em>Plateforme dédiée en développement</em>
            </div>
          </div>

          {/* Plateforme Élèves */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Baby className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3">
                Plateforme Élèves
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Espace personnel pour consulter vos résultats et ressources pédagogiques.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Accès :</strong> Élèves uniquement</p>
              <p><strong>Fonctionnalités :</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Consultation des notes</li>
                <li>Ressources pédagogiques</li>
                <li>Emploi du temps</li>
                <li>Communication avec les professeurs</li>
              </ul>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <em>Plateforme dédiée en développement</em>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Sécurité et Accès
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🔐 Authentification sécurisée
              </h3>
              <p className="text-gray-600">
                Chaque plateforme dispose de son propre système d'authentification 
                et de ses propres permissions pour garantir la sécurité des données.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📱 Accès multi-plateformes
              </h3>
              <p className="text-gray-600">
                Les utilisateurs sont redirigés automatiquement vers leur plateforme 
                dédiée selon leur rôle dans l'établissement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil; 