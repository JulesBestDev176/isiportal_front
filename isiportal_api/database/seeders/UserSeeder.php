<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Administrateur principal
        if (!User::where('email', 'admin@isiportal.com')->exists()) {
            User::create([
                'nom' => 'Admin',
                'prenom' => 'Principal',
                'email' => 'admin@isiportal.com',
                'password' => Hash::make('password123'),
                'role' => 'administrateur',
                'actif' => true,
                'doit_changer_mot_de_passe' => false,
                'privileges' => ['gestion_utilisateurs', 'gestion_classes', 'gestion_cours', 'gestion_bulletins'],
                'sections' => ['college', 'lycee'],
            ]);
        }

        // Gestionnaires
        if (!User::where('email', 'gestionnaire.college@isiportal.com')->exists()) {
            User::create([
                'nom' => 'Dupont',
                'prenom' => 'Marie',
                'email' => 'gestionnaire.college@isiportal.com',
                'password' => Hash::make('un '),
                'role' => 'gestionnaire',
                'actif' => true,
                'doit_changer_mot_de_passe' => false,
                'sections' => ['college'],
            ]);
        }

        if (!User::where('email', 'gestionnaire.lycee@isiportal.com')->exists()) {
            User::create([
                'nom' => 'Martin',
                'prenom' => 'Jean',
                'email' => 'gestionnaire.lycee@isiportal.com',
                'password' => Hash::make('password123'),
                'role' => 'gestionnaire',
                'actif' => true,
                'doit_changer_mot_de_passe' => false,
                'sections' => ['lycee'],
            ]);
        }

        // Professeurs avec noms sénégalais
        $professeurs = [
            [
                'nom' => 'Diop',
                'prenom' => 'Aminata',
                'email' => 'aminata.diop@isiportal.com',
                'matieres' => [1], // Mathématiques
                'sections' => ['college', 'lycee'],
                'telephone' => '77 123 45 67',
                'adresse' => 'Dakar, Sénégal',
            ],
            [
                'nom' => 'Ndiaye',
                'prenom' => 'Moussa',
                'email' => 'moussa.ndiaye@isiportal.com',
                'matieres' => [2], // Français
                'sections' => ['college', 'lycee'],
                'telephone' => '77 234 56 78',
                'adresse' => 'Thiès, Sénégal',
            ],
            [
                'nom' => 'Fall',
                'prenom' => 'Fatou',
                'email' => 'fatou.fall@isiportal.com',
                'matieres' => [3], // Histoire-Géographie
                'sections' => ['college', 'lycee'],
                'telephone' => '77 345 67 89',
                'adresse' => 'Saint-Louis, Sénégal',
            ],
            [
                'nom' => 'Sow',
                'prenom' => 'Ibrahima',
                'email' => 'ibrahima.sow@isiportal.com',
                'matieres' => [4], // Anglais
                'sections' => ['college', 'lycee'],
                'telephone' => '77 456 78 90',
                'adresse' => 'Kaolack, Sénégal',
            ],
            [
                'nom' => 'Ba',
                'prenom' => 'Aissatou',
                'email' => 'aissatou.ba@isiportal.com',
                'matieres' => [7], // Physique-Chimie
                'sections' => ['college', 'lycee'],
                'telephone' => '77 567 89 01',
                'adresse' => 'Ziguinchor, Sénégal',
            ],
            [
                'nom' => 'Sarr',
                'prenom' => 'Ousmane',
                'email' => 'ousmane.sarr@isiportal.com',
                'matieres' => [5], // Arabe
                'sections' => ['college', 'lycee'],
                'telephone' => '77 678 90 12',
                'adresse' => 'Tamba, Sénégal',
            ],
            [
                'nom' => 'Gueye',
                'prenom' => 'Mariama',
                'email' => 'mariama.gueye@isiportal.com',
                'matieres' => [8], // SVT
                'sections' => ['college', 'lycee'],
                'telephone' => '77 789 01 23',
                'adresse' => 'Louga, Sénégal',
            ],
        ];

        foreach ($professeurs as $professeur) {
            if (!User::where('email', $professeur['email'])->exists()) {
                $user = User::create([
                    'nom' => $professeur['nom'],
                    'prenom' => $professeur['prenom'],
                    'email' => $professeur['email'],
                    'password' => Hash::make('password123'),
                    'role' => 'professeur',
                    'actif' => true,
                    'doit_changer_mot_de_passe' => false,
                    'matieres' => $professeur['matieres'],
                    'sections' => $professeur['sections'],
                    'telephone' => $professeur['telephone'],
                    'adresse' => $professeur['adresse'],
                ]);
                
                // Ajouter les relations dans la table pivot user_matieres
                foreach ($professeur['matieres'] as $matiereId) {
                    \DB::table('user_matieres')->insert([
                        'user_id' => $user->id,
                        'matiere_id' => $matiereId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Parents avec noms sénégalais
        $parents = [
            [
                'nom' => 'Diallo',
                'prenom' => 'Mamadou',
                'email' => 'mamadou.diallo@email.com',
                'telephone' => '77 111 22 33',
                'adresse' => 'Parcelles Assainies, Dakar',
                'profession' => 'Commerçant',
            ],
            [
                'nom' => 'Sy',
                'prenom' => 'Awa',
                'email' => 'awa.sy@email.com',
                'telephone' => '77 222 33 44',
                'adresse' => 'Plateau, Dakar',
                'profession' => 'Infirmière',
            ],
            [
                'nom' => 'Cissé',
                'prenom' => 'Abdoulaye',
                'email' => 'abdoulaye.cisse@email.com',
                'telephone' => '77 333 44 55',
                'adresse' => 'Guédiawaye, Dakar',
                'profession' => 'Enseignant',
            ],
            [
                'nom' => 'Toure',
                'prenom' => 'Khady',
                'email' => 'khady.toure@email.com',
                'telephone' => '77 444 55 66',
                'adresse' => 'Pikine, Dakar',
                'profession' => 'Couturière',
            ],
            [
                'nom' => 'Kane',
                'prenom' => 'Cheikh',
                'email' => 'cheikh.kane@email.com',
                'telephone' => '77 555 66 77',
                'adresse' => 'Rufisque, Dakar',
                'profession' => 'Chauffeur',
            ],
        ];

        foreach ($parents as $parent) {
            if (!User::where('email', $parent['email'])->exists()) {
                User::create([
                    'nom' => $parent['nom'],
                    'prenom' => $parent['prenom'],
                    'email' => $parent['email'],
                    'password' => Hash::make('password123'),
                    'role' => 'parent',
                    'actif' => true,
                    'doit_changer_mot_de_passe' => false,
                    'telephone' => $parent['telephone'],
                    'adresse' => $parent['adresse'],
                    'profession' => $parent['profession'],
                ]);
            }
        }

        // Élèves (seront créés après les classes)
        // Les élèves seront créés dans le ClasseSeeder
    }
} 