<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "=== Vérification des utilisateurs ===\n";
echo "Total users: " . User::count() . "\n";
echo "\nUsers by role:\n";

$usersByRole = User::selectRaw('role, count(*) as count')
    ->groupBy('role')
    ->get();

foreach ($usersByRole as $item) {
    echo $item->role . ': ' . $item->count . "\n";
}

echo "\nSample users:\n";
$sampleUsers = User::select('id', 'nom', 'prenom', 'email', 'role', 'actif')
    ->limit(10)
    ->get();

foreach ($sampleUsers as $user) {
    echo "ID: {$user->id}, Nom: {$user->nom} {$user->prenom}, Role: {$user->role}, Actif: {$user->actif}\n";
}

echo "\nGestionnaires:\n";
$gestionnaires = User::where('role', 'gestionnaire')->get();
foreach ($gestionnaires as $user) {
    echo "ID: {$user->id}, Nom: {$user->nom} {$user->prenom}, Email: {$user->email}, Actif: {$user->actif}\n";
}

echo "\nAdministrateurs:\n";
$administrateurs = User::where('role', 'administrateur')->get();
foreach ($administrateurs as $user) {
    echo "ID: {$user->id}, Nom: {$user->nom} {$user->prenom}, Email: {$user->email}, Actif: {$user->actif}\n";
} 