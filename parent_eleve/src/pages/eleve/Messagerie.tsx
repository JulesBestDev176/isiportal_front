import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Calendar, AlertCircle, Info, Clock, 
  FileText, Download, Eye, Star, Trash2,
  Filter, Search, CheckCircle, X, 
  GraduationCap, Target, Paperclip
} from "lucide-react";

// Types
interface Notification {
  id: string;
  titre: string;
  contenu: string;
  type: "info" | "urgent" | "evenement" | "rappel" | "devoir";
  expediteur: string;
  roleExpediteur: "professeur" | "gestionnaire" | "direction";
  matiere?: string;
  dateEnvoi: string;
  dateExpiration?: string;
  lu: boolean;
  epingle: boolean;
  pieceJointe?: {
    nom: string;
    url: string;
    type: string;
    taille: string;
  };
  classe: string;
  priorite: "normale" | "haute" | "critique";
}

// Données mockées - notifications pour la classe 3ème A
const notificationsMock: Notification[] = [
  {
    id: "1",
    titre: "Contrôle de mathématiques",
    contenu: "Contrôle prévu vendredi 26 juillet sur le chapitre des équations du premier degré. Pensez à réviser les exercices 12 à 18.",
    type: "devoir",
    expediteur: "M. Dubois",
    roleExpediteur: "professeur",
    matiere: "Mathématiques",
    dateEnvoi: "2025-07-22T08:30:00",
    dateExpiration: "2025-07-26T08:00:00",
    lu: false,
    epingle: true,
    classe: "3ème A",
    priorite: "haute"
  },
  {
    id: "2",
    titre: "Sortie pédagogique au musée",
    contenu: "Sortie au Musée des Sciences prévue le 30 juillet. Autorisation parentale obligatoire. RDV à 8h devant le collège.",
    type: "evenement",
    expediteur: "Mme Leroy",
    roleExpediteur: "professeur",
    matiere: "Sciences",
    dateEnvoi: "2025-07-20T14:15:00",
    lu: true,
    epingle: false,
    pieceJointe: {
      nom: "autorisation_sortie.pdf",
      url: "#",
      type: "pdf",
      taille: "245 KB"
    },
    classe: "3ème A",
    priorite: "normale"
  },
  {
    id: "3",
    titre: "Réunion parents-professeurs",
    contenu: "Réunion d'information pour les parents de 3ème A le jeudi 1er août à 18h30 en salle polyvalente. Présence souhaitée des élèves.",
    type: "evenement",
    expediteur: "Direction",
    roleExpediteur: "direction",
    dateEnvoi: "2025-07-19T16:00:00",
    lu: true,
    epingle: false,
    classe: "3ème A",
    priorite: "normale"
  },
  {
    id: "4",
    titre: "URGENT: Modification d'emploi du temps",
    contenu: "Le cours de français de demain 23 juillet est annulé. Remplacement par une permanence en salle d'étude de 10h à 11h.",
    type: "urgent",
    expediteur: "Mme Martin",
    roleExpediteur: "gestionnaire",
    dateEnvoi: "2025-07-22T15:45:00",
    dateExpiration: "2025-07-23T11:00:00",
    lu: false,
    epingle: true,
    classe: "3ème A",
    priorite: "critique"
  },
  {
    id: "5",
    titre: "Rappel: Remise des manuels",
    contenu: "N'oubliez pas de rapporter vos manuels scolaires avant la fin de la semaine. Point de collecte: CDI de 8h à 17h.",
    type: "rappel",
    expediteur: "Mme Dupuis",
    roleExpediteur: "gestionnaire",
    dateEnvoi: "2025-07-21T09:00:00",
    dateExpiration: "2025-07-25T17:00:00",
    lu: true,
    epingle: false,
    classe: "3ème A",
    priorite: "normale"
  },
  {
    id: "6",
    titre: "Nouvelle ressource disponible",
    contenu: "Nouveaux exercices de révision disponibles sur l'espace numérique pour préparer le brevet blanc.",
    type: "info",
    expediteur: "M. Dubois", 
    roleExpediteur: "professeur",
    matiere: "Mathématiques",
    dateEnvoi: "2025-07-18T12:30:00",
    lu: true,
    epingle: false,
    classe: "3ème A",
    priorite: "normale"
  }
];

// Composant Notification Item
const NotificationItem: React.FC<{
  notification: Notification;
  onToggleLu: (id: string) => void;
  onToggleEpingle: (id: string) => void;
  onSupprimer: (id: string) => void;
  onVoir: (notification: Notification) => void;
}> = ({ notification, onToggleLu, onToggleEpingle, onSupprimer, onVoir }) => {
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "evenement": return <Calendar className="w-5 h-5 text-purple-500" />;
      case "rappel": return <Clock className="w-5 h-5 text-orange-500" />;
      case "devoir": return <GraduationCap className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "urgent": return "Urgent";
      case "evenement": return "Événement";
      case "rappel": return "Rappel";
      case "devoir": return "Devoir";
      default: return "Info";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "urgent": return "bg-red-100 text-red-700";
      case "evenement": return "bg-purple-100 text-purple-700";
      case "rappel": return "bg-orange-100 text-orange-700";
      case "devoir": return "bg-blue-100 text-blue-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case "critique": return "border-l-red-500";
      case "haute": return "border-l-orange-500";
      default: return "border-l-blue-500";
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffTime = now.getTime() - notifDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `Il y a ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return notifDate.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
  };

  const estExpiree = notification.dateExpiration && new Date(notification.dateExpiration) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border-l-4 ${getPrioriteColor(notification.priorite)} border-r border-t border-b border-neutral-200 hover:shadow-md transition-all duration-200 ${
        !notification.lu ? 'bg-primary-50/30' : ''
      } ${estExpiree ? 'opacity-60' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getTypeIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-neutral-900 ${!notification.lu ? 'text-primary-900' : ''}`}>
                    {notification.titre}
                  </h3>
                  {!notification.lu && (
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  )}
                  {notification.epingle && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(notification.type)}`}>
                    {getTypeLabel(notification.type)}
                  </span>
                  {notification.matiere && (
                    <span className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-full">
                      {notification.matiere}
                    </span>
                  )}
                  {estExpiree && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      Expirée
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleLu(notification.id)}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                  title={notification.lu ? "Marquer comme non lu" : "Marquer comme lu"}
                >
                  {notification.lu ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
                
                <button
                  onClick={() => onToggleEpingle(notification.id)}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                  title={notification.epingle ? "Désépingler" : "Épingler"}
                >
                  <Star className={`w-4 h-4 ${notification.epingle ? 'text-yellow-500 fill-current' : 'text-neutral-500'}`} />
                </button>
                
                <button
                  onClick={() => onSupprimer(notification.id)}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>

            <p className="text-neutral-700 text-sm mb-3 line-clamp-2">
              {notification.contenu}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{notification.expediteur}</span>
                  <span className="text-neutral-400">•</span>
                  <span>{formatDate(notification.dateEnvoi)}</span>
                </div>
                
                {notification.dateExpiration && !estExpiree && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      Expire le {new Date(notification.dateExpiration).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {notification.pieceJointe && (
                  <div className="flex items-center gap-1 text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                    <Paperclip className="w-3 h-3" />
                    <span>{notification.pieceJointe.nom}</span>
                  </div>
                )}
                
                <button
                  onClick={() => onVoir(notification)}
                  className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                >
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant Modal de détails
const ModalNotificationDetails: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "evenement": return <Calendar className="w-6 h-6 text-purple-500" />;
      case "rappel": return <Clock className="w-6 h-6 text-orange-500" />;
      case "devoir": return <GraduationCap className="w-6 h-6 text-blue-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon(notification.type)}
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{notification.titre}</h2>
                <p className="text-neutral-600">
                  {notification.expediteur} • {notification.classe}
                  {notification.matiere && ` • ${notification.matiere}`}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Contenu</h3>
            <p className="text-neutral-700 leading-relaxed">{notification.contenu}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-neutral-900 mb-1">Date d'envoi</h4>
              <p className="text-neutral-600">
                {new Date(notification.dateEnvoi).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {notification.dateExpiration && (
              <div>
                <h4 className="font-medium text-neutral-900 mb-1">Date d'expiration</h4>
                <p className="text-orange-600">
                  {new Date(notification.dateExpiration).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>

          {notification.pieceJointe && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Pièce jointe</h4>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <FileText className="w-8 h-8 text-neutral-500" />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{notification.pieceJointe.nom}</p>
                  <p className="text-sm text-neutral-600">{notification.pieceJointe.taille}</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Composant principal
const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsMock);
  const [filtreType, setFiltreType] = useState<string>("tous");
  const [filtreLu, setFiltreLu] = useState<string>("tous");
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [notificationSelectionnee, setNotificationSelectionnee] = useState<Notification | null>(null);

  // Filtrage des notifications
  const notificationsFiltrees = notifications.filter(notification => {
    const matchTexte = notification.titre.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      notification.contenu.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      notification.expediteur.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchType = filtreType === "tous" || notification.type === filtreType;
    const matchLu = filtreLu === "tous" || 
                    (filtreLu === "lu" && notification.lu) ||
                    (filtreLu === "non_lu" && !notification.lu);
    
    return matchTexte && matchType && matchLu;
  });

  // Tri des notifications: épinglées en premier, puis par date
  const notificationsTries = notificationsFiltrees.sort((a, b) => {
    if (a.epingle && !b.epingle) return -1;
    if (!a.epingle && b.epingle) return 1;
    return new Date(b.dateEnvoi).getTime() - new Date(a.dateEnvoi).getTime();
  });

  const handleToggleLu = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lu: !notif.lu } : notif
      )
    );
  };

  const handleToggleEpingle = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, epingle: !notif.epingle } : notif
      )
    );
  };

  const handleSupprimer = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleVoirDetails = (notification: Notification) => {
    setNotificationSelectionnee(notification);
    // Marquer comme lu si pas encore lu
    if (!notification.lu) {
      handleToggleLu(notification.id);
    }
  };

  const marquerToutesCommeLues = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, lu: true }))
    );
  };

  const nombreNonLues = notifications.filter(n => !n.lu).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-neutral-600 mt-1">
            Notifications de votre classe • 3ème A
            {nombreNonLues > 0 && (
              <span className="ml-2 px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                {nombreNonLues} non {nombreNonLues > 1 ? 'lues' : 'lue'}
              </span>
            )}
          </p>
        </div>
        
        {nombreNonLues > 0 && (
          <button
            onClick={marquerToutesCommeLues}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher dans les notifications..."
                value={rechercheTexte}
                onChange={(e) => setRechercheTexte(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="tous">Tous les types</option>
              <option value="urgent">Urgent</option>
              <option value="devoir">Devoirs</option>
              <option value="evenement">Événements</option>
              <option value="rappel">Rappels</option>
              <option value="info">Informations</option>
            </select>

            <select
              value={filtreLu}
              onChange={(e) => setFiltreLu(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="tous">Toutes</option>
              <option value="non_lu">Non lues</option>
              <option value="lu">Lues</option>
            </select>

            {(rechercheTexte || filtreType !== "tous" || filtreLu !== "tous") && (
              <button
                onClick={() => {
                  setRechercheTexte("");
                  setFiltreType("tous");
                  setFiltreLu("tous");
                }}
                className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {notificationsTries.length > 0 ? (
          notificationsTries.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onToggleLu={handleToggleLu}
              onToggleEpingle={handleToggleEpingle}
              onSupprimer={handleSupprimer}
              onVoir={handleVoirDetails}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
            <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              {rechercheTexte || filtreType !== "tous" || filtreLu !== "tous" 
                ? "Aucune notification trouvée"
                : "Aucune notification"
              }
            </h3>
            <p className="text-neutral-500">
              {rechercheTexte || filtreType !== "tous" || filtreLu !== "tous"
                ? "Essayez de modifier vos critères de recherche."
                : "Vous recevrez ici les notifications de votre classe."
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      <AnimatePresence>
        {notificationSelectionnee && (
          <ModalNotificationDetails
            notification={notificationSelectionnee}
            onClose={() => setNotificationSelectionnee(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;