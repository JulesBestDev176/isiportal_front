<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cours;
use App\Models\Note;
use App\Models\AnneeScolaire;

class NotesSeeder extends Seeder
{
    public function run()
    {
        $anneeScolaireActive = AnneeScolaire::where('statut', 'active')->first();
        
        if (!$anneeScolaireActive) {
            $this->command->error('Aucune année scolaire active trouvée');
            return;
        }

        // Récupérer tous les élèves
        $eleves = User::where('role', 'eleve')->get();
        
        if ($eleves->isEmpty()) {
            $this->command->error('Aucun élève trouvé');
            return;
        }

        $typesEvaluation = ['devoir1', 'devoir2', 'examen'];
        $appreciations = [
            'Excellent travail, continuez ainsi',
            'Très bon niveau, quelques points à améliorer',
            'Travail satisfaisant, peut mieux faire',
            'Résultats moyens, plus d\'efforts nécessaires',
            'Travail insuffisant, révisions recommandées',
            'Bon niveau général',
            'Progrès notable depuis le début',
            'Participation active en cours',
            'Méthode de travail à revoir',
            'Très bonne compréhension des concepts'
        ];

        $notesCreees = 0;

        foreach ($eleves as $eleve) {
            // Récupérer les cours du niveau de l'élève
            $cours = Cours::whereHas('niveau', function($query) use ($eleve) {
                $query->where('id', $eleve->classe->niveau_id ?? 0);
            })->get();

            foreach ($cours as $coursItem) {
                foreach ([1, 2] as $semestre) {
                    foreach ($typesEvaluation as $type) {
                        // Générer une note réaliste selon une distribution normale
                        $note = $this->genererNoteRealiste();
                        
                        // Choisir une appréciation selon la note
                        $appreciation = $this->getAppreciationByNote($note, $appreciations);

                        Note::create([
                            'eleve_id' => $eleve->id,
                            'cours_id' => $coursItem->id,
                            'matiere_id' => $coursItem->matiere_id,
                            'professeur_id' => 1, // À ajuster selon les assignations
                            'annee_scolaire_id' => $anneeScolaireActive->id,
                            'semestre' => $semestre,
                            'type_evaluation' => $type,
                            'note' => $note,
                            'note_sur' => 20,
                            'coefficient' => $this->getCoefficientByType($type),
                            'appreciation' => $appreciation,
                            'date_evaluation' => now()->subDays(rand(1, 90)),
                            'statut' => 'validee'
                        ]);

                        $notesCreees++;
                    }
                }
            }
        }

        $this->command->info(\"Notes créées: {$notesCreees}\");
        $this->command->info('Notes de test créées avec succès!');
    }

    private function genererNoteRealiste()
    {
        // Distribution normale centrée sur 12 avec écart-type de 3
        $moyenne = 12;
        $ecartType = 3;
        
        // Génération d'une note selon une distribution normale
        $u1 = mt_rand() / mt_getrandmax();
        $u2 = mt_rand() / mt_getrandmax();
        
        $z = sqrt(-2 * log($u1)) * cos(2 * pi() * $u2);
        $note = $moyenne + $ecartType * $z;
        
        // Limiter entre 0 et 20
        $note = max(0, min(20, round($note, 2)));
        
        return $note;
    }

    private function getAppreciationByNote($note, $appreciations)
    {
        if ($note >= 16) {
            return $appreciations[0]; // Excellent
        } elseif ($note >= 14) {
            return $appreciations[1]; // Très bon
        } elseif ($note >= 12) {
            return $appreciations[2]; // Satisfaisant
        } elseif ($note >= 10) {
            return $appreciations[3]; // Moyen
        } else {
            return $appreciations[4]; // Insuffisant
        }
    }

    private function getCoefficientByType($type)
    {
        return match($type) {
            'devoir1' => 1,
            'devoir2' => 1,
            'examen' => 2,
            default => 1
        };
    }
}