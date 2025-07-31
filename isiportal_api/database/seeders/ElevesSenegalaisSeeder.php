<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Classe;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ElevesSenegalaisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = Classe::all();
        $parents = User::where('role', 'parent')->get();

        if ($classes->isEmpty()) {
            $this->command->error('Aucune classe trouvée. Exécutez d\'abord ClasseSeeder.');
            return;
        }

        if ($parents->isEmpty()) {
            $this->command->error('Aucun parent trouvé. Exécutez d\'abord UserSeeder.');
            return;
        }

        // Noms sénégalais typiques
        $nomsGarcons = [
            'Diallo', 'Ndiaye', 'Fall', 'Sow', 'Ba', 'Sarr', 'Gueye', 'Cissé', 
            'Touré', 'Kane', 'Wade', 'Mbaye', 'Diouf', 'Faye', 'Ndour', 'Ly'
        ];
        
        $prenomsGarcons = [
            'Moussa', 'Ibrahima', 'Ousmane', 'Mamadou', 'Abdoulaye', 'Cheikh', 
            'Omar', 'Amadou', 'Modou', 'Pape', 'Alioune', 'Babacar', 'Souleymane'
        ];

        $nomsFilles = [
            'Diop', 'Ndiaye', 'Fall', 'Sow', 'Ba', 'Sarr', 'Gueye', 'Cissé',
            'Touré', 'Kane', 'Wade', 'Mbaye', 'Diouf', 'Faye', 'Ndour', 'Sy'
        ];
        
        $prenomsFilles = [
            'Aminata', 'Fatou', 'Aissatou', 'Khady', 'Mariama', 'Awa', 'Bineta',
            'Coumba', 'Ndèye', 'Mame', 'Astou', 'Dieynaba', 'Rokhaya'
        ];

        $lieux = [
            'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Tambacounda',
            'Diourbel', 'Louga', 'Fatick', 'Kolda', 'Matam', 'Kaffrine', 'Kédougou', 'Sédhiou'
        ];

        foreach ($classes as $classe) {
            $nombreEleves = rand(25, 35);
            
            for ($i = 1; $i <= $nombreEleves; $i++) {
                $isGirl = rand(0, 1);
                $nom = $isGirl ? $nomsFilles[array_rand($nomsFilles)] : $nomsGarcons[array_rand($nomsGarcons)];
                $prenom = $isGirl ? $prenomsFilles[array_rand($prenomsFilles)] : $prenomsGarcons[array_rand($prenomsGarcons)];
                $parent = $parents->random();
                
                // Calculer l'âge basé sur le niveau
                $ageBase = match($classe->niveau_id) {
                    1 => 11, // 6ème
                    2 => 12, // 5ème
                    3 => 13, // 4ème
                    4 => 14, // 3ème
                    5 => 15, // 2nde
                    6, 7 => 16, // 1ère L/S
                    8, 9 => 17, // Terminale L/S
                    default => 13
                };
                
                $age = $ageBase + rand(-1, 2); // Variation de ±2 ans
                $dateNaissance = now()->subYears($age)->subDays(rand(0, 365));
                
                $eleve = User::create([
                    'nom' => $nom,
                    'prenom' => $prenom,
                    'email' => strtolower($prenom) . '.' . strtolower($nom) . $classe->id . $i . '@eleve.isiportal.com',
                    'password' => Hash::make('eleve123'),
                    'role' => 'eleve',
                    'actif' => true,
                    'doit_changer_mot_de_passe' => false,
                    'classe_id' => $classe->id,
                    'date_naissance' => $dateNaissance,
                    'lieu_naissance' => $lieux[array_rand($lieux)] . ', Sénégal',
                    'numero_etudiant' => 'E' . date('Y') . str_pad($classe->id, 2, '0', STR_PAD_LEFT) . str_pad($i + ($classe->id * 100), 3, '0', STR_PAD_LEFT),
                    'parents_ids' => [$parent->id],
                    'telephone' => '77 ' . rand(100, 999) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                    'adresse' => $lieux[array_rand($lieux)] . ', Sénégal',
                ]);

                // Créer la relation parent-enfant dans la table pivot
                DB::table('user_parents')->insert([
                    'parent_id' => $parent->id,
                    'eleve_id' => $eleve->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Mettre à jour les enfants_ids du parent
                $enfantsIds = $parent->enfants_ids ?? [];
                if (!in_array($eleve->id, $enfantsIds)) {
                    $enfantsIds[] = $eleve->id;
                    $parent->update(['enfants_ids' => $enfantsIds]);
                }
            }
        }

        $this->command->info('Élèves sénégalais créés avec succès !');
        $this->command->info('Total élèves créés: ' . User::where('role', 'eleve')->count());
    }
}