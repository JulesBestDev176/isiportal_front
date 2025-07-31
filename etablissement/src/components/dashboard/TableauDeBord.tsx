import React, { useState, useEffect, useCallback } from 'react';
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
import { professeurService } from '../../services/professeurService';
import { safeString, safeNumber, safeDate } from '../../utils/safeRender';

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

  const getProfesseurStats = async (statsData?: any) => {
    // Si les données sont déjà fournies, les utiliser directement
    if (statsData) {
      return [
        {
          titre: 'Classes comme Prof Principal',
          valeur: statsData.classes_comme_prof_principal || 0,
          icone: <GraduationCap className="w-6 h-6" />,
          couleur: 'bg-blue-500'
        },
        {
          titre: 'Cours Assignés',
          valeur: statsData.cours_assignes || 0,
          icone: <BookOpen className="w-6 h-6" />,
          couleur: 'bg-green-500'
        },
        {
          titre: 'Élèves Total',
          valeur: statsData.eleves_total || 0,
          icone: <Users className="w-6 h-6" />,
          couleur: 'bg-purple-500'
        },
        {
          titre: 'Notes Saisies',
          valeur: statsData.notes_saisies || 0,
          icone: <Clock className="w-6 h-6" />,
          couleur: 'bg-orange-500'
        }
      ];
    }

    // Fallback avec valeurs par défaut
    return [
      {
        titre: 'Classes comme Prof Principal',
        valeur: 0,
        icone: <GraduationCap className="w-6 h-6" />,
        couleur: 'bg-blue-500'
      },
      {
        titre: 'Cours Assignés',
        valeur: 0,
        icone: <BookOpen className="w-6 h-6" />,
        couleur: 'bg-green-500'
      },
      {
        titre: 'Élèves Total',
        valeur: 0,
        icone: <Users className="w-6 h-6" />,
        couleur: 'bg-purple-500'
      },
      {
        titre: 'Notes Saisies',
        valeur: 0,
        icone: <Clock className="w-6 h-6" />,
        couleur: 'bg-orange-500'
      }
    ];
  };

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        if (!utilisateur?.role) return;

        // Chargement optimisé pour les professeurs
        if (utilisateur.role === 'professeur') {
          // Utiliser le chargement parallèle pour les professeurs
          const professeurData = await professeurService.getAllDashboardData();
          const statsFinales = await getProfesseurStats(professeurData.stats);
          setStatistiques(statsFinales);
          
          // Charger les notifications en parallèle
          dashboardService.getNotifications()
            .then(notificationsData => {
              setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
            })
            .catch(error => {
              console.error('Erreur notifications:', error);
              setNotifications([]);
            });
          
          setChargement(false);
          return;
        }

        // Pour les autres rôles, utiliser l'ancien système
        let statsData: DashboardStats = {};
        let statsFinales: StatistiqueCard[] = [];
        
        // Charger les stats et notifications en parallèle
        const [statsResult, notificationsResult] = await Promise.allSettled([
          dashboardService.getDashboardStats(utilisateur.role),
          dashboardService.getNotifications()
        ]);
        
        // Traiter les statistiques
        if (statsResult.status === 'fulfilled') {
          statsData = statsResult.value;
        } else {
          console.error('Erreur stats:', statsResult.reason);
        }
        
        // Traiter les notifications
        if (notificationsResult.status === 'fulfilled') {
          setNotifications(Array.isArray(notificationsResult.value) ? notificationsResult.value : []);
        } else {
          console.error('Erreur notifications:', notificationsResult.reason);
          setNotifications([]);
        }
        
        if (utilisateur.role === 'administrateur') {
          statsFinales = [
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
          ];
        } else if (utilisateur.role === 'gestionnaire') {
          statsFinales = [
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
          ];
        }

        setStatistiques(statsFinales);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setStatistiques([]);
        setNotifications([]);
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, [utilisateur?.role]);

  const obtenirIconeNotification = useCallback((type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  }, []);

  const obtenirCouleurNotification = useCallback((type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-orange-500 bg-orange-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  }, []);

  if (chargement) {
    return (
      <div className="space-y-6">
        {/* Skeleton pour l'en-tête */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Skeleton pour les cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Chargement des données...</p>
        </div>
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
              Bonjour, {safeString(utilisateur?.prenom)} {safeString(utilisateur?.nom)}
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenue sur votre tableau de bord {safeString(utilisateur?.role)}
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
                <p className="text-sm font-medium text-gray-600">{safeString(stat.titre)}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{safeString(stat.valeur, '0')}</p>
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
                        {safeString(notification.titre, 'Notification')}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {safeString(notification.message, 'Aucun message')}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {safeDate(notification.date)}
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
                <ProfesseurActivites />
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
        
        if (detailsData && typeof detailsData === 'object') {
          setDetails({
            nouvellesInscriptions: detailsData.nouvellesInscriptions || 0,
            coursActifs: detailsData.coursActifs || 0,
            absencesNonJustifiees: detailsData.absencesNonJustifiees || 0,
            bulletinsGeneres: detailsData.bulletinsGeneres || 0
          });
        } else {
          setDetails({
            nouvellesInscriptions: 0,
            coursActifs: 0,
            absencesNonJustifiees: 0,
            bulletinsGeneres: 0
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails admin:', error);
        setDetails({
          nouvellesInscriptions: 0,
          coursActifs: 0,
          absencesNonJustifiees: 0,
          bulletinsGeneres: 0
        });
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
        <span className="text-lg font-bold text-blue-600">{safeString(details.nouvellesInscriptions, '0')}</span>
      </div>
      
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Cours actifs</p>
            <p className="text-xs text-gray-500">En cours ce semestre</p>
          </div>
        </div>
        <span className="text-lg font-bold text-green-600">{safeString(details.coursActifs, '0')}</span>
      </div>
      
      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Absences non justifiées</p>
            <p className="text-xs text-gray-500">À traiter</p>
          </div>
        </div>
        <span className="text-lg font-bold text-orange-600">{safeString(details.absencesNonJustifiees, '0')}</span>
      </div>
      
      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Bulletins générés</p>
            <p className="text-xs text-gray-500">Ce trimestre</p>
          </div>
        </div>
        <span className="text-lg font-bold text-purple-600">{safeString(details.bulletinsGeneres, '0')}</span>
      </div>
    </>
  );
};

// Composant pour les activités du professeur
const ProfesseurActivites: React.FC = () => {
  const [activites, setActivites] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerActivites = async () => {
      try {
        const notesResult = await professeurService.getNotesRecentes();
        if (notesResult.success && notesResult.data) {
          const activitesFormatees = notesResult.data.slice(0, 3).map((note: any, index: number) => ({
            id: note.id,
            texte: `Note saisie pour ${note.eleve}`,
            temps: 'Il y a ' + (index + 1) * 30 + ' min',
            couleur: index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
          }));
          setActivites(activitesFormatees);
        }
      } catch (error) {
        console.error('Erreur activités professeur:', error);
        setActivites([
          { id: 1, texte: 'Notes saisies', temps: 'Il y a 30 min', couleur: 'bg-blue-500' },
          { id: 2, texte: 'Appel effectué', temps: 'Il y a 2 heures', couleur: 'bg-green-500' },
          { id: 3, texte: 'Cours planifié', temps: 'Hier', couleur: 'bg-purple-500' }
        ]);
      } finally {
        setChargement(false);
      }
    };

    chargerActivites();
  }, []);

  if (chargement) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex items-center space-x-3">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {activites.map((activite) => (
        <div key={activite.id} className="flex items-center space-x-3">
          <div className={`w-2 h-2 ${activite.couleur} rounded-full`}></div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">{activite.texte}</p>
            <p className="text-xs text-gray-500">{activite.temps}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default TableauDeBord;