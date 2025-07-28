<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ressource;
use App\Models\Cours;
use App\Models\User;
use App\Models\AnneeScolaire;

class RessourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cours = Cours::all();
        $professeurs = User::where('role', 'professeur')->get();
        $anneeScolaire = AnneeScolaire::where('statut', 'active')->first();

        if (!$anneeScolaire) {
            $anneeScolaire = AnneeScolaire::first();
        }

        $types = ['document', 'video', 'lien', 'image', 'presentation'];
        $noms = [
            'Cours complet',
            'Exercices corrigés',
            'Fiche de révision',
            'Vidéo explicative',
            'Diaporama',
            'Devoir à la maison',
            'Corrigé du contrôle',
            'Ressource complémentaire'
        ];

        foreach ($cours as $cours) {
            // Créer 2-5 ressources par cours
            $nombreRessources = rand(2, 5);
            
            for ($i = 0; $i < $nombreRessources; $i++) {
                $professeur = $professeurs->random();
                
                Ressource::create([
                    'cours_id' => $cours->id,
                    'professeur_id' => $professeur->id,
                    'annee_scolaire_id' => $anneeScolaire->id,
                    'nom' => $noms[array_rand($noms)] . ' ' . ($i + 1),
                    'type' => $types[array_rand($types)],
                    'url' => 'https://example.com/ressource_' . rand(1, 1000) . '.pdf',
                    'description' => 'Description de la ressource ' . ($i + 1),
                    'statut' => 'active',
                    'date_creation' => now()->subDays(rand(1, 30)),
                ]);
            }
        }

        $this->command->info('Ressources créées avec succès !');
    }
} 