import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, AlertCircle, Info, Clock, 
  FileText, Eye, Star, Trash2,
  Search, CheckCircle, X, 
  GraduationCap, Send, Loader2, Plus
} from "lucide-react";

interface Message {
  id: number;
  titre: string;
  contenu: string;
  type: string;
  type_libelle: string;
  type_couleur: string;
  priorite: string;
  priorite_libelle: string;
  priorite_couleur: string;
  lue: boolean;
  statut_lecture: string;
  date_creation: string;
  date_lecture?: string;
  expediteur?: {
    id: number;
    nom: string;
    prenom: string;
    nom_complet: string;
    role: string;
  };
}

interface Contact {
  id: number | string;
  nom: string;
  prenom: string;
  nom_complet: string;
  role: string;
}

interface ApiResponse {
  messages: Message[];
  eleve: {
    id: number;
    nom: string;
    prenom: string;
    nom_complet: string;
    classe: {
      id: number;
      nom: string;
      niveau: {
        id: number;
        nom: string;
      };
    };
  };
  contacts: {
    professeurs: Contact[];
    administration: Contact[];
  };
  statistiques: {
    total_messages: number;
    messages_non_lus: number;
    messages_lus: number;
  };
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    <span className="ml-2 text-neutral-600">Chargement des messages...</span>
  </div>
);

const MessageItem: React.FC<{
  message: Message;
  onToggleLu: (id: number) => void;
  onVoir: (message: Message) => void;
}> = ({ message, onToggleLu, onVoir }) => {
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "error": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "system": return <GraduationCap className="w-5 h-5 text-gray-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case "urgente": return "border-l-red-500";
      case "haute": return "border-l-orange-500";
      case "normale": return "border-l-blue-500";
      default: return "border-l-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border-l-4 ${getPrioriteColor(message.priorite)} border-r border-t border-b border-neutral-200 hover:shadow-md transition-all duration-200 ${
        !message.lue ? 'bg-primary-50/30' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getTypeIcon(message.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-neutral-900 ${!message.lue ? 'text-primary-900' : ''}`}>
                    {message.titre}
                  </h3>
                  {!message.lue && (
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${message.type_couleur}-100 text-${message.type_couleur}-700`}>
                    {message.type_libelle}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${message.priorite_couleur}-100 text-${message.priorite_couleur}-700`}>
                    {message.priorite_libelle}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleLu(message.id)}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                  title={message.lue ? "Marquer comme non lu" : "Marquer comme lu"}
                >
                  {message.lue ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-neutral-700 text-sm mb-3 line-clamp-2">
              {message.contenu}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {message.expediteur?.nom_complet || 'Système'}
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span>{message.date_creation}</span>
                </div>
              </div>

              <button
                onClick={() => onVoir(message)}
                className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              >
                Voir détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MessageModal: React.FC<{
  message: Message;
  onClose: () => void;
}> = ({ message, onClose }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="w-6 h-6 text-orange-500" />;
      case "error": return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "success": return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "system": return <GraduationCap className="w-6 h-6 text-gray-500" />;
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
              {getTypeIcon(message.type)}
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{message.titre}</h2>
                <p className="text-neutral-600">
                  {message.expediteur?.nom_complet || 'Système'} • {message.date_creation}
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
            <h3 className="font-semibold text-neutral-900 mb-2">Message</h3>
            <p className="text-neutral-700 leading-relaxed">{message.contenu}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-neutral-900 mb-1">Type</h4>
              <p className="text-neutral-600">{message.type_libelle}</p>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-1">Priorité</h4>
              <p className="text-neutral-600">{message.priorite_libelle}</p>
            </div>
          </div>

          {message.date_lecture && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-1">Lu le</h4>
              <p className="text-neutral-600">{message.date_lecture}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const NouveauMessageModal: React.FC<{
  contacts: Contact[];
  onClose: () => void;
  onEnvoyer: (destinataire: string, titre: string, contenu: string, priorite: string) => void;
}> = ({ contacts, onClose, onEnvoyer }) => {
  const [destinataire, setDestinataire] = useState("");
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [priorite, setPriorite] = useState("normale");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinataire || !titre || !contenu) return;
    
    setLoading(true);
    await onEnvoyer(destinataire, titre, contenu, priorite);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-2xl"
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Nouveau message</h2>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Destinataire
            </label>
            <select
              value={destinataire}
              onChange={(e) => setDestinataire(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Sélectionner un destinataire</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.nom_complet} ({contact.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Objet
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Priorité
            </label>
            <select
              value={priorite}
              onChange={(e) => setPriorite(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="basse">Basse</option>
              <option value="normale">Normale</option>
              <option value="haute">Haute</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Message
            </label>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Envoyer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Messagerie: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtreType, setFiltreType] = useState<string>("tous");
  const [filtreLu, setFiltreLu] = useState<string>("tous");
  const [rechercheTexte, setRechercheTexte] = useState("");
  const [messageSelectionne, setMessageSelectionne] = useState<Message | null>(null);
  const [showNouveauMessage, setShowNouveauMessage] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/parent-eleve/mes-messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleLu = async (messageId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`http://localhost:8000/api/parent-eleve/messages/${messageId}/lire`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Rafraîchir les données
      fetchMessages();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const handleEnvoyerMessage = async (destinataireId: string, titre: string, contenu: string, priorite: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('http://localhost:8000/api/parent-eleve/messages/envoyer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinataire_id: destinataireId,
          titre,
          contenu,
          priorite
        }),
      });
      
      // Rafraîchir les données
      fetchMessages();
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur: {error}</div>;
  if (!data) return <div className="text-center py-12">Aucune donnée disponible</div>;

  // Filtrage des messages
  const messagesFiltres = data.messages.filter(message => {
    const matchTexte = message.titre.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      message.contenu.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchType = filtreType === "tous" || message.type === filtreType;
    const matchLu = filtreLu === "tous" || 
                    (filtreLu === "lu" && message.lue) ||
                    (filtreLu === "non_lu" && !message.lue);
    
    return matchTexte && matchType && matchLu;
  });

  const tousLesContacts = [...data.contacts.professeurs, ...data.contacts.administration];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Messagerie</h1>
          <p className="text-neutral-600 mt-1">
            {data.eleve.nom_complet} - Classe {data.eleve.classe.nom}
            {data.statistiques.messages_non_lus > 0 && (
              <span className="ml-2 px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                {data.statistiques.messages_non_lus} non lu{data.statistiques.messages_non_lus > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        
        <button
          onClick={() => setShowNouveauMessage(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau message
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Total messages</p>
              <p className="text-2xl font-bold text-blue-900">{data.statistiques.total_messages}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-orange-600">Non lus</p>
              <p className="text-2xl font-bold text-orange-900">{data.statistiques.messages_non_lus}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Lus</p>
              <p className="text-2xl font-bold text-green-900">{data.statistiques.messages_lus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher dans les messages..."
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
              <option value="info">Information</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
              <option value="success">Succès</option>
              <option value="system">Système</option>
            </select>

            <select
              value={filtreLu}
              onChange={(e) => setFiltreLu(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="tous">Tous</option>
              <option value="non_lu">Non lus</option>
              <option value="lu">Lus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="space-y-3">
        {messagesFiltres.length > 0 ? (
          messagesFiltres.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onToggleLu={handleToggleLu}
              onVoir={setMessageSelectionne}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
            <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">Aucun message trouvé</h3>
            <p className="text-neutral-500">
              {rechercheTexte || filtreType !== "tous" || filtreLu !== "tous"
                ? "Essayez de modifier vos critères de recherche."
                : "Vous recevrez ici vos messages et notifications."
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {messageSelectionne && (
          <MessageModal
            message={messageSelectionne}
            onClose={() => setMessageSelectionne(null)}
          />
        )}
        {showNouveauMessage && (
          <NouveauMessageModal
            contacts={tousLesContacts}
            onClose={() => setShowNouveauMessage(false)}
            onEnvoyer={handleEnvoyerMessage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messagerie;