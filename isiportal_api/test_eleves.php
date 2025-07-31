<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Test des élèves de la classe 1:\n";

$eleves = DB::table('eleve_classe')
    ->join('users', 'eleve_classe.eleve_id', '=', 'users.id')
    ->where('eleve_classe.classe_id', 1)
    ->select([
        'users.id',
        'users.nom',
        'users.prenom',
        'eleve_classe.moyenne_annuelle',
        'eleve_classe.statut'
    ])
    ->get();

echo "Nombre d'élèves: " . $eleves->count() . "\n";

foreach($eleves as $eleve) {
    echo $eleve->prenom . ' ' . $eleve->nom . ' - Moyenne: ' . $eleve->moyenne_annuelle . "\n";
} 