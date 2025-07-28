import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/ContexteAuth';
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Archive,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const libellesRole: Record<string, string> = {
  administrateur: "Administrateur",
  gestionnaire: "Gestionnaire", 
  professeur: "Professeur"
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { utilisateur, deconnexion } = useAuth();
  const [sidebarReduite, setSidebarReduite] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Charger les notifications
  useEffect(() => {
    if (utilisateur?.id) {
      loadNotifications();
    }
  }, [utilisateur]);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getNotifications(utilisateur!.id);
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  if (!utilisateur) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleDeconnexion = async () => {
    try {
      await deconnexion();
      // Redirection vers la page de connexion après déconnexion
      window.location.href = '/connexion';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar fixe à gauche */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar 
          reduit={sidebarReduite} 
          onToggle={() => setSidebarReduite((v) => !v)} 
        />
      </div>
      {/* Wrapper pour header + main, décalé à droite du sidebar */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-200"
        style={{ marginLeft: sidebarReduite ? '5rem' : '16rem' }}
      >
        {/* Header sticky en haut de la partie droite */}
        <div className="sticky top-0 z-30">
          <Header
            utilisateur={utilisateur}
            tenant={{ nom: 'Établissement Scolaire' }}
            libellesRole={libellesRole}
            notifications={notifications}
            deconnexion={handleDeconnexion}
            sidebarRéduite={sidebarReduite}
            onToggleSidebar={() => setSidebarReduite((v) => !v)}
            onMenuToggle={() => {}}
            showMobileMenu={false}
          />
        </div>
        
        {/* Contenu principal */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;