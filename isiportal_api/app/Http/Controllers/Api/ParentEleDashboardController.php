<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Note;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ParentEleDashboardController extends Controller
{
    use ApiResponse;

    public function getDashboardData()
    {
        $user = Auth::user();
        
        if ($user->role === 'parent') {
            return $this->getParentDashboard($user);
        } elseif ($user->role === 'eleve') {
            return $this->getEleveDashboard($user);
        }
        
        return $this->errorResponse('Rôle non autorisé', 403);
    }

    private function getParentDashboard($parent)
    {
        // Récupérer les enfants
        $enfants = User::where('role', 'eleve')
            ->whereJsonContains('parents_ids', $parent->id)
            ->with(['classe.niveau'])
            ->get()
            ->map(function ($enfant) {
                $moyenne = Note::where('eleve_id', $enfant->id)->avg('note');
                return [
                    'id' => $enfant->id,
                    'nom' => $enfant->nom,
                    'prenom' => $enfant->prenom,
                    'classe' => [
                        'id' => $enfant->classe->id ?? null,
                        'nom' => $enfant->classe->nom ?? 'Non assigné',
                        'niveau' => [
                            'nom' => $enfant->classe->niveau->nom ?? 'N/A',
                            'cycle' => $enfant->classe->niveau->cycle ?? 'N/A'
                        ]
                    ],
                    'moyenne' => round($moyenne ?? 0, 1)
                ];
            });

        // Statistiques
        $stats = [
            'children' => ['value' => $enfants->count(), 'trend' => 0],
            'averageGrade' => ['value' => round($enfants->avg('moyenne'), 1), 'trend' => 5],
            'messages' => ['value' => Notification::where('destinataire_id', $parent->id)->where('lue', false)->count(), 'trend' => -2],
            'events' => ['value' => 2, 'trend' => 1]
        ];

        // Activités récentes
        $activities = [];
        foreach ($enfants as $enfant) {
            $recentNotes = Note::where('eleve_id', $enfant['id'])
                ->with('matiere')
                ->orderBy('date_evaluation', 'desc')
                ->take(3)
                ->get();
                
            foreach ($recentNotes as $note) {
                $activities[] = [
                    'type' => 'grade',
                    'title' => 'Nouvelle note en ' . $note->matiere->nom,
                    'description' => $enfant['prenom'] . ' a obtenu ' . $note->note . '/20',
                    'time' => $note->date_evaluation->diffForHumans(),
                    'child' => $enfant['prenom'],
                    'icon' => 'Award',
                    'color' => 'text-green-600'
                ];
            }
        }

        // Notifications récentes
        $notifications = Notification::where('destinataire_id', $parent->id)
            ->orderBy('date_creation', 'desc')
            ->take(5)
            ->get()
            ->map(function ($notif) {
                return [
                    'id' => $notif->id,
                    'titre' => $notif->titre,
                    'message' => $notif->contenu,
                    'lu' => $notif->lue,
                    'type' => $notif->type,
                    'date' => $notif->date_creation->diffForHumans()
                ];
            });

        return $this->successResponse([
            'user' => [
                'id' => $parent->id,
                'nom' => $parent->nom,
                'prenom' => $parent->prenom,
                'role' => $parent->role
            ],
            'enfants' => $enfants,
            'stats' => $stats,
            'activities' => collect($activities)->sortByDesc('time')->take(10)->values(),
            'notifications' => $notifications
        ]);
    }

    private function getEleveDashboard($eleve)
    {
        // Moyenne générale
        $moyenne = Note::where('eleve_id', $eleve->id)->avg('note');
        
        // Notes récentes
        $notesRecentes = Note::where('eleve_id', $eleve->id)
            ->with('matiere')
            ->orderBy('date_evaluation', 'desc')
            ->take(5)
            ->get()
            ->map(function ($note) {
                return [
                    'id' => $note->id,
                    'note' => $note->note,
                    'coefficient' => $note->coefficient,
                    'type_evaluation' => $note->type_evaluation,
                    'date_evaluation' => $note->date_evaluation->format('d/m/Y'),
                    'appreciation' => $note->appreciation,
                    'matiere' => [
                        'id' => $note->matiere->id,
                        'nom' => $note->matiere->nom,
                        'code' => $note->matiere->code
                    ]
                ];
            });

        // Statistiques
        $stats = [
            'moyenne' => ['value' => round($moyenne ?? 0, 1), 'trend' => 3],
            'notes' => ['value' => Note::where('eleve_id', $eleve->id)->count(), 'trend' => 2],
            'messages' => ['value' => Notification::where('destinataire_id', $eleve->id)->where('lue', false)->count(), 'trend' => 0],
            'absences' => ['value' => 0, 'trend' => 0]
        ];

        // Notifications
        $notifications = Notification::where('destinataire_id', $eleve->id)
            ->orderBy('date_creation', 'desc')
            ->take(5)
            ->get()
            ->map(function ($notif) {
                return [
                    'id' => $notif->id,
                    'titre' => $notif->titre,
                    'message' => $notif->contenu,
                    'lu' => $notif->lue,
                    'type' => $notif->type,
                    'date' => $notif->date_creation->diffForHumans()
                ];
            });

        return $this->successResponse([
            'user' => [
                'id' => $eleve->id,
                'nom' => $eleve->nom,
                'prenom' => $eleve->prenom,
                'role' => $eleve->role,
                'classe' => $eleve->classe ? [
                    'nom' => $eleve->classe->nom,
                    'niveau' => $eleve->classe->niveau->nom ?? 'N/A'
                ] : null
            ],
            'stats' => $stats,
            'notes' => $notesRecentes,
            'notifications' => $notifications
        ]);
    }
}