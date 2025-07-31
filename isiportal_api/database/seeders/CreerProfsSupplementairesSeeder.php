<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreerProfsSupplementairesSeeder extends Seeder
{
    public function run()
    {
        $professeurs = [
            [
                'nom' => 'Diop',
                'prenom' => 'Aminata',
                'email' => 'aminata.diop@isiportal.sn',
                'role' => 'professeur',
                'password' => Hash::make('password123'),
                'actif' => true,
                'doit_changer_mot_de_passe' => false
            ],
            [
                'nom' => 'Sarr',
                'prenom' => 'Ibrahima',
                'email' => 'ibrahima.sarr@isiportal.sn',
                'role' => 'professeur',
                'password' => Hash::make('password123'),
                'actif' => true,
                'doit_changer_mot_de_passe' => false
            ],
            [
                'nom' => 'Ndiaye',
                'prenom' => 'Fatou',
                'email' => 'fatou.ndiaye@isiportal.sn',
                'role' => 'professeur',
                'password' => Hash::make('password123'),
                'actif' => true,
                'doit_changer_mot_de_passe' => false
            ],
            [
                'nom' => 'Ba',
                'prenom' => 'Ousmane',
                'email' => 'ousmane.ba@isiportal.sn',
                'role' => 'professeur',
                'password' => Hash::make('password123'),
                'actif' => true,
                'doit_changer_mot_de_passe' => false
            ]
        ];

        foreach ($professeurs as $prof) {
            $existant = User::where('email', $prof['email'])->first();
            if (!$existant) {
                User::create($prof);
                $this->command->info("Professeur créé : {$prof['prenom']} {$prof['nom']}");
            } else {
                $this->command->info("Professeur existe déjà : {$prof['prenom']} {$prof['nom']}");
            }
        }
    }
}