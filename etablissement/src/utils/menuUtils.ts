// Utilitaires pour la gestion des menus selon les rôles

import { MenuItem } from '../models/ui.model';
import { Role } from '../models/roles.model';

export const getMenuForRole = (role: Role): MenuItem[] => {
  const baseMenu: MenuItem[] = [
    {
      titre: 'Tableau de bord',
      lien: '/dashboard',
      icone: '📊',
      sousMenus: []
    },
    {
      titre: 'Mon profil',
      lien: '/profil',
      icone: '👤',
      sousMenus: []
    }
  ];

  switch (role) {
    case 'administrateur':
      return [
        ...baseMenu,
        {
          titre: 'Utilisateurs',
          lien: '/utilisateurs',
          icone: '👥',
          sousMenus: []
        },
        {
          titre: 'Classes',
          lien: '/classes',
          icone: '🏫',
          sousMenus: []
        },
        {
          titre: 'Cours',
          lien: '/cours',
          icone: '📚',
          sousMenus: []
        },
        {
          titre: 'Messagerie',
          lien: '/messagerie',
          icone: '📢',
          sousMenus: []
        },
        {
          titre: 'Analytics',
          lien: '/analytics',
          icone: '📈',
          sousMenus: []
        }
      ];

    case 'gestionnaire':
      return [
        ...baseMenu,
        {
          titre: 'Utilisateurs',
          lien: '/utilisateurs',
          icone: '👥',
          sousMenus: []
        },
        {
          titre: 'Classes',
          lien: '/classes',
          icone: '🏫',
          sousMenus: []
        },
        {
          titre: 'Messagerie',
          lien: '/messagerie',
          icone: '📢',
          sousMenus: []
        },
        {
          titre: 'Analytics',
          lien: '/analytics',
          icone: '📈',
          sousMenus: []
        }
      ];

    case 'professeur':
      return [
        ...baseMenu,
        {
          titre: 'Mes cours',
          lien: '/cours',
          icone: '📚',
          sousMenus: []
        },
        {
          titre: 'Messagerie',
          lien: '/messagerie',
          icone: '📢',
          sousMenus: []
        }
      ];

    default:
      return baseMenu;
  }
};