<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;

class AjouterMatieresSeeder extends Seeder
{
    public function run()
    {
        $matieres = [
            [
                'nom' => 'Informatique',
                'code' => 'INFO',
                'coefficient' => 2.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [3,4,5,6,7]
            ],
            [
                'nom' => 'Arabe',
                'code' => 'ARAB',
                'coefficient' => 2.00,
                'heures_par_semaine' => 3,
                'statut' => 'active',
                'niveaux_ids' => [1,2,3,4,5,6,7]
            ],
            [
                'nom' => 'Économie',
                'code' => 'ECO',
                'coefficient' => 3.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [5,6,7]
            ]
        ];

        foreach ($matieres as $matiere) {
            Matiere::create($matiere);
            echo "Matière créée: {$matiere['nom']}\n";
        }

        echo "Total matières: " . Matiere::count() . "\n";
    }
}