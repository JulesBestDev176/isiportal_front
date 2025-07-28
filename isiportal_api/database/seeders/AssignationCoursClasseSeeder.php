<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AssignationCoursClasse;
use App\Models\Cours;
use App\Models\Classe;
use App\Models\AnneeScolaire;

class AssignationCoursClasseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cours = Cours::all();
        $classes = Classe::all();
        $anneeScolaire = AnneeScolaire::where('statut', 'active')->first();

        if (!$anneeScolaire) {
            $anneeScolaire = AnneeScolaire::first();
        }

        foreach ($cours as $cours) {
            // Assigner chaque cours à 1-3 classes
            $nombreClasses = rand(1, 3);
            $classesAleatoires = $classes->random($nombreClasses);
            
            foreach ($classesAleatoires as $classe) {
                // Vérifier que le cours et la classe ont le même niveau
                if ($cours->niveau_id === $classe->niveau_id) {
                    AssignationCoursClasse::create([
                        'cours_id' => $cours->id,
                        'classe_id' => $classe->id,
                        'annee_scolaire_id' => $anneeScolaire->id,
                        'heures_par_semaine' => $cours->heures_par_semaine,
                        'statut' => 'active',
                        'remarques' => rand(1, 100) <= 20 ? 'Remarque spéciale' : null,
                    ]);
                }
            }
        }

        $this->command->info('Assignations cours-classe créées avec succès !');
    }
} 