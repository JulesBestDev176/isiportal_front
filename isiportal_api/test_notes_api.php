<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Note;

// Vérifier si l'utilisateur 215 existe
$user = User::find(215);
if ($user) {
    echo "Utilisateur trouvé: {$user->nom} {$user->prenom} - Role: {$user->role}\n";
} else {
    echo "Utilisateur 215 non trouvé\n";
    exit;
}

// Vérifier les notes
$notes = Note::where('eleve_id', 215)->get();
echo "Nombre de notes trouvées: " . $notes->count() . "\n";

if ($notes->count() > 0) {
    echo "Premières notes:\n";
    foreach ($notes->take(3) as $note) {
        echo "- Note {$note->id}: {$note->note}/20 (coef: {$note->coefficient}) - {$note->type_evaluation} - Matière: {$note->matiere_id}\n";
    }
}

echo "\nTest terminé.\n"; 