import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { notificationService, NotificationData } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';
import { 
  Send, 
  Search, 
  Filter, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic, 
  Phone, 
  Video, 
  Info, 
  Trash2, 
  Archive, 
  Star, 
  Reply, 
  Forward, 
  Edit, 
  Eye, 
  EyeOff, 
  Download, 
  Share, 
  Bookmark, 
  Flag, 
  Clock, 
  Calendar, 
  User, 
  Users, 
  MessageSquare, 
  Bell, 
  Settings, 
  Plus,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen
} from 'lucide-react';
import { Contact, NotificationLocale, ContactEtendu } from '../../models/communication.model';

// Fonctions pour charger les données depuis les services
const loadContactsFromService = async () => {
  try {
    const response = await adminService.getUsers({ page: 1, limit: 100 });
    if (response.success && response.data) {
      return response.data.map((user: any) => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        email: user.email,
        statut: "en_ligne" as const,
        derniereConnexion: new Date().toISOString(),
        dernierMessage: "",
        heureMessage: "",
        classe: "",
        matiere: ""
      })) as ContactEtendu[];
    }
    return [];
  } catch (error) {
    console.error('Erreur lors du chargement des contacts:', error);
    return [];
  }
};

const loadNotificationsFromService = async () => {
  try {
    const notifications = await notificationService.getNotifications();
    return notifications;
  } catch (error) {
    console.error('Erreur lors du chargement des notifications:', error);
    return [];
  }
};

// Composant pour créer une notification
const CreerNotification: React.FC<{
  onCreer: (data: { titre: string; contenu: string; type: string; destinataireRoles: string[] }) => void;
  onAnnuler: () => void;
  roleUtilisateur?: string;
}> = ({ onCreer, onAnnuler, roleUtilisateur }) => {
  const { utilisateur } = useAuth();
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [type, setType] = useState<string>("info");
  const [destinataireRoles, setDestinataireRoles] = useState<("administrateur" | "gestionnaire" | "professeur" | "eleve" | "parent")[]>([]);


  const typesNotification = [
    { value: "info", label: "Information", icon: Info, couleur: "blue" },
    { value: "warning", label: "Avertissement", icon: AlertCircle, couleur: "orange" },
    { value: "success", label: "Succès", icon: CheckCircle, couleur: "green" },
    { value: "error", label: "Erreur", icon: AlertCircle, couleur: "red" }
  ];

  const groupesDestinataires = [
    { value: "gestionnaire", label: "Gestionnaires", icon: Users, couleur: "blue" },
    { value: "professeur", label: "Professeurs", icon: BookOpen, couleur: "green" },
    { value: "eleve", label: "Élèves", icon: User, couleur: "yellow" },
    { value: "parent", label: "Parents", icon: User, couleur: "orange" }
  ].filter(groupe => {
    const roleUser = utilisateur?.role;
    
    // Règles de permissions:
    // admin: gestionnaire, professeur, parent
    // gestionnaire: professeur, eleve, parent  
    // professeur: eleve
    if (roleUser === "administrateur") {
      return ['gestionnaire', 'professeur', 'parent'].includes(groupe.value);
    }
    if (roleUser === "gestionnaire") {
      return ['professeur', 'eleve', 'parent'].includes(groupe.value);
    }
    if (roleUser === "professeur") {
      return groupe.value === "eleve";
    }
    
    return false;
  });

  const toggleDestinataire = (groupe: string) => {
    setDestinataireRoles(prev => 
      prev.includes(groupe as any)
        ? prev.filter(d => d !== groupe)
        : [...prev, groupe as any]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titre.trim() || !contenu.trim() || destinataireRoles.length === 0) return;

    onCreer({
      titre: titre.trim(),
      contenu: contenu.trim(),
      type,
      destinataireRoles
    });

    // Reset form
    setTitre("");
    setContenu("");
    setType("info");
    setDestinataireRoles([]);
  };

  const getBadgeColor = (role: string) => {
    switch (role) {
      case "administrateur": return "bg-purple-100 text-purple-800";
      case "gestionnaire": return "bg-blue-100 text-blue-800";
      case "professeur": return "bg-green-100 text-green-800";
      case "eleve": return "bg-yellow-100 text-yellow-800";
      case "parent": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-neutral-900">Nouvelle notification</h3>
        <button 
          onClick={onAnnuler}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Titre de la notification
          </label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Entrez le titre..."
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Type de notification
          </label>
          <div className="grid grid-cols-3 gap-3">
            {typesNotification.map((typeNotif) => (
              <button
                key={typeNotif.value}
                type="button"
                onClick={() => setType(typeNotif.value as NotificationLocale["type"])}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  type === typeNotif.value
                    ? `border-${typeNotif.couleur}-500 bg-${typeNotif.couleur}-50 text-${typeNotif.couleur}-700`
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <typeNotif.icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">{typeNotif.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Destinataires */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Destinataires
          </label>
          <div className="space-y-2">
            {groupesDestinataires.map((groupe) => (
              <button
                key={groupe.value}
                type="button"
                onClick={() => toggleDestinataire(groupe.value)}
                className={`w-full p-3 border rounded-lg text-left transition-colors flex items-center gap-3 ${
                  destinataireRoles.includes(groupe.value as any)
                    ? `border-${groupe.couleur}-500 bg-${groupe.couleur}-50`
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <groupe.icon className="w-5 h-5" />
                <span className="font-medium">{groupe.label}</span>
                {destinataireRoles.includes(groupe.value as any) && (
                  <CheckCircle2 className="w-5 h-5 ml-auto text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Contenu de la notification
          </label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Rédigez votre message..."
            required
          />
        </div>



        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onAnnuler}
            className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!titre.trim() || !contenu.trim() || destinataireRoles.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Envoyer
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant pour afficher une notification
const CarteNotification: React.FC<{
  notification: NotificationData;
  onSupprimer: (id: string) => void;
  onMarquerLue: (id: string) => void;
}> = ({ notification, onSupprimer, onMarquerLue }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "error": return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "success": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "system": return <Settings className="w-5 h-5 text-gray-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning": return "bg-orange-50 border-orange-200";
      case "error": return "bg-red-50 border-red-200";
      case "success": return "bg-green-50 border-green-200";
      case "system": return "bg-gray-50 border-gray-200";
      default: return "bg-blue-50 border-blue-200";
    }
  };

  const getBadgeColor = (dest: string) => {
    const colors = {
      professeur: "bg-blue-100 text-blue-700",
      gestionnaire: "bg-green-100 text-green-700"
    };
    return colors[dest as keyof typeof colors] || "bg-neutral-100 text-neutral-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg border-2 ${getTypeColor(notification.type)}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getTypeIcon(notification.type)}
          <div>
            <h3 className="font-semibold text-neutral-900">{notification.titre}</h3>
            <p className="text-sm text-neutral-600">
              `Envoyée le ${formatDate(notification.date_creation)}`
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!notification.est_envoyee && !notification.lue && (
            <button
              onClick={() => onMarquerLue(notification.id)}
              className="p-2 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Marquer comme lue"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onSupprimer(notification.id)}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-neutral-700 mb-4">{notification.contenu}</p>

      {/* Expéditeur ou Destinataires */}
      {notification.est_envoyee ? (
        <div className="text-sm text-neutral-600">
          Envoyée à: {notification.destinataire_roles ? notification.destinataire_roles.join(', ') : 'Destinataires spécifiques'}
        </div>
      ) : notification.expediteur && (
        <div className="text-sm text-neutral-600">
          De: {notification.expediteur.prenom} {notification.expediteur.nom}
        </div>
      )}

      {/* Statut */}
      <div className="flex items-center justify-between text-sm text-neutral-600 mt-4">
        <div className="flex items-center gap-2">
          {notification.est_envoyee ? (
            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              Envoyée
            </span>
          ) : (
            <span className={`px-2 py-1 rounded-full text-xs ${
              notification.lue ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {notification.lue ? 'Lue' : 'Non lue'}
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs ${
            notification.priorite === 'urgente' ? 'bg-red-100 text-red-700' :
            notification.priorite === 'haute' ? 'bg-orange-100 text-orange-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {notification.priorite}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Composant principal
const Messagerie: React.FC = () => {
  const { utilisateur } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [contacts, setContacts] = useState<ContactEtendu[]>([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [filtreType, setFiltreType] = useState<string>("tous");

  useEffect(() => {
    const fetchData = async () => {
      const [notificationsData, contactsData] = await Promise.all([
        loadNotificationsFromService(),
        loadContactsFromService()
      ]);
      setNotifications(notificationsData);
      setContacts(contactsData);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // Rafraîchir toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  const creerNotification = async (data: { titre: string; contenu: string; type: string; destinataireRoles: string[] }) => {
    try {
      const notificationData = {
        titre: data.titre,
        contenu: data.contenu,
        type: data.type as 'info' | 'warning' | 'error' | 'success' | 'system',
        priorite: (data.type === 'error' ? 'haute' : data.type === 'warning' ? 'normale' : 'basse') as 'basse' | 'normale' | 'haute' | 'urgente',
        destinataire_roles: data.destinataireRoles
      };
      
      const response = await notificationService.createNotification(notificationData);
      if (response.success) {
        const updatedNotifications = await loadNotificationsFromService();
        setNotifications(updatedNotifications);
        setAfficherFormulaire(false);
      } else {
        console.error('Erreur lors de la création de la notification:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  };

  const supprimerNotification = async (id: string) => {
    try {
      const success = await notificationService.deleteNotification(id);
      if (success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        console.error('Erreur lors de la suppression de la notification');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  const marquerCommeLue = async (id: string) => {
    try {
      const success = await notificationService.markAsRead(id);
      if (success) {
        setNotifications(prev => prev.map(n => 
          n.id === id ? { ...n, lue: true, date_lecture: new Date().toISOString() } : n
        ));
      } else {
        console.error('Erreur lors du marquage de la notification');
      }
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const notificationsFiltrees = notifications.filter(notification => {
    if (filtreType === "tous") return true;
    return notification.type === filtreType;
  });

  const typesFiltre = [
    { value: "tous", label: "Toutes", count: notifications.length },
    { value: "info", label: "Informations", count: notifications.filter(n => n.type === "info").length },
    { value: "warning", label: "Avertissements", count: notifications.filter(n => n.type === "warning").length },
    { value: "success", label: "Succès", count: notifications.filter(n => n.type === "success").length },
    { value: "error", label: "Erreurs", count: notifications.filter(n => n.type === "error").length },
    { value: "system", label: "Système", count: notifications.filter(n => n.type === "system").length }
  ];

  return (
    <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Messagerie</h1>
            <p className="text-neutral-600 mt-1">
              Gérez vos notifications et communications
            </p>
          </div>
          <button
            onClick={() => setAfficherFormulaire(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle notification
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          {typesFiltre.map((type) => (
            <button
              key={type.value}
              onClick={() => setFiltreType(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtreType === type.value
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>

        {/* Formulaire de création */}
        {afficherFormulaire && (
          <CreerNotification
            onCreer={creerNotification}
            onAnnuler={() => setAfficherFormulaire(false)}
            roleUtilisateur={utilisateur?.role}
          />
        )}

        {/* Liste des notifications */}
        <div className="space-y-4">
          {notificationsFiltrees.length > 0 ? (
            notificationsFiltrees.map((notification) => (
              <CarteNotification
                key={notification.id}
                notification={notification}
                onSupprimer={supprimerNotification}
                onMarquerLue={marquerCommeLue}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-neutral-600 mb-4">
                {filtreType === "tous" 
                  ? "Vous n'avez pas encore créé de notifications."
                  : `Aucune notification de type "${typesFiltre.find(t => t.value === filtreType)?.label}".`
                }
              </p>
              <button
                onClick={() => setAfficherFormulaire(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer une notification
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default Messagerie;