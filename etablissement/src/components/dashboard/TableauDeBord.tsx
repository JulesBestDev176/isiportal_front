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
import { dashboardService, DashboardStats, ActiviteRecente } from '../../services/dashboardService';

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
        if (!utilisateur?.role) return;

        // Récupérer les statistiques depuis l'API
        let statsData: DashboardStats = {};
        try {
          statsData = await dashboardService.getDashboardStats(utilisateur.role);
        } catch (error) {
          console.error('Erreur lors du chargement des statistiques:', error);
          statsData = {};
        }
        
        // Transformer les données selon le rôle
        const statsParRole = {
          administrateur: [
            {
              titre: 'Total Utilisateurs',
              valeur: statsData.totalUtilisateurs || 0,
              icone: <Users className="w-6 h-6" />,
              couleur: 'bg-blue-500',
              evolution: '+12%'
            },
            {
              titre: 'Classes Actives',
              valeur: statsData.classesActives || 0,
              icone: <GraduationCap className="w-6 h-6" />,
              couleur: 'bg-green-500',
              evolution: '+3%'
            },
            {
              titre: 'Cours Programmés',
              valeur: statsData.coursProgrammes || 0,
              icone: <BookOpen className="w-6 h-6" />,
              couleur: 'bg-purple-500',
              evolution: '+8%'
            },
            {
              titre: 'Événements',
              valeur: statsData.evenements || 0,
              icone: <Calendar className="w-6 h-6" />,
              couleur: 'bg-orange-500',
              evolution: '+2%'
            }
          ],
          gestionnaire: [
            {
              titre: 'Élèves Inscrits',
              valeur: statsData.elevesInscrits || 0,
              icone: <Users className="w-6 h-6" />,
              couleur: 'bg-blue-500',
              evolution: '+5%'
            },
            {
              titre: 'Classes Gérées',
              valeur: statsData.classesGerees || 0,
              icone: <GraduationCap className="w-6 h-6" />,
              couleur: 'bg-green-500',
              evolution: '+1%'
            },
            {
              titre: 'Professeurs',
              valeur: statsData.professeurs || 0,
              icone: <BookOpen className="w-6 h-6" />,
              couleur: 'bg-purple-500',
              evolution: '+3%'
            }
          ],
          professeur: [
            {
              titre: 'Mes Classes',
              valeur: statsData.mesClasses || 0,
              icone: <GraduationCap className="w-6 h-6" />,
              couleur: 'bg-blue-500'
            },
            {
              titre: 'Élèves Total',
              valeur: statsData.elevesTotal || 0,
              icone: <Users className="w-6 h-6" />,
              couleur: 'bg-green-500'
            },
            {
              titre: 'Cours Cette Semaine',
              valeur: statsData.coursCetteSemaine || 0,
              icone: <BookOpen className="w-6 h-6" />,
              couleur: 'bg-purple-500'
            },
            {
              titre: 'Devoirs à Corriger',
              valeur: statsData.devoirsACorriger || 0,
              icone: <Clock className="w-6 h-6" />,
              couleur: 'bg-orange-500'
            }
          ]
        };

        setStatistiques(statsParRole[utilisateur.role as keyof typeof statsParRole] || []);

        // Récupérer les notifications depuis l'API
        try {
          const notificationsData = await dashboardService.getNotifications();
          // S'assurer que les notifications sont un tableau
          setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
        } catch (error) {
          console.error('Erreur lors du chargement des notifications:', error);
          setNotifications([]);
        }



      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // En cas d'erreur, utiliser des données par défaut
        setStatistiques([]);
        setNotifications([]);
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
              {Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map((notification) => (
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
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Aucune notification pour le moment</p>
                </div>
              )}
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
                <AdminDetails />
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

// Composant pour les détails administrateur
const AdminDetails: React.FC = () => {
  const [details, setDetails] = useState<{
    nouvellesInscriptions: number;
    coursActifs: number;
    absencesNonJustifiees: number;
    bulletinsGeneres: number;
  } | null>(null);

  useEffect(() => {
    const chargerDetails = async () => {
      try {
        const detailsData = await dashboardService.getAdminDetails();
        setDetails(detailsData);
      } catch (error) {
        console.error('Erreur lors du chargement des détails admin:', error);
      }
    };

    chargerDetails();
  }, []);

  if (!details) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Nouvelles inscriptions</p>
            <p className="text-xs text-gray-500">Cette semaine</p>
          </div>
        </div>
        <span className="text-lg font-bold text-blue-600">{details.nouvellesInscriptions}</span>
      </div>
      
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Cours actifs</p>
            <p className="text-xs text-gray-500">En cours ce semestre</p>
          </div>
        </div>
        <span className="text-lg font-bold text-green-600">{details.coursActifs}</span>
      </div>
      
      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Absences non justifiées</p>
            <p className="text-xs text-gray-500">À traiter</p>
          </div>
        </div>
        <span className="text-lg font-bold text-orange-600">{details.absencesNonJustifiees}</span>
      </div>
      
      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Bulletins générés</p>
            <p className="text-xs text-gray-500">Ce trimestre</p>
          </div>
        </div>
        <span className="text-lg font-bold text-purple-600">{details.bulletinsGeneres}</span>
      </div>
    </>
  );
};

export default TableauDeBord;