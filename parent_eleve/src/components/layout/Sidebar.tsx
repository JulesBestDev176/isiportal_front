import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Users, MessageSquare, GraduationCap, User } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';

const getMenu = (role: string) => {
  if (role === 'eleve') {
    return [
      { titre: 'Tableau de bord', lien: '/dashboard', icone: <Home className="w-5 h-5" /> },
      { titre: 'Mes cours', lien: '/cours', icone: <BookOpen className="w-5 h-5" /> },
      { titre: 'Bulletins', lien: '/bulletins', icone: <BookOpen className="w-5 h-5" /> },
      { titre: 'Messagerie', lien: '/messagerie', icone: <MessageSquare className="w-5 h-5" /> }
    ];
  }
  if (role === 'parent') {
    return [
      { titre: 'Tableau de bord', lien: '/dashboard', icone: <Home className="w-5 h-5" /> },
      { titre: 'Mes enfants', lien: '/enfants', icone: <Users className="w-5 h-5" /> },
      { titre: 'Messagerie', lien: '/messagerie', icone: <MessageSquare className="w-5 h-5" /> }
    ];
  }
  return [];
};

interface SidebarProps {
  reduit: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ reduit, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;
  const utilisateur = user;
  const tenant = { nom: 'Portail Scolaire' };
  const menu = getMenu(utilisateur.role);

  return (
    <aside className={`relative min-h-screen bg-white border-r border-neutral-200 flex flex-col transition-all duration-200 ${reduit ? 'w-20' : 'w-64'}`}>
      {/* Logo + titre */}
      <div className={`flex items-center gap-3 px-6 py-6 border-b border-neutral-200 ${reduit ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        {!reduit && (
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-lg text-neutral-900 truncate">
                {utilisateur?.role === 'eleve' ? 'Élève' : utilisateur?.role === 'parent' ? 'Parent/Tuteur' : ''}
            </h2>
            
          </div>
        )}
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menu.map((item) => {
            const isActive = location.pathname === item.lien;
            return (
              <li key={item.lien}>
                <Link
                  to={item.lien}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary/10 text-primary shadow-sm' 
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary'
                    }
                  `}
                >
                  <span className={`transition-colors ${
                    isActive ? 'text-primary' : 'text-neutral-500 group-hover:text-primary'
                  }`}>
                    {item.icone}
                  </span>
                  {!reduit && <span className="truncate">{item.titre}</span>}
                  {isActive && !reduit && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Footer utilisateur */}
      <div className={`px-4 py-4 border-t border-neutral-200 ${reduit ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 px-3 py-3 rounded-lg bg-neutral-50 ${reduit ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          {!reduit && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-neutral-900 truncate">
                {utilisateur?.email}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {utilisateur?.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;