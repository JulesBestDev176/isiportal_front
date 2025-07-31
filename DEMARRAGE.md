# Guide de Démarrage - ISI Portal Sénégal

## Étapes pour démarrer le projet

### 1. Démarrer le Backend Laravel

Ouvrez un terminal dans le dossier `isiportal_api` et exécutez :

```bash
cd isiportal_api

# Initialiser la base de données (première fois seulement)
./init-senegal-db.bat

# Démarrer le serveur Laravel
php artisan serve
```

Le serveur sera accessible sur `http://localhost:8000`

### 2. Démarrer le Frontend React

Ouvrez un NOUVEAU terminal dans le dossier `parent_eleve` et exécutez :

```bash
cd parent_eleve

# Installer les dépendances (première fois seulement)
npm install

# Démarrer le serveur React
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

### 3. Tester la Connexion

Utilisez ces comptes de test :

**Parents :**
- Email: `parent@test.com` | Mot de passe: `parent123`
- Email: `mamadou.diallo@email.com` | Mot de passe: `password123`

**Élèves :**
- Email: `eleve@test.com` | Mot de passe: `eleve123`

## Vérification

1. Vérifiez que le serveur Laravel fonctionne : `http://localhost:8000/api/ping`
2. Vérifiez que le frontend React fonctionne : `http://localhost:3000`

## Problèmes Courants

- **"Route not found"** : Le serveur Laravel n'est pas démarré
- **"Connection refused"** : Vérifiez que les ports 8000 et 3000 sont libres
- **Erreur de base de données** : Exécutez `./init-senegal-db.bat`

## Structure des Dossiers

```
isiportal_front/
├── isiportal_api/          # Backend Laravel (port 8000)
├── parent_eleve/           # Frontend React (port 3000)
├── etablissement/          # Frontend Admin (non utilisé)
└── README_SENEGAL.md       # Documentation complète
```