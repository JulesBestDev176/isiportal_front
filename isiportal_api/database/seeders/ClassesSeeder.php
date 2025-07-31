<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classe;
use App\Models\Niveau;
use App\Models\AnneeScolaire;

class ClassesSeeder extends Seeder
{
    public function run()
    {
        $niveaux = Niveau::all()->keyBy('nom');
        $anneeScolaireActive = AnneeScolaire::where('statut', 'active')->first();
        
        if (!$anneeScolaireActive) {
            $this->command->error('Aucune année scolaire active trouvée');
            return;
        }

        $classes = [
            // Classes L1
            [
                'nom' => 'L1-INFO-A',
                'niveau' => 'L1',
                'filiere' => 'Informatique',
                'capacite_max' => 35,
                'description' => 'Licence 1 Informatique - Groupe A'
            ],
            [
                'nom' => 'L1-INFO-B',
                'niveau' => 'L1',
                'filiere' => 'Informatique',
                'capacite_max' => 35,
                'description' => 'Licence 1 Informatique - Groupe B'
            ],
            [
                'nom' => 'L1-MATH-A',
                'niveau' => 'L1',
                'filiere' => 'Mathématiques',
                'capacite_max' => 30,
                'description' => 'Licence 1 Mathématiques - Groupe A'
            ],

            // Classes L2
            [
                'nom' => 'L2-INFO-A',
                'niveau' => 'L2',
                'filiere' => 'Informatique',
                'capacite_max' => 32,
                'description' => 'Licence 2 Informatique - Groupe A'
            ],
            [
                'nom' => 'L2-INFO-B',
                'niveau' => 'L2',
                'filiere' => 'Informatique',
                'capacite_max' => 32,
                'description' => 'Licence 2 Informatique - Groupe B'
            ],
            [
                'nom' => 'L2-MATH-A',
                'niveau' => 'L2',
                'filiere' => 'Mathématiques',
                'capacite_max' => 28,
                'description' => 'Licence 2 Mathématiques - Groupe A'
            ],

            // Classes L3
            [
                'nom' => 'L3-GL-A',
                'niveau' => 'L3',
                'filiere' => 'Génie Logiciel',
                'capacite_max' => 30,
                'description' => 'Licence 3 Génie Logiciel - Groupe A'
            ],
            [
                'nom' => 'L3-GL-B',
                'niveau' => 'L3',
                'filiere' => 'Génie Logiciel',
                'capacite_max' => 30,
                'description' => 'Licence 3 Génie Logiciel - Groupe B'
            ],
            [
                'nom' => 'L3-IA-A',
                'niveau' => 'L3',
                'filiere' => 'Intelligence Artificielle',
                'capacite_max' => 25,
                'description' => 'Licence 3 Intelligence Artificielle - Groupe A'
            ],
            [
                'nom' => 'L3-RESEAUX-A',
                'niveau' => 'L3',
                'filiere' => 'Réseaux et Sécurité',
                'capacite_max' => 25,
                'description' => 'Licence 3 Réseaux et Sécurité - Groupe A'
            ],

            // Classes M1
            [
                'nom' => 'M1-MIAGE-A',
                'niveau' => 'M1',
                'filiere' => 'MIAGE',
                'capacite_max' => 25,
                'description' => 'Master 1 MIAGE - Groupe A'
            ],
            [
                'nom' => 'M1-IA-A',
                'niveau' => 'M1',
                'filiere' => 'Intelligence Artificielle',
                'capacite_max' => 20,
                'description' => 'Master 1 Intelligence Artificielle - Groupe A'
            ],
            [
                'nom' => 'M1-CYBER-A',
                'niveau' => 'M1',
                'filiere' => 'Cybersécurité',
                'capacite_max' => 20,
                'description' => 'Master 1 Cybersécurité - Groupe A'
            ],

            // Classes M2
            [
                'nom' => 'M2-MIAGE-A',
                'niveau' => 'M2',
                'filiere' => 'MIAGE',
                'capacite_max' => 22,
                'description' => 'Master 2 MIAGE - Groupe A'
            ],
            [
                'nom' => 'M2-IA-A',
                'niveau' => 'M2',
                'filiere' => 'Intelligence Artificielle',
                'capacite_max' => 18,
                'description' => 'Master 2 Intelligence Artificielle - Groupe A'
            ],
            [
                'nom' => 'M2-CYBER-A',
                'niveau' => 'M2',
                'filiere' => 'Cybersécurité',
                'capacite_max' => 18,
                'description' => 'Master 2 Cybersécurité - Groupe A'
            ]
        ];

        foreach ($classes as $classeData) {
            $niveau = $niveaux[$classeData['niveau']] ?? null;
            
            if ($niveau) {
                $classe = Classe::create([
                    'nom' => $classeData['nom'],
                    'niveau_id' => $niveau->id,
                    'niveauNom' => $niveau->nom,
                    'annee_scolaire_id' => $anneeScolaireActive->id,
                    'filiere' => $classeData['filiere'],
                    'capacite_max' => $classeData['capacite_max'],
                    'description' => $classeData['description'],
                    'statut' => 'active',
                    'date_creation' => now()
                ]);

                $this->command->info("Classe créée: {$classe->nom} ({$classeData['filiere']})");
            }
        }

        $this->command->info('Classes créées avec succès!');
    }
}