<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $admin = $users->where('role', 'administrateur')->first();

        // Notifications système
        $notificationsSystem = [
            [
                'titre' => 'Bienvenue sur ISIPortal',
                'contenu' => 'Bienvenue sur la plateforme de gestion scolaire ISIPortal. Votre compte a été créé avec succès.',
                'type' => 'success',
                'priorite' => 'normale'
            ],
            [
                'titre' => 'Maintenance prévue',
                'contenu' => 'Une maintenance est prévue le samedi de 22h à 2h du matin. Le système sera temporairement indisponible.',
                'type' => 'warning',
                'priorite' => 'haute'
            ],
            [
                'titre' => 'Nouvelle année scolaire',
                'contenu' => 'L\'année scolaire 2024-2025 est maintenant active. Tous les bulletins et notes ont été réinitialisés.',
                'type' => 'info',
                'priorite' => 'normale'
            ],
        ];

        foreach ($notificationsSystem as $notif) {
            foreach ($users as $user) {
                Notification::create([
                    'titre' => $notif['titre'],
                    'contenu' => $notif['contenu'],
                    'type' => $notif['type'],
                    'priorite' => $notif['priorite'],
                    'destinataire_id' => $user->id,
                    'expediteur_id' => $admin->id,
                    'lue' => false,
                    'date_envoi' => now()->subDays(rand(1, 30))
                ]);
            }
        }

        // Notifications spécifiques aux professeurs
        $professeurs = $users->where('role', 'professeur');
        foreach ($professeurs as $professeur) {
            $notificationsProf = [
                [
                    'titre' => 'Nouvelle classe assignée',
                    'contenu' => 'Vous avez été assigné à la classe 6ème A pour l\'année scolaire 2024-2025.',
                    'type' => 'info',
                    'priorite' => 'normale'
                ],
                [
                    'titre' => 'Réunion pédagogique',
                    'contenu' => 'Une réunion pédagogique est prévue le vendredi à 16h dans la salle de réunion.',
                    'type' => 'warning',
                    'priorite' => 'haute'
                ],
                [
                    'titre' => 'Bulletins à saisir',
                    'contenu' => 'N\'oubliez pas de saisir les notes du premier trimestre avant le 15 décembre.',
                    'type' => 'error',
                    'priorite' => 'urgente'
                ]
            ];

            foreach ($notificationsProf as $notif) {
                Notification::create([
                    'titre' => $notif['titre'],
                    'contenu' => $notif['contenu'],
                    'type' => $notif['type'],
                    'priorite' => $notif['priorite'],
                    'destinataire_id' => $professeur->id,
                    'expediteur_id' => $admin->id,
                    'lue' => rand(0, 1),
                    'date_envoi' => now()->subDays(rand(1, 15))
                ]);
            }
        }

        // Notifications spécifiques aux gestionnaires
        $gestionnaires = $users->where('role', 'gestionnaire');
        foreach ($gestionnaires as $gestionnaire) {
            $notificationsGest = [
                [
                    'titre' => 'Nouveaux élèves inscrits',
                    'contenu' => '5 nouveaux élèves ont été inscrits dans votre section. Veuillez les affecter aux classes.',
                    'type' => 'info',
                    'priorite' => 'normale'
                ],
                [
                    'titre' => 'Effectifs des classes',
                    'contenu' => 'Certaines classes atteignent leur capacité maximale. Veuillez vérifier les effectifs.',
                    'type' => 'warning',
                    'priorite' => 'haute'
                ]
            ];

            foreach ($notificationsGest as $notif) {
                Notification::create([
                    'titre' => $notif['titre'],
                    'contenu' => $notif['contenu'],
                    'type' => $notif['type'],
                    'priorite' => $notif['priorite'],
                    'destinataire_id' => $gestionnaire->id,
                    'expediteur_id' => $admin->id,
                    'lue' => rand(0, 1),
                    'date_envoi' => now()->subDays(rand(1, 10))
                ]);
            }
        }
    }
} 