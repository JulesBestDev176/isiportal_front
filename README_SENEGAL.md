# ISI Portal - Version Sénégal

## Description
Système de gestion scolaire adapté au contexte éducatif sénégalais avec des données réalistes pour les lycées et collèges du Sénégal.

## Structure du Projet
- `isiportal_api/` - Backend Laravel avec API REST
- `parent_eleve/` - Frontend React pour parents et élèves
- `etablissement/` - Frontend React pour l'administration

## Installation et Configuration

### 1. Backend (Laravel API)

```bash
cd isiportal_api

# Installer les dépendances
composer install

# Configurer l'environnement
cp .env.example .env
# Modifier .env avec vos paramètres de base de données

# Générer la clé d'application
php artisan key:generate

# Initialiser la base de données avec les données sénégalaises
./init-senegal-db.bat
# Ou manuellement :
# php artisan migrate:fresh
# php artisan db:seed

# Démarrer le serveur
php artisan serve
```

### 2. Frontend Parent/Élève

```bash
cd parent_eleve

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

## Comptes de Test

### Parents
- **Email**: `mamadou.diallo@email.com` | **Mot de passe**: `password123`
- **Email**: `awa.sy@email.com` | **Mot de passe**: `password123`
- **Email**: `parent@test.com` | **Mot de passe**: `parent123`

### Élèves
- **Email**: `eleve@test.com` | **Mot de passe**: `eleve123`
- **Email**: `aminata.diallo1@eleve.isiportal.com` | **Mot de passe**: `eleve123`

### Administrateurs
- **Email**: `admin@isiportal.com` | **Mot de passe**: `password123`

### Professeurs
- **Email**: `aminata.diop@isiportal.com` | **Mot de passe**: `password123`
- **Email**: `moussa.ndiaye@isiportal.com` | **Mot de passe**: `password123`

## Données Générées

### Niveaux Scolaires
- **Collège**: 6ème, 5ème, 4ème, 3ème (préparation BFEM)
- **Lycée**: 2nde, 1ère L/S, Terminale L/S (préparation Baccalauréat)

### Matières
- Mathématiques, Français, Histoire-Géographie
- Anglais, Arabe, Espagnol
- Physique-Chimie, SVT, EPS
- Arts Plastiques, Éducation Musicale, Technologie
- Philosophie (Terminales), Instruction Civique et Morale
- Sciences Économiques et Sociales

### Utilisateurs
- **Élèves**: Noms sénégalais authentiques (Diallo, Ndiaye, Fall, Sow, etc.)
- **Parents**: Professions locales, adresses sénégalaises
- **Professeurs**: Personnel enseignant avec spécialisations

### Notes et Évaluations
- Devoirs, Compositions, Interrogations, TP
- Notes réalistes avec appréciations en français
- Coefficients conformes au système éducatif sénégalais

## Fonctionnalités

### Pour les Parents
- Suivi de la scolarité des enfants
- Consultation des notes et bulletins
- Communication avec l'établissement
- Notifications en temps réel

### Pour les Élèves
- Consultation des notes personnelles
- Emploi du temps
- Ressources pédagogiques
- Messagerie

### Pour l'Administration
- Gestion des utilisateurs
- Création des classes et emplois du temps
- Suivi des performances
- Génération de rapports

## API Endpoints

### Authentification
- `POST /api/parent-eleve/login` - Connexion parents/élèves
- `GET /api/parent-eleve/check-auth` - Vérification authentification
- `POST /api/parent-eleve/logout` - Déconnexion

### Données
- `GET /api/notes/eleve/{id}` - Notes d'un élève
- `GET /api/notifications` - Notifications
- `GET /api/dashboard/stats/{role}` - Statistiques dashboard

## Technologies Utilisées

### Backend
- Laravel 10
- MySQL
- Laravel Sanctum (authentification)
- Seeders avec données sénégalaises

### Frontend
- React 18 avec TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Router

## Développement

### Ajouter des Données
1. Modifier les seeders dans `database/seeders/`
2. Exécuter `php artisan db:seed --class=NomDuSeeder`

### Personnaliser l'Interface
1. Modifier les composants dans `src/components/`
2. Adapter les styles Tailwind selon les besoins

### Étendre l'API
1. Créer de nouveaux contrôleurs dans `app/Http/Controllers/Api/`
2. Ajouter les routes dans `routes/api.php`

## Support
Pour toute question ou problème, consultez la documentation Laravel et React, ou contactez l'équipe de développement.

## Licence
Projet éducatif - Groupe ISI Sénégal