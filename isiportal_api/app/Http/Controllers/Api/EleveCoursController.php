<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use App\Models\User;
use App\Models\Note;
use App\Services\EleveCoursService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class EleveCoursController extends Controller
{
    use ApiResponse;

    protected $eleveCoursService;

    public function __construct(EleveCoursService $eleveCoursService)
    {
        $this->eleveCoursService = $eleveCoursService;
    }

    public function getMesCours()
    {
        $user = Auth::user();
        
        if ($user->role !== 'eleve') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        if (!$user->classe_id) {
            return $this->errorResponse('Élève non assigné à une classe', 400);
        }

        try {
            // Récupérer les cours optimisés
            $cours = $this->eleveCoursService->getCoursOptimises($user);
            
            if ($cours->isEmpty()) {
                return $this->successResponse([
                    'cours' => [],
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
                        ]
                    ],
                    'statistiques' => [
                        'total_cours' => 0,
                        'moyenne_generale' => null,
                        'cours_avec_notes' => 0,
                        'cours_sans_notes' => 0,
                    ]
                ], 'Aucun cours assigné à cette classe');
            }

            // Calculer les statistiques de notes
            $statistiquesNotes = $this->eleveCoursService->getStatistiquesNotes($user, $cours);
            
            // Formater les cours
            $coursFormates = $this->eleveCoursService->formaterCours($cours, $statistiquesNotes);
            
            // Calculer les statistiques générales
            $statistiquesGenerales = $this->eleveCoursService->calculerStatistiquesGenerales($coursFormates);

            $response = [
                'cours' => $coursFormates->values(),
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
                    ]
                ],
                'statistiques' => $statistiquesGenerales
            ];

            // Nettoyer les données inutiles
            $response = $this->eleveCoursService->nettoyerDonnees($response);

            return $this->successResponse($response, 'Cours récupérés avec succès');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des cours: ' . $e->getMessage(), 500);
        }
    }

    public function getDetailsCours($coursId)
    {
        $user = Auth::user();
        
        if ($user->role !== 'eleve') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        $cours = Cours::with(['matiere', 'niveau', 'professeurs'])
            ->find($coursId);

        if (!$cours) {
            return $this->errorResponse('Cours non trouvé', 404);
        }

        // Vérifier que l'élève a accès à ce cours
        if ($cours->niveau_id !== $user->classe->niveau_id) {
            return $this->errorResponse('Accès non autorisé à ce cours', 403);
        }

        // Récupérer toutes les notes de l'élève pour ce cours
        $notes = Note::where('eleve_id', $user->id)
            ->where('matiere_id', $cours->matiere_id)
            ->orderBy('date_evaluation', 'desc')
            ->get()
            ->map(function ($note) {
                return [
                    'id' => $note->id,
                    'note' => $note->note,
                    'coefficient' => $note->coefficient,
                    'type_evaluation' => $note->type_evaluation,
                    'date_evaluation' => $note->date_evaluation->format('d/m/Y'),
                    'appreciation' => $note->appreciation,
                    'semestre' => $note->semestre,
                ];
            });

        // Calculer les moyennes par semestre
        $moyenneSemestre1 = $notes->where('semestre', 1)->avg('note');
        $moyenneSemestre2 = $notes->where('semestre', 2)->avg('note');
        $moyenneGenerale = $notes->avg('note');

        return $this->successResponse([
            'cours' => [
                'id' => $cours->id,
                'titre' => $cours->titre,
                'description' => $cours->description,
                'matiere' => [
                    'nom' => $cours->matiere->nom,
                    'code' => $cours->matiere->code,
                    'coefficient' => $cours->matiere->coefficient,
                ],
                'niveau' => [
                    'nom' => $cours->niveau->nom,
                    'cycle' => $cours->niveau->cycle,
                ],
                'professeur' => $cours->professeurs->first() ? [
                    'nom' => $cours->professeurs->first()->nom,
                    'prenom' => $cours->professeurs->first()->prenom,
                ] : null,
                'heures_par_semaine' => $cours->heures_par_semaine,
                'coefficient' => $cours->coefficient,
            ],
            'notes' => $notes,
            'statistiques' => [
                'moyenne_generale' => $moyenneGenerale ? round($moyenneGenerale, 1) : null,
                'moyenne_semestre_1' => $moyenneSemestre1 ? round($moyenneSemestre1, 1) : null,
                'moyenne_semestre_2' => $moyenneSemestre2 ? round($moyenneSemestre2, 1) : null,
                'nombre_notes' => $notes->count(),
                'meilleure_note' => $notes->max('note'),
                'note_la_plus_faible' => $notes->min('note'),
            ]
        ], 'Détails du cours récupérés avec succès');
    }
}