#!/bin/bash

echo "🚀 Configuration de ISIPortal API..."

# Vérifier si Composer est installé
if ! command -v composer &> /dev/null; then
    echo "❌ Composer n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si PHP est installé
if ! command -v php &> /dev/null; then
    echo "❌ PHP n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "📦 Installation des dépendances..."
composer install

echo "🔧 Configuration de l'environnement..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Fichier .env créé"
else
    echo "⚠️  Fichier .env existe déjà"
fi

echo "🔑 Génération de la clé d'application..."
php artisan key:generate

echo "🗄️  Configuration de la base de données..."
echo "Veuillez configurer votre base de données dans le fichier .env"
echo "Puis appuyez sur Entrée pour continuer..."
read

echo "📊 Création des tables..."
php artisan migrate

echo "🌱 Peuplement de la base de données..."
php artisan db:seed

echo "🔒 Configuration des permissions..."
chmod -R 755 storage bootstrap/cache

echo "✅ Configuration terminée !"
echo ""
echo "🎉 ISIPortal API est prêt !"
echo ""
echo "📋 Informations importantes :"
echo "- URL de l'API : http://localhost:8000"
echo "- Admin : admin@isiportal.com / password123"
echo "- Gestionnaire Collège : gestionnaire.college@isiportal.com / password123"
echo "- Gestionnaire Lycée : gestionnaire.lycee@isiportal.com / password123"
echo ""
echo "🚀 Pour démarrer le serveur :"
echo "php artisan serve"
echo ""
echo "📚 Documentation : voir README.md" 