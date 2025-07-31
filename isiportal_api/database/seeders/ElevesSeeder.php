<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Classe;
use App\Models\AnneeScolaire;
use Illuminate\Support\Facades\Hash;

class ElevesSeeder extends Seeder
{
    public function run()
    {
        // Récupérer l'année scolaire active
        $anneeScolaireActive = AnneeScolaire::where('statut', 'active')->first();
        
        if (!$anneeScolaireActive) {
            $this->command->error('Aucune année scolaire active trouvée');
            return;
        }

        // Récupérer toutes les classes
        $classes = Classe::all();
        
        if ($classes->isEmpty()) {
            $this->command->error('Aucune classe trouvée');
            return;
        }

        $prenoms = [
            'Amadou', 'Fatou', 'Moussa', 'Aissatou', 'Ousmane', 'Mariama', 'Ibrahima', 'Khady',
            'Mamadou', 'Awa', 'Cheikh', 'Ndeye', 'Abdou', 'Bineta', 'Modou', 'Coumba',
            'Saliou', 'Astou', 'Babacar', 'Dieynaba', 'Lamine', 'Rokhaya', 'Pape', 'Mame',
            'Alioune', 'Seynabou', 'Fallou', 'Ndella', 'Serigne', 'Adama', 'Baye', 'Yacine',
            'Omar', 'Khadija', 'Tapha', 'Nogaye', 'Mor', 'Aby', 'Cheikhou', 'Maimouna',
            'Souleymane', 'Ramatoulaye', 'Abdoulaye', 'Marieme', 'Moustapha', 'Aminata'
        ];

        $noms = [
            'Diop', 'Fall', 'Ndiaye', 'Sow', 'Ba', 'Sy', 'Sarr', 'Faye', 'Diouf', 'Gueye',
            'Mbaye', 'Thiam', 'Kane', 'Cisse', 'Wade', 'Ndour', 'Seck', 'Tall', 'Diallo', 'Samb',
            'Diene', 'Toure', 'Camara', 'Traore', 'Kone', 'Coulibaly', 'Bah', 'Barry', 'Sall', 'Lo',
            'Niang', 'Drame', 'Keita', 'Sidibe', 'Beye', 'Mbow', 'Tine', 'Dia', 'Sene', 'Ndoye'
        ];

        $quartiers = [
            'Plateau', 'Medina', 'Grand Dakar', 'Fann', 'Mermoz', 'Sacré-Coeur', 'Almadies',
            'Ouakam', 'Ngor', 'Yoff', 'Parcelles Assainies', 'Grand Yoff', 'Patte d\'Oie',
            'HLM', 'Liberté', 'Point E', 'Dieuppeul', 'Derklé', 'Cambérène', 'Rufisque'
        ];

        $elevesCrees = 0;

        foreach ($classes as $classe) {
            // Nombre d'élèves selon la capacité de la classe
            $nombreEleves = min($classe->capacite_max - 3, rand(20, $classe->capacite_max - 2));
            
            for ($i = 0; $i < $nombreEleves; $i++) {
                $prenom = $prenoms[array_rand($prenoms)];
                $nom = $noms[array_rand($noms)];
                
                // Générer un email unique
                $baseEmail = strtolower(str_replace(' ', '', $prenom) . '.' . strtolower($nom));
                $email = $baseEmail . '.' . $classe->id . '.' . ($i + 1) . '@eleve.isiportal.sn';
                
                // Vérifier l'unicité de l'email
                $counter = 1;
                while (User::where('email', $email)->exists()) {
                    $email = $baseEmail . '.' . $counter . '@eleve.isiportal.sn';
                    $counter++;
                }

                // Âge selon le niveau
                $ageBase = $this->getAgeByNiveau($classe->niveauNom);
                $dateNaissance = now()->subYears($ageBase)->subDays(rand(1, 365));
                
                $telephone = '77' . str_pad(rand(1000000, 9999999), 7, '0', STR_PAD_LEFT);
                $quartier = $quartiers[array_rand($quartiers)];
                $adresse = $quartier . ', Dakar, Sénégal';

                User::create([
                    'nom' => $nom,
                    'prenom' => $prenom,
                    'email' => $email,
                    'password' => Hash::make('eleve123'),
                    'role' => 'eleve',
                    'telephone' => $telephone,
                    'adresse' => $adresse,
                    'date_naissance' => $dateNaissance,
                    'classe_id' => $classe->id,
                    'email_verified_at' => now(),
                ]);

                $elevesCrees++;
            }
            
            $this->command->info("Classe {$classe->nom}: {$nombreEleves} élèves créés");
        }

        $this->command->info("Total: {$elevesCrees} élèves créés avec succès!");
        $this->command->warn('Mot de passe par défaut pour tous les élèves: eleve123');
    }

    private function getAgeByNiveau($niveau)
    {
        return match($niveau) {
            'L1' => rand(18, 20),
            'L2' => rand(19, 21),
            'L3' => rand(20, 22),
            'M1' => rand(21, 24),
            'M2' => rand(22, 26),
            default => rand(18, 22)
        };
    }
}