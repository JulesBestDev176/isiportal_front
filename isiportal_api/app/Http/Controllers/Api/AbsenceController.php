<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\User;
use App\Models\Cours;
use App\Models\AnneeScolaire;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AbsenceController extends Controller
{
    use ApiResponse;

    /**
     * Récupère toutes les absences avec filtres
     */
    public function index(Request $request)
    {
        try {
            $query = Absence::with(['eleve', 'cours.matiere', 'anneeScolaire']);

            // Filtres
            if ($request->has('eleveId')) {
                $query->where('eleve_id', $request->eleveId);
            }

            if ($request->has('coursId')) {
                $query->where('cours_id', $request->coursId);
            }

            if ($request->has('anneeScolaireId')) {
                $query->where('annee_scolaire_id', $request->anneeScolaireId);
            }

            if ($request->has('dateAbsence')) {
                $query->where('date_absence', $request->dateAbsence);
            }

            if ($request->has('justifiee')) {
                $query->where('justifiee', $request->justifiee);
            }

            if ($request->has('periode')) {
                $query->where('periode', $request->periode);
            }

            $absences = $query->paginate($request->get('limit', 15));

            return $this->successResponse($absences, 'Absences récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences: ' . $e->getMessage());
        }
    }

    /**
     * Récupère une absence par ID
     */
    public function show($id)
    {
        try {
            $absence = Absence::with(['eleve', 'cours.matiere', 'anneeScolaire'])->findOrFail($id);
            return $this->successResponse($absence, 'Absence récupérée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Absence non trouvée');
        }
    }

    /**
     * Crée une nouvelle absence
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'eleve_id' => 'required|exists:users,id',
                'cours_id' => 'required|exists:cours,id',
                'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
                'date_absence' => 'required|date',
                'periode' => 'required|string|in:matin,apres_midi,journee',
                'justifiee' => 'boolean',
                'motif' => 'nullable|string',
                'justificatif' => 'nullable|string',
                'commentaire' => 'nullable|string',
                'notifiee_parent' => 'boolean',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $absence = Absence::create($request->all());
            $absence->load(['eleve', 'cours.matiere', 'anneeScolaire']);

            return $this->successResponse($absence, 'Absence créée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'absence: ' . $e->getMessage());
        }
    }

    /**
     * Met à jour une absence
     */
    public function update(Request $request, $id)
    {
        try {
            $absence = Absence::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'justifiee' => 'sometimes|boolean',
                'motif' => 'nullable|string',
                'justificatif' => 'nullable|string',
                'commentaire' => 'nullable|string',
                'notifiee_parent' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $absence->update($request->all());
            $absence->load(['eleve', 'cours.matiere', 'anneeScolaire']);

            return $this->successResponse($absence, 'Absence mise à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de l\'absence: ' . $e->getMessage());
        }
    }

    /**
     * Supprime une absence
     */
    public function destroy($id)
    {
        try {
            $absence = Absence::findOrFail($id);
            $absence->delete();

            return $this->successResponse(null, 'Absence supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'absence: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les absences d'un élève
     */
    public function getAbsencesEleve($eleveId, Request $request)
    {
        try {
            $query = Absence::where('eleve_id', $eleveId)
                ->with(['cours.matiere', 'anneeScolaire']);

            if ($request->has('anneeScolaireId')) {
                $query->where('annee_scolaire_id', $request->anneeScolaireId);
            }

            if ($request->has('dateFrom')) {
                $query->where('date_absence', '>=', $request->dateFrom);
            }

            if ($request->has('dateTo')) {
                $query->where('date_absence', '<=', $request->dateTo);
            }

            if ($request->has('justifiee')) {
                $query->where('justifiee', $request->justifiee);
            }

            $absences = $query->orderBy('date_absence', 'desc')->get();

            return $this->successResponse($absences, 'Absences de l\'élève récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les absences d'un cours
     */
    public function getAbsencesCours($coursId, Request $request)
    {
        try {
            $query = Absence::where('cours_id', $coursId)
                ->with(['eleve', 'anneeScolaire']);

            if ($request->has('dateAbsence')) {
                $query->where('date_absence', $request->dateAbsence);
            }

            if ($request->has('justifiee')) {
                $query->where('justifiee', $request->justifiee);
            }

            $absences = $query->orderBy('date_absence', 'desc')->get();

            return $this->successResponse($absences, 'Absences du cours récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les absences par date
     */
    public function getAbsencesByDate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'date' => 'required|date',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $absences = Absence::where('date_absence', $request->date)
                ->with(['eleve', 'cours.matiere', 'anneeScolaire'])
                ->orderBy('periode')
                ->get();

            return $this->successResponse($absences, 'Absences de la date récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences: ' . $e->getMessage());
        }
    }

    /**
     * Justifie une absence
     */
    public function justifierAbsence(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'justifiee' => 'required|boolean',
                'motif' => 'nullable|string',
                'justificatif' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $absence = Absence::findOrFail($id);
            $absence->update([
                'justifiee' => $request->justifiee,
                'motif' => $request->motif,
                'justificatif' => $request->justificatif,
            ]);

            $absence->load(['eleve', 'cours.matiere', 'anneeScolaire']);

            return $this->successResponse($absence, 'Absence justifiée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la justification de l\'absence: ' . $e->getMessage());
        }
    }

    /**
     * Notifie les parents d'une absence
     */
    public function notifierParent(Request $request, $id)
    {
        try {
            $absence = Absence::findOrFail($id);
            $absence->update(['notifiee_parent' => true]);

            // Ici, vous pouvez ajouter la logique d'envoi de notification
            // Mail::to($absence->eleve->parent_email)->send(new AbsenceNotification($absence));

            return $this->successResponse(null, 'Parent notifié avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la notification: ' . $e->getMessage());
        }
    }

    /**
     * Statistiques des absences
     */
    public function getStatistiques(Request $request)
    {
        try {
            $query = Absence::query();

            if ($request->has('anneeScolaireId')) {
                $query->where('annee_scolaire_id', $request->anneeScolaireId);
            }

            if ($request->has('eleveId')) {
                $query->where('eleve_id', $request->eleveId);
            }

            $stats = [
                'total' => $query->count(),
                'justifiees' => $query->where('justifiee', true)->count(),
                'nonJustifiees' => $query->where('justifiee', false)->count(),
                'notifiees' => $query->where('notifiee_parent', true)->count(),
                'parPeriode' => $query->selectRaw('periode, COUNT(*) as count')
                    ->groupBy('periode')
                    ->get(),
                'parMatiere' => $query->with('cours.matiere')
                    ->get()
                    ->groupBy('cours.matiere.nom')
                    ->map(function ($absences) {
                        return [
                            'count' => $absences->count(),
                            'justifiees' => $absences->where('justifiee', true)->count(),
                        ];
                    }),
            ];

            return $this->successResponse($stats, 'Statistiques des absences récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
        }
    }
} 