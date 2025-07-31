<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Matiere;
use Illuminate\Support\Facades\Hash;

class ProfesseursSeeder extends Seeder
{
    public function run()
    {
        $matieres = Matiere::all()->keyBy('code');
        
        $professeurs = [
            // Professeurs d'Informatique
            [
                'nom' => 'SARR',
                'prenom' => 'Ibrahima',
                'email' => 'i.sarr@isiportal.sn',
                'specialite' => 'Algorithmique et Programmation',
                'matieres' => ['INFO101', 'INFO201'],
                'grade' => 'Professeur',
                'telephone' => '77 111 11 11'
            ],
            [
                'nom' => 'GUEYE',
                'prenom' => 'Mariama',
                'email' => 'm.gueye@isiportal.sn',
                'specialite' => 'Bases de Données',
                'matieres' => ['INFO202', 'INFO402'],
                'grade' => 'Maître de Conférences',
                'telephone' => '77 222 22 22'
            ],
            [
                'nom' => 'THIAM',
                'prenom' => 'Ousmane',
                'email' => 'o.thiam@isiportal.sn',
                'specialite' => 'Génie Logiciel',
                'matieres' => ['INFO301', 'INFO401'],
                'grade' => 'Professeur Associé',
                'telephone' => '77 333 33 33'
            ],
            [
                'nom' => 'BA',
                'prenom' => 'Aissatou',
                'email' => 'a.ba@isiportal.sn',
                'specialite' => 'Réseaux et Sécurité',
                'matieres' => ['INFO302', 'INFO304'],
                'grade' => 'Maître Assistant',
                'telephone' => '77 444 44 44'
            ],
            [
                'nom' => 'KANE',
                'prenom' => 'Cheikh',
                'email' => 'c.kane@isiportal.sn',
                'specialite' => 'Intelligence Artificielle',
                'matieres' => ['INFO303', 'INFO403'],
                'grade' => 'Professeur',
                'telephone' => '77 555 55 55'
            ],
            [
                'nom' => 'DIOUF',
                'prenom' => 'Khady',
                'email' => 'k.diouf@isiportal.sn',
                'specialite' => 'Systèmes d\'Exploitation',
                'matieres' => ['INFO203'],
                'grade' => 'Maître de Conférences',
                'telephone' => '77 666 66 66'
            ],

            // Professeurs de Mathématiques
            [
                'nom' => 'SY',
                'prenom' => 'Mamadou',
                'email' => 'm.sy@isiportal.sn',
                'specialite' => 'Mathématiques Générales',
                'matieres' => ['MATH101', 'MATH201'],
                'grade' => 'Professeur',
                'telephone' => '77 777 77 77'
            ],
            [
                'nom' => 'MBAYE',
                'prenom' => 'Awa',
                'email' => 'a.mbaye@isiportal.sn',
                'specialite' => 'Statistiques',
                'matieres' => ['STAT201'],
                'grade' => 'Maître de Conférences',
                'telephone' => '77 888 88 88'
            ],
            [
                'nom' => 'CISSE',
                'prenom' => 'Abdou',
                'email' => 'a.cisse@isiportal.sn',
                'specialite' => 'Recherche Opérationnelle',
                'matieres' => ['INFO501'],
                'grade' => 'Professeur Associé',
                'telephone' => '77 999 99 99'
            ],

            // Professeurs de Physique
            [
                'nom' => 'WADE',
                'prenom' => 'Bineta',
                'email' => 'b.wade@isiportal.sn',
                'specialite' => 'Physique Générale',
                'matieres' => ['PHYS101'],
                'grade' => 'Maître Assistant',
                'telephone' => '76 111 11 11'
            ],

            // Professeurs de Langues
            [
                'nom' => 'JOHNSON',
                'prenom' => 'Michael',
                'email' => 'm.johnson@isiportal.sn',
                'specialite' => 'Anglais Technique',
                'matieres' => ['ANG101'],
                'grade' => 'Lecteur',
                'telephone' => '76 222 22 22'
            ],
            [
                'nom' => 'SECK',
                'prenom' => 'Coumba',
                'email' => 'c.seck@isiportal.sn',
                'specialite' => 'Expression Française',
                'matieres' => ['FRAN101'],
                'grade' => 'Maître Assistant',
                'telephone' => '76 333 33 33'
            ]
        ];

        foreach ($professeurs as $profData) {
            $matieresIds = [];
            foreach ($profData['matieres'] as $matiereCode) {
                if (isset($matieres[$matiereCode])) {
                    $matieresIds[] = [
                        'id' => $matieres[$matiereCode]->id,
                        'nom' => $matieres[$matiereCode]->nom
                    ];
                }
            }

            $professeur = User::create([
                'nom' => $profData['nom'],
                'prenom' => $profData['prenom'],
                'email' => $profData['email'],
                'password' => Hash::make('prof123'),
                'role' => 'professeur',
                'telephone' => $profData['telephone'],
                'adresse' => 'Dakar, Sénégal',
                'date_naissance' => now()->subYears(rand(30, 55))->format('Y-m-d'),
                'specialite' => $profData['specialite'],
                'grade' => $profData['grade'],
                'matieres' => json_encode($matieresIds),
                'email_verified_at' => now()
            ]);

            $this->command->info("Professeur créé: {$professeur->prenom} {$professeur->nom} - {$profData['specialite']}");
        }

        $this->command->info('Professeurs créés avec succès!');
        $this->command->warn('Mot de passe par défaut pour tous les professeurs: prof123');
    }
}