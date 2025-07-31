<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Http\Controllers\Api\BulletinController;

try {
    echo "Test du contrôleur BulletinController...\n";
    
    $controller = new BulletinController();
    
    // Test de la méthode getNotesEleve
    echo "Test de getNotesEleve pour l'élève 215...\n";
    $response = $controller->getNotesEleve(215);
    
    echo "Réponse reçue:\n";
    echo json_encode($response->getData(), JSON_PRETTY_PRINT) . "\n";
    
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
} 