<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\AnneeScolaire;

class CoursSeeder extends Seeder
{
    public function run()
    {
        $matieres = Matiere::all();
        $niveaux = Niveau::all()->keyBy('nom');
        $anneeScolaireActive = AnneeScolaire::where('statut', 'active')->first();
        
        if (!$anneeScolaireActive) {
            $this->command->error('Aucune année scolaire active trouvée');
            return;
        }

        foreach ($matieres as $matiere) {
            $niveauxIds = json_decode($matiere->niveaux_ids, true) ?? [];
            
            foreach ($niveauxIds as $niveauId) {
                $niveau = $niveaux->first(function($n) use ($niveauId) {
                    return $n->id == $niveauId;
                });
                
                if ($niveau) {
                    Cours::create([
                        'titre' => $matiere->nom . ' - ' . $niveau->nom,
                        'description' => $matiere->description,
                        'matiere_id' => $matiere->id,
                        'niveau_id' => $niveau->id,
                        'annee_scolaire_id' => $anneeScolaireActive->id,
                        'semestres_ids' => json_encode([1, 2]),
                        'statut' => 'planifie',
                        'coefficient' => $matiere->coefficient,
                        'heures_par_semaine' => $matiere->heures_par_semaine,
                        'ressources' => json_encode([]),
                        'date_creation' => now(),
                    ]);
                }
            }
        }

        $this->command->info('Cours créés avec succès!');
    }
}