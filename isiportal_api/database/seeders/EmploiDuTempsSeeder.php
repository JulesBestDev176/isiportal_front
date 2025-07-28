<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmploiDuTemps;
use App\Models\Classe;
use App\Models\Cours;
use App\Models\AnneeScolaire;

class EmploiDuTempsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = Classe::all();
        $cours = Cours::all();
        $anneeScolaire = AnneeScolaire::where('statut', 'active')->first();

        if (!$anneeScolaire) {
            $anneeScolaire = AnneeScolaire::first();
        }

        $jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        $periodes = ['08:00-10:00', '10:15-12:15', '13:30-15:30', '15:45-17:45'];

        foreach ($classes as $classe) {
            // Créer un emploi du temps pour chaque classe
            foreach ($jours as $jour) {
                // 2-4 cours par jour
                $nombreCours = rand(2, 4);
                $coursUtilises = [];
                
                for ($i = 0; $i < $nombreCours; $i++) {
                    $coursAleatoire = $cours->random();
                    
                    // Éviter les doublons dans la même journée
                    while (in_array($coursAleatoire->id, $coursUtilises)) {
                        $coursAleatoire = $cours->random();
                    }
                    $coursUtilises[] = $coursAleatoire->id;
                    
                    EmploiDuTemps::create([
                        'classe_id' => $classe->id,
                        'cours_id' => $coursAleatoire->id,
                        'annee_scolaire_id' => $anneeScolaire->id,
                        'jour' => $jour,
                        'periode' => $periodes[$i],
                        'salle_id' => rand(1, 10), // Salles 1-10
                        'professeur_id' => $coursAleatoire->professeur_id ?? rand(1, 8),
                        'statut' => 'active',
                        'remarques' => rand(1, 100) <= 20 ? 'Remarque spéciale' : null,
                    ]);
                }
            }
        }

        $this->command->info('Emplois du temps créés avec succès !');
    }
} 