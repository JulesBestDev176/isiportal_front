# ISIPortal API

API Laravel pour la gestion d'établissement scolaire ISIPortal.

## 🚀 Installation

### Prérequis
- PHP 8.1+
- Composer
- MySQL/PostgreSQL
- Laravel 12.x

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd isiportal_api
```

2. **Installer les dépendances**
```bash
composer install
```

3. **Configuration**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configuration de la base de données**
Modifier le fichier `.env` :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=isiportal_api
DB_USERNAME=root
DB_PASSWORD=
```

5. **Migrations et Seeders**
```bash
php artisan migrate
php artisan db:seed
```

6. **Démarrer le serveur**
```bash
php artisan serve
```

## 📚 Structure de l'API

### Authentification
- **POST** `/api/auth/login` - Connexion
- **POST** `/api/auth/logout` - Déconnexion
- **GET** `/api/auth/profile` - Profil utilisateur
- **PUT** `/api/auth/profile` - Mettre à jour le profil
- **POST** `/api/auth/change-password` - Changer le mot de passe
- **POST** `/api/auth/refresh` - Rafraîchir le token

### Utilisateurs
- **GET** `/api/users` - Liste des utilisateurs
- **POST** `/api/users` - Créer un utilisateur
- **GET** `/api/users/{id}` - Détails d'un utilisateur
- **PUT** `/api/users/{id}` - Mettre à jour un utilisateur
- **DELETE** `/api/users/{id}` - Supprimer un utilisateur
- **POST** `/api/users/{id}/toggle-status` - Activer/Désactiver

### Niveaux
- **GET** `/api/niveaux` - Liste des niveaux
- **POST** `/api/niveaux` - Créer un niveau
- **GET** `/api/niveaux/{id}` - Détails d'un niveau
- **PUT** `/api/niveaux/{id}` - Mettre à jour un niveau
- **DELETE** `/api/niveaux/{id}` - Supprimer un niveau

### Matières
- **GET** `/api/matieres` - Liste des matières
- **POST** `/api/matieres` - Créer une matière
- **GET** `/api/matieres/{id}` - Détails d'une matière
- **PUT** `/api/matieres/{id}` - Mettre à jour une matière
- **DELETE** `/api/matieres/{id}` - Supprimer une matière
- **GET** `/api/matieres/niveau/{niveauId}` - Matières par niveau

### Années Scolaires
- **GET** `/api/annees-scolaires` - Liste des années scolaires
- **POST** `/api/annees-scolaires` - Créer une année scolaire
- **GET** `/api/annees-scolaires/{id}` - Détails d'une année scolaire
- **PUT** `/api/annees-scolaires/{id}` - Mettre à jour une année scolaire
- **DELETE** `/api/annees-scolaires/{id}` - Supprimer une année scolaire
- **GET** `/api/annees-scolaires/courante/active` - Année scolaire courante

### Classes
- **GET** `/api/classes` - Liste des classes
- **POST** `/api/classes` - Créer une classe
- **GET** `/api/classes/{id}` - Détails d'une classe
- **PUT** `/api/classes/{id}` - Mettre à jour une classe
- **DELETE** `/api/classes/{id}` - Supprimer une classe
- **GET** `/api/classes/niveau/{niveauId}` - Classes par niveau
- **GET** `/api/classes/{id}/eleves` - Élèves d'une classe

### Cours
- **GET** `/api/cours` - Liste des cours
- **POST** `/api/cours` - Créer un cours
- **GET** `/api/cours/{id}` - Détails d'un cours
- **PUT** `/api/cours/{id}` - Mettre à jour un cours
- **DELETE** `/api/cours/{id}` - Supprimer un cours
- **GET** `/api/cours/matiere/{matiereId}` - Cours par matière
- **GET** `/api/cours/niveau/{niveauId}` - Cours par niveau

## 🔐 Authentification

L'API utilise Laravel Sanctum pour l'authentification par token.

### Connexion
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@isiportal.com",
    "password": "password123"
  }'
```

### Utilisation du token
```bash
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

## 👥 Rôles Utilisateurs

- **administrateur** : Accès complet à toutes les fonctionnalités
- **gestionnaire** : Gestion des classes et élèves
- **professeur** : Gestion des cours et notes
- **eleve** : Consultation des notes et bulletins (non autorisé sur cette API)
- **parent** : Consultation des notes des enfants (non autorisé sur cette API)

## 📊 Données de Test

Les seeders créent automatiquement :

- 1 administrateur principal
- 2 gestionnaires (collège et lycée)
- 5 professeurs avec matières assignées
- 3 parents
- 8 classes (6ème à Terminale)
- ~200 élèves répartis dans les classes

### Comptes de test
- **Admin** : admin@isiportal.com / password123
- **Gestionnaire Collège** : gestionnaire.college@isiportal.com / password123
- **Gestionnaire Lycée** : gestionnaire.lycee@isiportal.com / password123
- **Professeurs** : voir les seeders pour les emails

## 🛠️ Développement

### Tests
```bash
php artisan test
```

### Migration de base de données
```bash
php artisan migrate:fresh --seed
```

### Générer un nouveau contrôleur
```bash
php artisan make:controller Api/NouveauController
```

## 📝 Notes

- L'API est conçue pour être utilisée avec le frontend React `etablissement`
- Les rôles `eleve` et `parent` ne sont pas autorisés sur cette API (ils auront leurs propres APIs)
- Tous les utilisateurs créés ont `doit_changer_mot_de_passe = true` par défaut
- Les tokens d'authentification expirent après 24h par défaut

## 🔧 Configuration

### Variables d'environnement importantes
```env
APP_NAME="ISIPortal API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=isiportal_api
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```
