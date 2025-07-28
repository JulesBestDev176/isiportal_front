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
                'password' => Hash::make('password123'),
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

        // Professeurs
        $professeurs = [
            [
                'nom' => 'Bernard',
                'prenom' => 'Sophie',
                'email' => 'sophie.bernard@isiportal.com',
                'matieres' => [1], // Mathématiques
                'sections' => ['college', 'lycee'],
            ],
            [
                'nom' => 'Leroy',
                'prenom' => 'Pierre',
                'email' => 'pierre.leroy@isiportal.com',
                'matieres' => [2], // Français
                'sections' => ['college', 'lycee'],
            ],
            [
                'nom' => 'Moreau',
                'prenom' => 'Isabelle',
                'email' => 'isabelle.moreau@isiportal.com',
                'matieres' => [3], // Histoire-Géographie
                'sections' => ['college', 'lycee'],
            ],
            [
                'nom' => 'Petit',
                'prenom' => 'Michel',
                'email' => 'michel.petit@isiportal.com',
                'matieres' => [4], // Anglais
                'sections' => ['college', 'lycee'],
            ],
            [
                'nom' => 'Roux',
                'prenom' => 'Catherine',
                'email' => 'catherine.roux@isiportal.com',
                'matieres' => [7], // Physique-Chimie
                'sections' => ['college', 'lycee'],
            ],
        ];

        foreach ($professeurs as $professeur) {
            if (!User::where('email', $professeur['email'])->exists()) {
                User::create([
                    'nom' => $professeur['nom'],
                    'prenom' => $professeur['prenom'],
                    'email' => $professeur['email'],
                    'password' => Hash::make('password123'),
                    'role' => 'professeur',
                    'actif' => true,
                    'doit_changer_mot_de_passe' => false,
                    'matieres' => $professeur['matieres'],
                    'sections' => $professeur['sections'],
                ]);
            }
        }

        // Parents
        $parents = [
            [
                'nom' => 'Durand',
                'prenom' => 'François',
                'email' => 'francois.durand@email.com',
                'telephone' => '0123456789',
                'adresse' => '123 Rue de la Paix, 75001 Paris',
                'profession' => 'Ingénieur',
            ],
            [
                'nom' => 'Lefevre',
                'prenom' => 'Anne',
                'email' => 'anne.lefevre@email.com',
                'telephone' => '0987654321',
                'adresse' => '456 Avenue des Champs, 75008 Paris',
                'profession' => 'Médecin',
            ],
            [
                'nom' => 'Garcia',
                'prenom' => 'Carlos',
                'email' => 'carlos.garcia@email.com',
                'telephone' => '0555666777',
                'adresse' => '789 Boulevard Saint-Germain, 75006 Paris',
                'profession' => 'Avocat',
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