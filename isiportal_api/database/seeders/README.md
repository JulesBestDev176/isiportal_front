# Système de Seeders ISI Portal

Ce système de seeders permet de remplir automatiquement la base de données avec des données cohérentes et réalistes pour tester l'application ISI Portal.

## Structure des Seeders

### 1. Seeders de Base (Structure)
- **AnneeScolaireSeeder** : Crée les années scolaires (2023-2024, 2024-2025, 2025-2026)
- **NiveauxSeeder** : Crée les niveaux d'études (L1, L2, L3, M1, M2)
- **MatieresSeeder** : Crée les matières par niveau avec coefficients et heures
- **BatimentsSeeder** : Crée les bâtiments du campus
- **SallesSeeder** : Crée les salles par bâtiment avec équipements

### 2. Seeders Utilisateurs
- **AdminSeeder** : Crée les comptes administrateurs
- **ProfesseursSeeder** : Crée les professeurs avec leurs spécialités

### 3. Seeders Pédagogiques
- **ClassesSeeder** : Crée les classes par niveau et filière
- **ElevesSeeder** : Crée les élèves dans les classes
- **CoursSeeder** : Crée les cours basés sur matières/niveaux
- **CreneauxSeeder** : Placeholder pour les créneaux (créés via interface)
- **NotesSeeder** : Crée des notes de test réalistes

## Utilisation

### Exécuter tous les seeders
```bash
php artisan db:seed
```

### Exécuter un seeder spécifique
```bash
php artisan db:seed --class=ElevesSeeder
```

### Réinitialiser et remplir la base
```bash
php artisan migrate:fresh --seed
```

## Comptes par Défaut

### Administrateurs
- **admin@isiportal.sn** : admin123
- **gestionnaire@isiportal.sn** : gestionnaire123  
- **directeur@isiportal.sn** : directeur123

### Professeurs
- Tous les professeurs : **prof123**
- Exemples : i.sarr@isiportal.sn, m.gueye@isiportal.sn

### Élèves
- Tous les élèves : **eleve123**
- Format email : prenom.nom.classe.numero@eleve.isiportal.sn

## Données Générées

### Structure Académique
- **3 années scolaires** (passée, active, future)
- **5 niveaux** (L1 à M2)
- **19 matières** réparties par niveau
- **5 bâtiments** avec 25 salles équipées

### Utilisateurs
- **3 administrateurs** avec rôles différents
- **12 professeurs** spécialisés par matière
- **400+ élèves** répartis dans 16 classes

### Contenu Pédagogique
- **Cours automatiques** basés sur matières/niveaux
- **Notes réalistes** avec distribution normale
- **Classes équilibrées** selon capacités

## Personnalisation

### Modifier les données
1. Éditez le seeder correspondant dans `database/seeders/`
2. Relancez le seeder : `php artisan db:seed --class=NomSeeder`

### Ajouter des données
1. Créez un nouveau seeder : `php artisan make:seeder NouveauSeeder`
2. Ajoutez-le dans `DatabaseSeeder.php`
3. Implémentez la logique de création

### Données réalistes
- Noms sénégalais authentiques
- Adresses de Dakar par quartier
- Âges cohérents par niveau
- Notes avec distribution normale
- Spécialisations professeurs réalistes

## Maintenance

### Vérifier l'intégrité
```bash
php artisan tinker
>>> User::count()
>>> Classe::count()  
>>> Cours::count()
```

### Nettoyer et recommencer
```bash
php artisan migrate:fresh
php artisan db:seed
```

## Notes Importantes

1. **Ordre d'exécution** : Les seeders sont exécutés dans l'ordre défini dans `DatabaseSeeder.php`
2. **Dépendances** : Certains seeders dépendent d'autres (ex: élèves → classes)
3. **Unicité** : Les emails et codes sont uniques
4. **Performance** : Le seeding complet prend 2-3 minutes
5. **Environnement** : À utiliser uniquement en développement/test

## Dépannage

### Erreur de clé étrangère
- Vérifiez l'ordre des seeders
- Assurez-vous que les tables parentes existent

### Données manquantes
- Vérifiez les logs Laravel
- Exécutez les seeders individuellement

### Performance lente
- Utilisez des transactions pour les gros volumes
- Désactivez temporairement les événements Eloquent