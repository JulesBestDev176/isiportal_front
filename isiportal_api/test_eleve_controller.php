<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Test du contrôleur EleveController:\n";

try {
    $controller = new \App\Http\Controllers\Api\EleveController();
    $result = $controller->getElevesByClasse(1);
    
    echo "Résultat:\n";
    echo json_encode($result, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
} 