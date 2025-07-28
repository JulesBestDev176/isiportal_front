<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Absence;
use App\Models\User;
use App\Models\Cours;
use App\Models\AnneeScolaire;

class AbsenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eleves = User::where('role', 'eleve')->get();
        $cours = Cours::all();
        $anneeScolaire = AnneeScolaire::where('statut', 'active')->first();

        if (!$anneeScolaire) {
            $anneeScolaire = AnneeScolaire::first();
        }

        $periodes = ['matin', 'apres_midi', 'journee'];
        $motifs = [
            'Maladie',
            'Rendez-vous médical',
            'Problème de transport',
            'Raison familiale',
            'Activité sportive',
            'Voyage scolaire',
            'Absence justifiée',
            'Absence non justifiée'
        ];

        foreach ($eleves as $eleve) {
            // Générer 2-5 absences par élève
            $nombreAbsences = rand(2, 5);
            
            for ($i = 0; $i < $nombreAbsences; $i++) {
                $coursAleatoire = $cours->random();
                $justifiee = rand(1, 100) <= 70; // 70% de chance d'être justifiée
                
                Absence::create([
                    'eleve_id' => $eleve->id,
                    'cours_id' => $coursAleatoire->id,
                    'annee_scolaire_id' => $anneeScolaire->id,
                    'date_absence' => now()->subDays(rand(1, 90)),
                    'periode' => $periodes[array_rand($periodes)],
                    'justifiee' => $justifiee,
                    'motif' => $justifiee ? $motifs[array_rand($motifs)] : 'Absence non justifiée',
                    'justificatif' => $justifiee ? 'justificatif_' . rand(1, 100) . '.pdf' : null,
                    'commentaire' => rand(1, 100) <= 30 ? 'Commentaire du professeur' : null,
                    'notifiee_parent' => rand(1, 100) <= 80, // 80% de chance d'être notifiée
                ]);
            }
        }

        $this->command->info('Absences créées avec succès !');
    }
} 