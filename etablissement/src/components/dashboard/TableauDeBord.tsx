import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/ContexteAuth';

interface StatistiqueCard {
  titre: string;
  valeur: string | number;
  icone: React.ReactNode;
  couleur: string;
  evolution?: string;
}

interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
}

const TableauDeBord: React.FC = () => {
  const { utilisateur } = useAuth();
  const [statistiques, setStatistiques] = useState<StatistiqueCard[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        // Simulation du chargement des données
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Statistiques simulées selon le rôle
        const statsParRole = {
          administrateur: [
            {
              titre: 'Total Utilisateurs',
              valeur: 1247,
              icone: <Users className="w-6 h-6" />,
              couleur: 'bg-blue-500',
              evolution: '+12%'
            },
            {
              titre: 'Classes Actives',
              valeur: 45,
              icone: <GraduationCap className="w-6 h-6" />,
              couleur: 'bg-green-500',
              evolution: '+3%'
            },
            {
              titre: 'Cours Programmés',
              valeur: 234,
              icone: <BookOpen className="w-6 h-6" />,
              couleur: 'bg-purple-500',
              evolution: '+8%'
            },
            {
              titre: 'Événements',
              valeur: 12,
              icone: <Calendar className="w-6 h-6" />,
              couleur: 'bg-orange-500',
              evolution: '+2%'
            }
          ],
          gestionnaire: [
            {
              titre: 'Élèves Inscrits',
              valeur: 892,
              icone: <Users className="w-6 h-6" />,
              couleur: 'bg-blue-500',
              evolution: '+5%'
            },
            {
              titre: 'Classes Gérées',
              valeur: 28,
              icone: <GraduationCap className="w-6 h-6" />,
              couleur: 'bg-green-500',
              evolution: '+1%'
            },
            {
              titre: 'Professeurs',
              valeur: 67,
              icone: <BookOpen className="w-6 h-6" />,
              couleur: 'bg-purple-500',
              evolution: '+3%'
            }
          ],
          professeur: [
            {
              titre: 'Mes Classes',
              valeur: 8,
              icone: <GraduationCap className="w-6 h-6" />,
              couleur: 'bg-blue-500'
            },
            {
              titre: 'Élèves Total',
              valeur: 187,
              icone: <Users className="w-6 h-6" />,
              couleur: 'bg-green-500'
            },
            {
              titre: 'Cours Cette Semaine',
              valeur: 24,
              icone: <BookOpen className="w-6 h-6" />,
              couleur: 'bg-purple-500'
            },
            {
              titre: 'Devoirs à Corriger',
              valeur: 45,
              icone: <Clock className="w-6 h-6" />,
              couleur: 'bg-orange-500'
            }
          ]
        };

        setStatistiques(statsParRole[utilisateur?.role as keyof typeof statsParRole] || []);

        // Notifications simulées
        setNotifications([
          {
            id: '1',
            titre: 'Nouvelle année scolaire',
            message: 'Préparation de la rentrée 2024-2025',
            type: 'info',
            date: '2024-01-15'
          },
          {
            id: '2',
            titre: 'Maintenance programmée',
            message: 'Maintenance du système prévue ce weekend',
            type: 'warning',
            date: '2024-01-14'
          },
          {
            id: '3',
            titre: 'Mise à jour terminée',
            message: 'Nouvelles fonctionnalités disponibles',
            type: 'success',
            date: '2024-01-13'
          }
        ]);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, [utilisateur?.role]);

  const obtenirIconeNotification = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const obtenirCouleurNotification = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-orange-500 bg-orange-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  if (chargement) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour, {utilisateur?.prenom} {utilisateur?.nom}
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenue sur votre tableau de bord {utilisateur?.role}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statistiques.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.titre}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.valeur}</p>
                {stat.evolution && (
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.evolution}
                  </p>
                )}
              </div>
              <div className={`${stat.couleur} p-3 rounded-lg text-white`}>
                {stat.icone}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section notifications et activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 p-4 rounded-r-lg ${obtenirCouleurNotification(notification.type)}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {obtenirIconeNotification(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.titre}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Données récentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {utilisateur?.role === 'administrateur' ? 'Données de l\'établissement' : 'Données récentes'}
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {utilisateur?.role === 'administrateur' && (
                <>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Nouvelles inscriptions</p>
                        <p className="text-xs text-gray-500">Cette semaine</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">23</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cours actifs</p>
                        <p className="text-xs text-gray-500">En cours ce semestre</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-600">156</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Absences non justifiées</p>
                        <p className="text-xs text-gray-500">À traiter</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-orange-600">12</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bulletins générés</p>
                        <p className="text-xs text-gray-500">Ce trimestre</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-purple-600">892</span>
                  </div>
                </>
              )}
              
              {utilisateur?.role === 'gestionnaire' && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Nouvelle classe créée</p>
                      <p className="text-xs text-gray-500">Il y a 1 heure</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Emploi du temps validé</p>
                      <p className="text-xs text-gray-500">Il y a 3 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Professeur assigné</p>
                      <p className="text-xs text-gray-500">Hier</p>
                    </div>
                  </div>
                </>
              )}
              
              {utilisateur?.role === 'professeur' && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Notes saisies</p>
                      <p className="text-xs text-gray-500">Il y a 30 min</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Appel effectué</p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Cours planifié</p>
                      <p className="text-xs text-gray-500">Hier</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauDeBord;