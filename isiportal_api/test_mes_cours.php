<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Classe;
use App\Models\Niveau;
use App\Models\Matiere;
use App\Models\Cours;
use App\Models\AnneeScolaire;
use App\Models\AssignationCoursClasse;
use App\Models\Note;
use Illuminate\Support\Facades\DB;

// Charger la configuration Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test de l'API Mes Cours ===\n\n";

try {
    // 1. Vérifier la structure de la base de données
    echo "1. Vérification de la structure de la base de données...\n";
    
    $tables = ['users', 'classes', 'niveaux', 'matieres', 'cours', 'annees_scolaires', 'assignations_cours_classe', 'notes'];
    foreach ($tables as $table) {
        $exists = DB::getSchemaBuilder()->hasTable($table);
        echo "   - Table $table: " . ($exists ? "✓ Existe" : "✗ Manquante") . "\n";
    }
    
    // 2. Créer des données de test si nécessaire
    echo "\n2. Création des données de test...\n";
    
    // Année scolaire
    $anneeScolaire = AnneeScolaire::firstOrCreate([
        'nom' => '2024-2025'
    ], [
        'date_debut' => '2024-09-01',
        'date_fin' => '2025-06-30',
        'statut' => 'active'
    ]);
    echo "   - Année scolaire: {$anneeScolaire->nom}\n";
    
    // Niveau
    $niveau = Niveau::firstOrCreate([
        'nom' => 'Terminale S'
    ], [
        'cycle' => 'Secondaire',
        'ordre' => 12
    ]);
    echo "   - Niveau: {$niveau->nom}\n";
    
    // Classe
    $classe = Classe::firstOrCreate([
        'nom' => 'TS1'
    ], [
        'niveau_id' => $niveau->id,
        'annee_scolaire_id' => $anneeScolaire->id,
        'effectif_max' => 35,
        'statut' => 'active'
    ]);
    echo "   - Classe: {$classe->nom}\n";
    
    // Matières
    $matieres = [
        ['nom' => 'Mathématiques', 'code' => 'MATH', 'coefficient' => 7],
        ['nom' => 'Physique-Chimie', 'code' => 'PC', 'coefficient' => 6],
        ['nom' => 'SVT', 'code' => 'SVT', 'coefficient' => 6],
        ['nom' => 'Français', 'code' => 'FR', 'coefficient' => 4],
    ];
    
    $matieresCreees = [];
    foreach ($matieres as $matiereData) {
        $matiere = Matiere::firstOrCreate([
            'nom' => $matiereData['nom']
        ], $matiereData);
        $matieresCreees[] = $matiere;
        echo "   - Matière: {$matiere->nom}\n";
    }
    
    // Professeur
    $professeur = User::firstOrCreate([
        'email' => 'prof.math@isiportal.com'
    ], [
        'nom' => 'Dubois',
        'prenom' => 'Jean',
        'role' => 'professeur',
        'password' => bcrypt('password123'),
        'actif' => true
    ]);
    echo "   - Professeur: {$professeur->prenom} {$professeur->nom}\n";
    
    // Élève de test
    $eleve = User::firstOrCreate([
        'email' => 'eleve.test@isiportal.com'
    ], [
        'nom' => 'Martin',
        'prenom' => 'Pierre',
        'role' => 'eleve',
        'password' => bcrypt('password123'),
        'classe_id' => $classe->id,
        'actif' => true
    ]);
    echo "   - Élève: {$eleve->prenom} {$eleve->nom} (Classe: {$classe->nom})\n";
    
    // Cours
    $coursCreees = [];
    foreach ($matieresCreees as $matiere) {
        $cours = Cours::firstOrCreate([
            'titre' => "Cours de {$matiere->nom} - TS1",
            'matiere_id' => $matiere->id
        ], [
            'description' => "Cours de {$matiere->nom} pour la classe de Terminale S",
            'niveau_id' => $niveau->id,
            'annee_scolaire_id' => $anneeScolaire->id,
            'statut' => 'en_cours',
            'coefficient' => $matiere->coefficient,
            'heures_par_semaine' => rand(2, 6)
        ]);
        
        // Assigner le professeur au cours
        $cours->professeurs()->syncWithoutDetaching([$professeur->id]);
        
        // Créer l'assignation cours-classe
        AssignationCoursClasse::firstOrCreate([
            'cours_id' => $cours->id,
            'classe_id' => $classe->id
        ], [
            'annee_scolaire_id' => $anneeScolaire->id,
            'heures_par_semaine' => $cours->heures_par_semaine,
            'statut' => 'active'
        ]);
        
        $coursCreees[] = $cours;
        echo "   - Cours: {$cours->titre}\n";
        
        // Créer quelques notes pour l'élève
        for ($i = 1; $i <= rand(2, 4); $i++) {
            Note::firstOrCreate([
                'eleve_id' => $eleve->id,
                'cours_id' => $cours->id,
                'matiere_id' => $matiere->id,
                'type_evaluation' => "Devoir $i"
            ], [
                'annee_scolaire_id' => $anneeScolaire->id,
                'semestre' => rand(1, 2),
                'note' => rand(8, 20),
                'coefficient' => 1.0,
                'appreciation' => 'Bon travail',
                'date_evaluation' => now()->subDays(rand(1, 30))
            ]);
        }
    }
    
    // 3. Tester l'API
    echo "\n3. Test de l'API...\n";
    
    // Simuler l'authentification
    auth()->login($eleve);
    
    $eleveCoursService = new \App\Services\EleveCoursService();
    
    // Test du service
    $cours = $eleveCoursService->getCoursOptimises($eleve);
    echo "   - Nombre de cours récupérés: " . $cours->count() . "\n";
    
    $statistiques = $eleveCoursService->getStatistiquesNotes($eleve, $cours);
    echo "   - Statistiques calculées pour " . count($statistiques) . " cours\n";
    
    $coursFormates = $eleveCoursService->formaterCours($cours, $statistiques);
    echo "   - Cours formatés: " . $coursFormates->count() . "\n";
    
    $statsGenerales = $eleveCoursService->calculerStatistiquesGenerales($coursFormates);
    echo "   - Moyenne générale: " . ($statsGenerales['moyenne_generale'] ?? 'N/A') . "\n";
    
    // 4. Afficher un exemple de cours
    echo "\n4. Exemple de cours formaté:\n";
    if ($coursFormates->isNotEmpty()) {
        $premierCours = $coursFormates->first();
        echo "   - Titre: {$premierCours['titre']}\n";
        echo "   - Matière: {$premierCours['matiere']['nom']}\n";
        echo "   - Professeur: " . ($premierCours['professeur']['nom_complet'] ?? 'Non assigné') . "\n";
        echo "   - Moyenne: " . ($premierCours['moyenne'] ?? 'Pas de notes') . "\n";
        echo "   - Nombre de notes: {$premierCours['nombre_notes']}\n";
    }
    
    echo "\n✓ Test terminé avec succès!\n";
    echo "\nPour tester l'API via HTTP:\n";
    echo "POST /api/parent-eleve/login\n";
    echo "{\n";
    echo "  \"email\": \"eleve.test@isiportal.com\",\n";
    echo "  \"password\": \"password123\"\n";
    echo "}\n\n";
    echo "Puis:\n";
    echo "GET /api/parent-eleve/mes-cours\n";
    echo "Authorization: Bearer {token}\n";
    
} catch (Exception $e) {
    echo "✗ Erreur: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}