<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use App\Models\Classe;
use App\Models\Cours;
use App\Models\Notification;
use App\Models\Absence;
use App\Models\Bulletin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponse;

    /**
     * Récupérer les statistiques du tableau de bord selon le rôle
     */
    public function getStats(Request $request, $role)
    {
        try {
            $stats = [];

            switch ($role) {
                case 'administrateur':
                    $stats = [
                        'totalUtilisateurs' => User::count(),
                        'classesActives' => Classe::where('statut', 'active')->count(),
                        'coursProgrammes' => Cours::where('statut', 'active')->count(),
                        'evenements' => 12, // À implémenter avec un modèle Événement
                    ];
                    break;

                case 'gestionnaire':
                    $stats = [
                        'elevesInscrits' => User::where('role', 'eleve')->count(),
                        'classesGerees' => Classe::where('statut', 'active')->count(),
                        'professeurs' => User::where('role', 'professeur')->count(),
                    ];
                    break;

                case 'professeur':
                    $userId = Auth::id();
                    $stats = [
                        'mesClasses' => Classe::whereHas('cours', function($query) use ($userId) {
                            $query->where('professeur_id', $userId);
                        })->count(),
                        'elevesTotal' => User::where('role', 'eleve')->count(),
                        'coursCetteSemaine' => Cours::where('professeur_id', $userId)
                            ->where('statut', 'active')
                            ->count(),
                        'devoirsACorriger' => 45, // À implémenter avec un modèle Devoir
                    ];
                    break;

                default:
                    return $this->errorResponse('Rôle non reconnu');
            }

            return $this->successResponse($stats, 'Statistiques récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer les notifications
     */
    public function getNotifications()
    {
        try {
            $notifications = Notification::where('destinataire_id', Auth::id())
                ->orWhere('destinataire_id', null) // Notifications globales
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'titre' => $notification->titre,
                        'message' => $notification->message,
                        'type' => $notification->type,
                        'date' => $notification->created_at->format('Y-m-d'),
                    ];
                });

            return $this->successResponse($notifications, 'Notifications récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notifications: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer les activités récentes selon le rôle
     */
    public function getActivites(Request $request, $role)
    {
        try {
            $activites = [];

            switch ($role) {
                case 'administrateur':
                    $activites = [
                        [
                            'id' => '1',
                            'titre' => 'Nouvelle année scolaire',
                            'description' => 'Préparation de la rentrée 2024-2025',
                            'type' => 'info',
                            'date' => now()->subDays(2)->format('Y-m-d'),
                        ],
                        [
                            'id' => '2',
                            'titre' => 'Maintenance programmée',
                            'description' => 'Maintenance du système prévue ce weekend',
                            'type' => 'warning',
                            'date' => now()->subDays(1)->format('Y-m-d'),
                        ],
                    ];
                    break;

                case 'gestionnaire':
                    $activites = [
                        [
                            'id' => '1',
                            'titre' => 'Nouvelle classe créée',
                            'description' => 'Classe 6ème A ajoutée',
                            'type' => 'success',
                            'date' => now()->subHours(1)->format('Y-m-d'),
                        ],
                        [
                            'id' => '2',
                            'titre' => 'Emploi du temps validé',
                            'description' => 'Emploi du temps de la 5ème B validé',
                            'type' => 'success',
                            'date' => now()->subHours(3)->format('Y-m-d'),
                        ],
                    ];
                    break;

                case 'professeur':
                    $activites = [
                        [
                            'id' => '1',
                            'titre' => 'Notes saisies',
                            'description' => 'Notes du contrôle de mathématiques saisies',
                            'type' => 'success',
                            'date' => now()->subMinutes(30)->format('Y-m-d'),
                        ],
                        [
                            'id' => '2',
                            'titre' => 'Appel effectué',
                            'description' => 'Présence de la classe 4ème A prise',
                            'type' => 'info',
                            'date' => now()->subHours(2)->format('Y-m-d'),
                        ],
                    ];
                    break;
            }

            return $this->successResponse($activites, 'Activités récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des activités: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer les détails pour l'administrateur
     */
    public function getAdminDetails()
    {
        try {
            $details = [
                'nouvellesInscriptions' => User::where('role', 'eleve')
                    ->where('created_at', '>=', now()->subWeek())
                    ->count(),
                'coursActifs' => Cours::where('statut', 'active')->count(),
                'absencesNonJustifiees' => Absence::where('justifiee', false)
                    ->where('date', '>=', now()->subWeek())
                    ->count(),
                'bulletinsGeneres' => Bulletin::where('created_at', '>=', now()->subMonth())->count(),
            ];

            return $this->successResponse($details, 'Détails récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des détails: ' . $e->getMessage());
        }
    }
} 