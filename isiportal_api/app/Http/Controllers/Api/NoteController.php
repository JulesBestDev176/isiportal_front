<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\User;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\AnneeScolaire;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
{
    use ApiResponse;

    /**
     * Récupère toutes les notes avec filtres
     */
    public function index(Request $request)
    {
        try {
            $query = Note::with(['eleve', 'cours.matiere', 'matiere', 'anneeScolaire']);

            // Filtres
            if ($request->has('eleveId')) {
                $query->where('eleve_id', $request->eleveId);
            }

            if ($request->has('coursId')) {
                $query->where('cours_id', $request->coursId);
            }

            if ($request->has('matiereId')) {
                $query->where('matiere_id', $request->matiereId);
            }

            if ($request->has('anneeScolaireId')) {
                $query->where('annee_scolaire_id', $request->anneeScolaireId);
            }

            if ($request->has('semestre')) {
                $query->where('semestre', $request->semestre);
            }

            if ($request->has('typeEvaluation')) {
                $query->where('type_evaluation', $request->typeEvaluation);
            }

            $notes = $query->paginate($request->get('limit', 15));

            return $this->successResponse($notes, 'Notes récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes: ' . $e->getMessage());
        }
    }

    /**
     * Récupère une note par ID
     */
    public function show($id)
    {
        try {
            $note = Note::with(['eleve', 'cours.matiere', 'matiere', 'anneeScolaire'])->findOrFail($id);
            return $this->successResponse($note, 'Note récupérée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Note non trouvée');
        }
    }

    /**
     * Crée une nouvelle note
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'eleve_id' => 'required|exists:users,id',
                'cours_id' => 'required|exists:cours,id',
                'matiere_id' => 'required|exists:matieres,id',
                'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
                'semestre' => 'required|integer|in:1,2',
                'type_evaluation' => 'required|string|in:devoir1,devoir2,composition,examen',
                'note' => 'required|numeric|min:0|max:20',
                'coefficient' => 'required|numeric|min:0',
                'appreciation' => 'nullable|string',
                'date_evaluation' => 'required|date',
                'commentaire' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $note = Note::create($request->all());
            $note->load(['eleve', 'cours.matiere', 'matiere', 'anneeScolaire']);

            return $this->successResponse($note, 'Note créée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la note: ' . $e->getMessage());
        }
    }

    /**
     * Met à jour une note
     */
    public function update(Request $request, $id)
    {
        try {
            $note = Note::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'note' => 'sometimes|numeric|min:0|max:20',
                'coefficient' => 'sometimes|numeric|min:0',
                'appreciation' => 'nullable|string',
                'date_evaluation' => 'sometimes|date',
                'commentaire' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $note->update($request->all());
            $note->load(['eleve', 'cours.matiere', 'matiere', 'anneeScolaire']);

            return $this->successResponse($note, 'Note mise à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de la note: ' . $e->getMessage());
        }
    }

    /**
     * Supprime une note
     */
    public function destroy($id)
    {
        try {
            $note = Note::findOrFail($id);
            $note->delete();

            return $this->successResponse(null, 'Note supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la note: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les notes d'un élève
     */
    public function getNotesEleve($eleveId, Request $request)
    {
        try {
            $query = Note::where('eleve_id', $eleveId)
                ->with(['cours.matiere', 'matiere', 'anneeScolaire']);

            if ($request->has('anneeScolaireId')) {
                $query->where('annee_scolaire_id', $request->anneeScolaireId);
            }

            if ($request->has('semestre')) {
                $query->where('semestre', $request->semestre);
            }

            if ($request->has('matiereId')) {
                $query->where('matiere_id', $request->matiereId);
            }

            $notes = $query->get();

            return $this->successResponse($notes, 'Notes de l\'élève récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les notes d'un cours
     */
    public function getNotesCours($coursId, Request $request)
    {
        try {
            $query = Note::where('cours_id', $coursId)
                ->with(['eleve', 'matiere', 'anneeScolaire']);

            if ($request->has('anneeScolaireId')) {
                $query->where('annee_scolaire_id', $request->anneeScolaireId);
            }

            if ($request->has('semestre')) {
                $query->where('semestre', $request->semestre);
            }

            $notes = $query->get();

            return $this->successResponse($notes, 'Notes du cours récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes: ' . $e->getMessage());
        }
    }

    /**
     * Calcule la moyenne d'un élève
     */
    public function calculerMoyenneEleve($eleveId, Request $request)
    {
        try {
            $query = Note::where('eleve_id', $eleveId);

            if ($request->has('anneeScolaireId')) {
                $query->where('annee_scolaire_id', $request->anneeScolaireId);
            }

            if ($request->has('semestre')) {
                $query->where('semestre', $request->semestre);
            }

            if ($request->has('matiereId')) {
                $query->where('matiere_id', $request->matiereId);
            }

            $notes = $query->get();

            if ($notes->isEmpty()) {
                return $this->successResponse(['moyenne' => 0], 'Aucune note trouvée');
            }

            $totalPoints = $notes->sum(function ($note) {
                return $note->note * $note->coefficient;
            });

            $totalCoefficients = $notes->sum('coefficient');

            $moyenne = $totalCoefficients > 0 ? $totalPoints / $totalCoefficients : 0;

            return $this->successResponse([
                'moyenne' => round($moyenne, 2),
                'totalNotes' => $notes->count(),
                'totalCoefficients' => $totalCoefficients,
            ], 'Moyenne calculée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du calcul de la moyenne: ' . $e->getMessage());
        }
    }

    /**
     * Statistiques des notes
     */
    public function getStatistiques(Request $request)
    {
        try {
            $query = Note::query();

            if ($request->has('anneeScolaireId')) {
                $query->where('annee_scolaire_id', $request->anneeScolaireId);
            }

            if ($request->has('semestre')) {
                $query->where('semestre', $request->semestre);
            }

            $stats = [
                'total' => $query->count(),
                'moyenne' => $query->avg('note'),
                'noteMin' => $query->min('note'),
                'noteMax' => $query->max('note'),
                'parType' => $query->selectRaw('type_evaluation, COUNT(*) as count, AVG(note) as moyenne')
                    ->groupBy('type_evaluation')
                    ->get(),
                'parMatiere' => $query->with('matiere')
                    ->get()
                    ->groupBy('matiere.nom')
                    ->map(function ($notes) {
                        return [
                            'count' => $notes->count(),
                            'moyenne' => $notes->avg('note'),
                        ];
                    }),
            ];

            return $this->successResponse($stats, 'Statistiques des notes récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
        }
    }
} 