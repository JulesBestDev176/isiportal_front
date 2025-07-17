# etablissement

Plateforme SaaS multi-tenant pour la gestion d'établissements scolaires.

## Stack
- React + TypeScript
- TailwindCSS (config avancée)
- Architecture multi-tenant, sécurité, communication intégrée

## Structure du projet

```
etablissement/
├── public/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   └── charts/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Lancer le projet

```bash
npm install
npm start
```

## Fonctionnalités principales
- Gestion multi-tenant (plusieurs écoles)
- Système de rôles (SuperAdmin, Admin, Manager, Prof, Élève, Parent)
- Communication intégrée (messagerie, notifications, etc.)
- Sécurité avancée (isolation des données, audit, 2FA, SSO)
- Analytics et reporting

## À venir
- Exemples de types, contextes, services, composants, etc.
