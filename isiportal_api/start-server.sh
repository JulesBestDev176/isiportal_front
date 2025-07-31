#!/bin/bash
echo "Démarrage du serveur Laravel ISIPortal..."
echo

# Nettoyer le cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Démarrer le serveur
echo "Serveur démarré sur http://127.0.0.1:8000"
echo "Page de test: http://127.0.0.1:8000/test-api.html"
echo
php artisan serve --host=127.0.0.1 --port=8000