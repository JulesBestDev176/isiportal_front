<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\Cours;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EleveDashboardController extends Controller
{
    use ApiResponse;

    public function getDashboard()
    {
        $user = Auth::user();
        
        if ($user->role !== 'eleve') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        if (!$user->classe_id) {
            return $this->errorResponse('Élève non assigné à une classe', 400);
        }

        try {
            // Récupérer les cours de l'élève
            $cours = Cours::whereHas('assignations', function($query) use ($user) {
                $query->where('classe_id', $user->classe_id);
            })
            ->with(['matiere:id,nom,code,coefficient', 'professeurs:id,nom,prenom'])
            ->get()
            ->map(function ($cours) use ($user) {
                // Calculer la moyenne pour ce cours
                $notes = Note::where('eleve_id', $user->id)
                    ->where('cours_id', $cours->id)
                    ->get();
                
                $moyenne = null;
                if ($notes->isNotEmpty()) {
                    $totalPoints = $notes->sum(function($note) {
                        return $note->note * $note->coefficient;
                    });
                    $totalCoefficients = $notes->sum('coefficient');
                    $moyenne = $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 1) : null;
                }

                return [
                    'id' => $cours->id,
                    'titre' => $cours->titre,
                    'description' => $cours->description,
                    'matiere' => [
                        'id' => $cours->matiere->id,
                        'nom' => $cours->matiere->nom,
                        'code' => $cours->matiere->code,
                        'coefficient' => $cours->matiere->coefficient,
                    ],
                    'professeur' => $cours->professeurs->first() ? [
                        'id' => $cours->professeurs->first()->id,
                        'nom_complet' => $cours->professeurs->first()->prenom . ' ' . $cours->professeurs->first()->nom,
                    ] : null,
                    'moyenne' => $moyenne,
                    'nombre_notes' => $notes->count(),
                    'heures_par_semaine' => $cours->heures_par_semaine ?? 2,
                ];
            });

            // Récupérer les notes récentes (dernières 2 semaines)
            $notesRecentes = Note::where('eleve_id', $user->id)
                ->where('date_evaluation', '>=', Carbon::now()->subWeeks(2))
                ->with(['matiere:id,nom,code', 'cours:id,titre'])
                ->orderBy('date_evaluation', 'desc')
                ->limit(5)
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
                            'nom' => $note->matiere->nom,
                            'code' => $note->matiere->code,
                        ],
                        'cours' => [
                            'titre' => $note->cours->titre,
                        ],
                    ];
                });

            // Récupérer les notifications récentes non lues
            $notifications = Notification::where(function($query) use ($user) {
                $query->where('destinataire_id', $user->id)
                      ->orWhere(function($q) use ($user) {
                          $q->whereJsonContains('destinataire_roles', $user->role);
                      });
            })
            ->where('lue', false)
            ->orderBy('date_creation', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'titre' => $notification->titre,
                    'contenu' => substr($notification->contenu, 0, 100) . (strlen($notification->contenu) > 100 ? '...' : ''),
                    'type' => $notification->type,
                    'type_libelle' => $notification->type_libelle,
                    'priorite' => $notification->priorite,
                    'date_creation' => $notification->date_creation->format('d/m/Y H:i'),
                    'expediteur' => $notification->expediteur ? [
                        'nom_complet' => $notification->expediteur->prenom . ' ' . $notification->expediteur->nom,
                    ] : null,
                ];
            });

            // Calculer les statistiques
            $totalCours = $cours->count();
            $coursAvecNotes = $cours->where('nombre_notes', '>', 0)->count();
            
            // Moyenne générale
            $toutesLesNotes = Note::where('eleve_id', $user->id)->get();
            $moyenneGenerale = null;
            if ($toutesLesNotes->isNotEmpty()) {
                $totalPoints = $toutesLesNotes->sum(function($note) {
                    return $note->note * $note->coefficient;
                });
                $totalCoefficients = $toutesLesNotes->sum('coefficient');
                $moyenneGenerale = $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 1) : null;
            }

            // Prochains cours (simulation - vous pouvez adapter selon votre modèle d'emploi du temps)
            $prochainsCoursData = $cours->take(3)->map(function($cours) {
                return [
                    'id' => $cours['id'],
                    'titre' => $cours['titre'],
                    'matiere' => $cours['matiere']['nom'],
                    'professeur' => $cours['professeur']['nom_complet'] ?? 'Non assigné',
                    'heure' => '08:00', // À adapter selon votre modèle
                    'salle' => 'A101', // À adapter selon votre modèle
                ];
            });

            return $this->successResponse([
                'eleve' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'nom_complet' => $user->prenom . ' ' . $user->nom,
                    'classe' => [
                        'id' => $user->classe->id,
                        'nom' => $user->classe->nom,
                        'niveau' => [
                            'id' => $user->classe->niveau->id,
                            'nom' => $user->classe->niveau->nom,
                        ],
                    ],
                ],
                'statistiques' => [
                    'total_cours' => $totalCours,
                    'cours_avec_notes' => $coursAvecNotes,
                    'moyenne_generale' => $moyenneGenerale,
                    'total_notes' => $toutesLesNotes->count(),
                    'notifications_non_lues' => $notifications->count(),
                ],
                'cours_recents' => $cours->take(4),
                'notes_recentes' => $notesRecentes,
                'notifications_recentes' => $notifications,
                'prochains_cours' => $prochainsCoursData,
            ], 'Dashboard récupéré avec succès');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du dashboard: ' . $e->getMessage(), 500);
        }
    }
}