<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "Test de connexion à la base de données...\n";
    
    // Test de connexion
    $result = DB::select('SELECT 1 as test');
    echo "Connexion OK\n";
    
    // Vérifier les notes
    $notes = DB::table('notes')->where('eleve_id', 215)->get();
    echo "Nombre de notes trouvées: " . $notes->count() . "\n";
    
    if ($notes->count() > 0) {
        echo "Premières notes:\n";
        foreach ($notes->take(3) as $note) {
            echo "- Note {$note->id}: {$note->note}/20 (coef: {$note->coefficient}) - {$note->type_evaluation} - Matière: {$note->matiere_id}\n";
        }
    }
    
    // Vérifier l'utilisateur
    $user = DB::table('users')->where('id', 215)->first();
    if ($user) {
        echo "Utilisateur trouvé: {$user->nom} {$user->prenom} - Role: {$user->role}\n";
    } else {
        echo "Utilisateur 215 non trouvé\n";
    }
    
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
} 