<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Creneau;
use App\Models\Salle;
use App\Models\Classe;
use App\Models\User;
use App\Models\Cours;

class CreneauSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $salles = Salle::all();
        $classes = Classe::all();
        $professeurs = User::where('role', 'professeur')->get();
        $cours = Cours::all();

        $jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        $periodes = [
            ['08:00', '10:00'],
            ['10:15', '12:15'],
            ['13:30', '15:30'],
            ['15:45', '17:45'],
        ];

        foreach ($classes as $classe) {
            foreach ($jours as $jour) {
                // 2-4 créneaux par jour par classe
                $nombreCreneaux = rand(2, 4);
                
                for ($i = 0; $i < $nombreCreneaux; $i++) {
                    $periode = $periodes[$i % count($periodes)];
                    $coursAleatoire = $cours->random();
                    $professeur = $professeurs->random();
                    $salle = $salles->random();
                    
                    Creneau::create([
                        'jour' => $jour,
                        'heure_debut' => $periode[0],
                        'heure_fin' => $periode[1],
                        'salle_id' => $salle->id,
                        'classe_id' => $classe->id,
                        'professeur_id' => $professeur->id,
                        'cours_id' => $coursAleatoire->id,
                        'statut' => 'planifie',
                    ]);
                }
            }
        }

        $this->command->info('Créneaux créés avec succès !');
    }
} 