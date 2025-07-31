<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Note;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class ParentDashboardController extends Controller
{
    use ApiResponse;

    public function getDashboard()
    {
        $user = Auth::user();
        
        if ($user->role !== 'parent') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        try {
            // Récupérer les enfants du parent
            $enfants = User::where('parent_id', $user->id)
                ->where('role', 'eleve')
                ->with(['classe.niveau'])
                ->get();

            $enfantsData = [];
            $totalNotes = 0;
            $totalCours = 0;
            $moyenneGeneraleGlobale = null;

            foreach ($enfants as $enfant) {
                // Calculer la moyenne de l'enfant
                $notes = Note::where('eleve_id', $enfant->id)->get();
                $moyenneEnfant = null;
                
                if ($notes->isNotEmpty()) {
                    $totalPoints = $notes->sum(function($note) {
                        return $note->note * $note->coefficient;
                    });
                    $totalCoefficients = $notes->sum('coefficient');
                    $moyenneEnfant = $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 1) : null;
                }

                $enfantsData[] = [
                    'id' => $enfant->id,
                    'nom' => $enfant->nom,
                    'prenom' => $enfant->prenom,
                    'nom_complet' => $enfant->prenom . ' ' . $enfant->nom,
                    'classe' => $enfant->classe ? [
                        'id' => $enfant->classe->id,
                        'nom' => $enfant->classe->nom,
                        'niveau' => [
                            'id' => $enfant->classe->niveau->id,
                            'nom' => $enfant->classe->niveau->nom,
                        ],
                    ] : null,
                    'moyenne' => $moyenneEnfant,
                ];

                $totalNotes += $notes->count();
            }

            // Calculer la moyenne générale de tous les enfants
            if ($totalNotes > 0) {
                $toutesLesNotes = Note::whereIn('eleve_id', $enfants->pluck('id'))->get();
                if ($toutesLesNotes->isNotEmpty()) {
                    $totalPoints = $toutesLesNotes->sum(function($note) {
                        return $note->note * $note->coefficient;
                    });
                    $totalCoefficients = $toutesLesNotes->sum('coefficient');
                    $moyenneGeneraleGlobale = $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 1) : null;
                }
            }

            // Récupérer les notifications récentes
            $notifications = Notification::where('destinataire_id', $user->id)
                ->where('lue', false)
                ->orderBy('date_creation', 'desc')
                ->limit(5)
                ->get();

            $dashboardData = [
                'enfants' => $enfantsData,
                'parent' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'nom_complet' => $user->prenom . ' ' . $user->nom,
                ],
                'stats' => [
                    'children' => [
                        'value' => count($enfantsData),
                        'trend' => 0
                    ],
                    'averageGrade' => [
                        'value' => $moyenneGeneraleGlobale ? $moyenneGeneraleGlobale . '/20' : '--',
                        'trend' => 0
                    ],
                    'messages' => [
                        'value' => $notifications->count(),
                        'trend' => 0
                    ],
                    'events' => [
                        'value' => 0,
                        'trend' => 0
                    ]
                ],
                'activities' => [],
                'notifications' => []
            ];

            return response()->json([
                'success' => true,
                'message' => 'Dashboard parent récupéré avec succès',
                'data' => $dashboardData
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du dashboard: ' . $e->getMessage(), 500);
        }
    }
}