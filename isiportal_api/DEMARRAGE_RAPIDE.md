# Démarrage Rapide - ISIPortal API

## Problème CORS résolu

### 1. Démarrer le serveur Laravel

```bash
# Windows
start-server.bat

# Linux/Mac
chmod +x start-server.sh
./start-server.sh
```

### 2. Tester l'API

Ouvrez votre navigateur et allez à :
- **Test simple** : http://127.0.0.1:8000/api/ping
- **Page de test complète** : http://127.0.0.1:8000/test-api.html

### 3. Routes de test disponibles

- `GET /api/ping` - Test simple
- `GET /api/test/cors-check` - Test CORS
- `GET /api/test/eleves-list` - Liste des élèves
- `GET /api/test/create-sample-data` - Créer données de test
- `GET /api/test/notes-simple/{eleveId}` - Notes d'un élève

### 4. Si les erreurs CORS persistent

1. Vérifiez que le serveur Laravel est démarré sur le port 8000
2. Testez d'abord avec la page HTML : http://127.0.0.1:8000/test-api.html
3. Si ça marche dans la page HTML mais pas dans React, le problème vient du frontend

### 5. Créer des données de test

Visitez : http://127.0.0.1:8000/api/test/create-sample-data

Cela créera :
- Un élève de test
- Quelques notes d'exemple
- Les relations nécessaires

### 6. Vérifier les notes

Une fois les données créées, testez :
- http://127.0.0.1:8000/api/test/notes-simple/1
- Remplacez "1" par l'ID de l'élève retourné lors de la création

## Résolution des problèmes

### Erreur "Failed to fetch"
- Le serveur Laravel n'est pas démarré
- Mauvaise URL (vérifiez http://127.0.0.1:8000)

### Erreur CORS
- Middleware CORS ajouté globalement
- Headers CORS forcés sur toutes les routes de test

### Base de données
- Utilise SQLite par défaut
- Fichier : `database/database.sqlite`
- Exécutez les migrations si nécessaire : `php artisan migrate --seed`