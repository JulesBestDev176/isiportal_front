<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserMatiereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assigner les matières aux professeurs existants
        $assignations = [
            // Sophie Bernard - Mathématiques
            ['user_id' => 1, 'matiere_id' => 1],
            
            // Marie Dupont - Français
            ['user_id' => 2, 'matiere_id' => 2],
            
            // Isabelle Moreau - Histoire-Géographie
            ['user_id' => 3, 'matiere_id' => 3],
            
            // Pierre Leroy - Anglais
            ['user_id' => 4, 'matiere_id' => 4],
            
            // Michel Petit - Physique-Chimie
            ['user_id' => 5, 'matiere_id' => 7],
            
            // Catherine Roux - Sciences de la Vie et de la Terre
            ['user_id' => 6, 'matiere_id' => 8],
            
            // Jean Martin - Éducation Physique et Sportive
            ['user_id' => 7, 'matiere_id' => 9],
            
            // Paul Durand - Philosophie
            ['user_id' => 8, 'matiere_id' => 13],
        ];

        foreach ($assignations as $assignation) {
            // Vérifier si l'assignation existe déjà
            $exists = DB::table('user_matieres')
                ->where('user_id', $assignation['user_id'])
                ->where('matiere_id', $assignation['matiere_id'])
                ->exists();

            if (!$exists) {
                DB::table('user_matieres')->insert([
                    'user_id' => $assignation['user_id'],
                    'matiere_id' => $assignation['matiere_id'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                $this->command->info("Assignation créée: Professeur ID {$assignation['user_id']} -> Matière ID {$assignation['matiere_id']}");
            } else {
                $this->command->info("Assignation déjà existante: Professeur ID {$assignation['user_id']} -> Matière ID {$assignation['matiere_id']}");
            }
        }

        $this->command->info('Assignations des matières aux professeurs terminées.');
    }
} 