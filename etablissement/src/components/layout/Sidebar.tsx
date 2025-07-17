import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, GraduationCap } from "lucide-react";

interface MenuItem {
  titre: string;
  lien: string;
  icone: React.ReactNode;
}

interface SidebarProps {
  menu: MenuItem[];
  utilisateur: any;
  tenant: any;
  reduite?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ menu, utilisateur, tenant, reduite }) => {
  const location = useLocation();
  const libellesRole: Record<string, string> = {
    adminEcole: "Administrateur d'École",
    gestionnaire: "Gestionnaire",
    professeur: "Professeur",
    eleve: "Élève",
    parent: "Parent/Tuteur"
  };

  return (
    <aside className={`relative min-h-screen bg-white border-r border-neutral-200 flex flex-col transition-all duration-200 ${reduite ? 'w-20' : 'w-64'}`}>
      {/* Logo + titre */}
      <div className={`flex items-center gap-3 px-6 py-6 border-b border-neutral-200 ${reduite ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-primaire rounded-lg flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        {!reduite && (
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-lg text-neutral-900 truncate">
              {tenant?.nom || tenant?.idEcole || tenant?.sousDomaine}
            </h2>
            <p className="text-sm text-neutral-500 truncate">
              {libellesRole[utilisateur?.role] || utilisateur?.role}
            </p>
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
                      ? 'bg-primaire/10 text-primaire shadow-sm' 
                      : 'text-neutral-700 hover:bg-fond hover:text-primaire'
                    }
                  `}
                >
                  <span className={`transition-colors ${
                    isActive ? 'text-primaire' : 'text-neutral-500 group-hover:text-primaire'
                  }`}>
                    {item.icone}
                  </span>
                  {!reduite && <span className="truncate">{item.titre}</span>}
                  {isActive && !reduite && (
                    <div className="w-1.5 h-1.5 bg-primaire rounded-full ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Footer utilisateur */}
      <div className={`px-4 py-4 border-t border-neutral-200 ${reduite ? 'justify-center flex' : ''}`}>
        <div className={`flex items-center gap-3 px-3 py-3 rounded-lg bg-fond ${reduite ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 bg-primaire rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          {!reduite && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {utilisateur?.prenom} {utilisateur?.nom}
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