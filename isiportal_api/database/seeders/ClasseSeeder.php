<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classe;
use App\Models\User;
use App\Models\AnneeScolaire;

class ClasseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $anneeActive = AnneeScolaire::where('statut', 'active')->first();
        
        if (!$anneeActive) {
            $this->command->error('Aucune année scolaire active trouvée');
            return;
        }

        // Créer des professeurs si ils n'existent pas
        $professeurs = $this->createProfesseurs();

        $classes = [
            [
                'nom' => '6ème A',
                'niveau_id' => 1,
                'effectif_max' => 30,
                'description' => 'Classe de 6ème A',
                'professeur_principal_id' => $professeurs[0]->id,
                'statut' => 'active',
                'annee_scolaire_id' => $anneeActive->id,
            ],
            [
                'nom' => '6ème B',
                'niveau_id' => 1,
                'effectif_max' => 30,
                'description' => 'Classe de 6ème B',
                'professeur_principal_id' => $professeurs[1]->id,
                'statut' => 'active',
                'annee_scolaire_id' => $anneeActive->id,
            ],
            [
                'nom' => '5ème A',
                'niveau_id' => 2,
                'effectif_max' => 30,
                'description' => 'Classe de 5ème A',
                'professeur_principal_id' => $professeurs[2]->id,
                'statut' => 'active',
                'annee_scolaire_id' => $anneeActive->id,
            ],
            [
                'nom' => '4ème A',
                'niveau_id' => 3,
                'effectif_max' => 30,
                'description' => 'Classe de 4ème A',
                'professeur_principal_id' => $professeurs[3]->id,
                'statut' => 'active',
                'annee_scolaire_id' => $anneeActive->id,
            ],
            [
                'nom' => '3ème A',
                'niveau_id' => 4,
                'effectif_max' => 30,
                'description' => 'Classe de 3ème A',
                'professeur_principal_id' => $professeurs[4]->id,
                'statut' => 'active',
                'annee_scolaire_id' => $anneeActive->id,
            ],
            [
                'nom' => '2nde A',
                'niveau_id' => 5,
                'effectif_max' => 35,
                'description' => 'Classe de 2nde A',
                'professeur_principal_id' => $professeurs[5]->id,
                'statut' => 'active',
                'annee_scolaire_id' => $anneeActive->id,
            ],
            [
                'nom' => '1ère S',
                'niveau_id' => 6,
                'effectif_max' => 35,
                'description' => 'Classe de 1ère S',
                'professeur_principal_id' => $professeurs[6]->id,
                'statut' => 'active',
                'annee_scolaire_id' => $anneeActive->id,
            ],
            [
                'nom' => 'Terminale S',
                'niveau_id' => 7,
                'effectif_max' => 35,
                'description' => 'Classe de Terminale S',
                'professeur_principal_id' => $professeurs[7]->id,
                'statut' => 'active',
                'annee_scolaire_id' => $anneeActive->id,
            ],
        ];

        foreach ($classes as $classe) {
            Classe::create($classe);
        }

        // Créer des élèves pour chaque classe
        $this->createEleves();
    }

    private function createProfesseurs(): \Illuminate\Database\Eloquent\Collection
    {
        $professeurs = User::where('role', 'professeur')->get();
        
        if ($professeurs->count() < 8) {
            // Créer des professeurs supplémentaires si nécessaire
            $noms = ['Bernard', 'Dupont', 'Moreau', 'Leroy', 'Petit', 'Roux', 'Martin', 'Durand'];
            $prenoms = ['Sophie', 'Marie', 'Isabelle', 'Pierre', 'Michel', 'Catherine', 'Jean', 'Paul'];
            
            for ($i = $professeurs->count(); $i < 8; $i++) {
                $professeur = User::create([
                    'nom' => $noms[$i],
                    'prenom' => $prenoms[$i],
                    'email' => strtolower($prenoms[$i]) . '.' . strtolower($noms[$i]) . '@isiportal.com',
                    'password' => bcrypt('password123'),
                    'role' => 'professeur',
                    'actif' => true,
                    'doit_changer_mot_de_passe' => false,
                    'telephone' => '01' . rand(10000000, 99999999),
                    'adresse' => rand(1, 100) . ' rue de l\'Éducation, Paris',
                ]);
                
                $professeurs->push($professeur);
            }
        }
        
        return $professeurs->take(8);
    }

    private function createEleves(): void
    {
        $classes = Classe::all();
        $parents = User::where('role', 'parent')->get();

        // Créer des parents si ils n'existent pas
        if ($parents->isEmpty()) {
            $parents = $this->createParents();
        }

        foreach ($classes as $classe) {
            $nombreEleves = rand(20, 28); // Entre 20 et 28 élèves par classe
            
            for ($i = 1; $i <= $nombreEleves; $i++) {
                $parent = $parents->random();
                
                $eleve = User::create([
                    'nom' => 'Élève' . $i,
                    'prenom' => 'Prénom' . $i,
                    'email' => "eleve{$i}.classe{$classe->id}@isiportal.com",
                    'password' => bcrypt('password123'),
                    'role' => 'eleve',
                    'actif' => true,
                    'doit_changer_mot_de_passe' => false,
                    'classe_id' => $classe->id,
                    'date_naissance' => now()->subYears(rand(11, 18)),
                    'lieu_naissance' => 'Paris',
                    'numero_etudiant' => 'E' . str_pad($classe->id, 2, '0', STR_PAD_LEFT) . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'parents_ids' => [$parent->id],
                ]);

                // Mettre à jour les enfants_ids du parent
                $parent->enfants_ids = array_merge($parent->enfants_ids ?? [], [$eleve->id]);
                $parent->save();
            }
        }
    }

    private function createParents(): \Illuminate\Database\Eloquent\Collection
    {
        $parents = new \Illuminate\Database\Eloquent\Collection();
        
        for ($i = 1; $i <= 20; $i++) {
            $parent = User::create([
                'nom' => 'Parent' . $i,
                'prenom' => 'Prénom' . $i,
                'email' => "parent{$i}@isiportal.com",
                'password' => bcrypt('password123'),
                'role' => 'parent',
                'actif' => true,
                'doit_changer_mot_de_passe' => false,
                'telephone' => '01' . rand(10000000, 99999999),
                'adresse' => rand(1, 100) . ' rue des Parents, Paris',
                'profession' => 'Profession ' . $i,
                'enfants_ids' => [],
            ]);
            
            $parents->push($parent);
        }
        
        return $parents;
    }
} 