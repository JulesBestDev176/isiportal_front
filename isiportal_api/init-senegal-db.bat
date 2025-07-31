@echo off
echo Initialisation de la base de donnees pour le contexte senegalais...

echo.
echo 1. Suppression des anciennes donnees...
php artisan migrate:fresh

echo.
echo 2. Execution des seeders senegalais...
php artisan db:seed

echo.
echo 3. Creation de comptes de test supplementaires...
php artisan tinker --execute="
$parent = App\Models\User::create([
    'nom' => 'Diallo',
    'prenom' => 'Mamadou',
    'email' => 'parent@test.com',
    'password' => bcrypt('parent123'),
    'role' => 'parent',
    'actif' => true,
    'telephone' => '77 123 45 67',
    'adresse' => 'Dakar, Senegal',
    'profession' => 'Commercant'
]);

$eleve = App\Models\User::create([
    'nom' => 'Diallo',
    'prenom' => 'Aminata',
    'email' => 'eleve@test.com',
    'password' => bcrypt('eleve123'),
    'role' => 'eleve',
    'actif' => true,
    'classe_id' => 1,
    'parents_ids' => [$parent->id],
    'numero_etudiant' => 'E2024001001',
    'date_naissance' => '2010-05-15',
    'lieu_naissance' => 'Dakar, Senegal'
]);

DB::table('user_parents')->insert([
    'parent_id' => $parent->id,
    'eleve_id' => $eleve->id,
    'type_parent' => 'pere',
    'created_at' => now(),
    'updated_at' => now()
]);

echo 'Comptes de test crees avec succes';
"

echo.
echo ========================================
echo Base de donnees initialisee avec succes!
echo ========================================
echo.
echo Comptes de test disponibles:
echo - Parent: parent@test.com / parent123
echo - Eleve: eleve@test.com / eleve123
echo - Admin: admin@isiportal.com / password123
echo.
echo Demarrez le serveur avec: php artisan serve
echo.
pause