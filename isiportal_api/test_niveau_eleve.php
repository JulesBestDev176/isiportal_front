<?php

require_once 'vendor/autoload.php';

// Charger l'application Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Http\Controllers\Api\EleveController;

echo "=== Test de getNiveauEleve ===\n";

try {
    $controller = new EleveController();
    
    // Test avec l'élève 215 (qui existe dans les données de test)
    $result = $controller->getNiveauEleve(215);
    
    echo "Résultat:\n";
    echo json_encode($result->getData(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    echo "\n";
    
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
} 