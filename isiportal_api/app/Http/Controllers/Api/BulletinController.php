<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BulletinController extends Controller
{
    /**
     * Liste des bulletins
     */
    public function index(Request $request): JsonResponse
    {
        $query = Bulletin::with(['eleve', 'anneeScolaire']);

        // Filtrage par élève
        if ($request->has('eleve_id')) {
            $query->where('eleve_id', $request->eleve_id);
        }

        // Filtrage par année scolaire
        if ($request->has('annee_scolaire_id')) {
            $query->where('annee_scolaire_id', $request->annee_scolaire_id);
        }

        // Filtrage par semestre
        if ($request->has('semestre')) {
            $query->where('semestre', $request->semestre);
        }

        // Filtrage par réussite
        if ($request->has('reussi')) {
            if ($request->boolean('reussi')) {
                $query->where('moyenne', '>=', 10);
            } else {
                $query->where('moyenne', '<', 10);
            }
        }

        // Tri par moyenne (décroissant)
        $query->orderBy('moyenne', 'desc');

        $bulletins = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Liste des bulletins',
            'data' => $bulletins
        ]);
    }

    /**
     * Créer un bulletin
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'eleve_id' => 'required|exists:users,id',
            'annee_scolaire_id' => 'required|exists:annees_scolaires,id',
            'semestre' => 'required|integer|in:1,2',
            'matieres' => 'required|array',
            'matieres.*.id' => 'required|exists:matieres,id',
            'matieres.*.moyenne' => 'required|numeric|min:0|max:20',
            'matieres.*.coefficient' => 'required|numeric|min:0|max:10',
            'matieres.*.appreciation' => 'nullable|string',
            'appreciation' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier qu'il n'y a pas déjà un bulletin pour cet élève, année et semestre
        $existant = Bulletin::where('eleve_id', $request->eleve_id)
                           ->where('annee_scolaire_id', $request->annee_scolaire_id)
                           ->where('semestre', $request->semestre)
                           ->first();

        if ($existant) {
            return response()->json([
                'success' => false,
                'message' => 'Un bulletin existe déjà pour cet élève, cette année et ce semestre'
            ], 422);
        }

        $bulletin = Bulletin::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bulletin créé avec succès',
            'data' => $bulletin->load(['eleve', 'anneeScolaire'])
        ], 201);
    }

    /**
     * Afficher un bulletin
     */
    public function show(int $id): JsonResponse
    {
        $bulletin = Bulletin::with(['eleve', 'anneeScolaire'])->findOrFail($id);

        // Récupérer les notes de l'élève pour l'année scolaire et le semestre du bulletin
        $notes = \App\Models\Note::with(['cours', 'matiere'])
            ->where('eleve_id', $bulletin->eleve_id)
            ->where('annee_scolaire_id', $bulletin->annee_scolaire_id)
            ->where('semestre', $bulletin->semestre)
            ->get();

        // Calcul de la moyenne pondérée
        $total = 0;
        $totalCoef = 0;
        foreach ($notes as $note) {
            $total += $note->note * $note->coefficient;
            $totalCoef += $note->coefficient;
        }
        $moyenne = $totalCoef > 0 ? round($total / $totalCoef, 2) : null;

        // Ajouter les notes et la moyenne à la réponse
        $data = $bulletin->toArray();
        $data['notes'] = $notes;
        $data['moyenne_calculee'] = $moyenne;

        return response()->json([
            'success' => true,
            'message' => 'Détails du bulletin',
            'data' => $data
        ]);
    }

    /**
     * Mettre à jour un bulletin
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $bulletin = Bulletin::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'matieres' => 'sometimes|array',
            'matieres.*.id' => 'required_with:matieres|exists:matieres,id',
            'matieres.*.moyenne' => 'required_with:matieres|numeric|min:0|max:20',
            'matieres.*.coefficient' => 'required_with:matieres|numeric|min:0|max:10',
            'matieres.*.appreciation' => 'nullable|string',
            'appreciation' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $bulletin->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bulletin mis à jour avec succès',
            'data' => $bulletin->load(['eleve', 'anneeScolaire'])
        ]);
    }

    /**
     * Supprimer un bulletin
     */
    public function destroy(int $id): JsonResponse
    {
        $bulletin = Bulletin::findOrFail($id);
        $bulletin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bulletin supprimé avec succès'
        ]);
    }

    /**
     * Obtenir les bulletins d'un élève
     */
    public function getBulletinsEleve(int $eleveId): JsonResponse
    {
        try {
            \Log::info("Début de getBulletinsEleve pour l'élève {$eleveId}");
            
            // Vérifier que l'utilisateur existe et a le rôle 'eleve'
            $eleve = \App\Models\User::where('id', $eleveId)
                                     ->where('role', 'eleve')
                                     ->first();

            if (!$eleve) {
                \Log::info("Élève non trouvé");
                return response()->json([
                    'success' => false,
                    'message' => 'Élève non trouvé ou utilisateur non autorisé',
                    'data' => []
                ], 404);
            }

            \Log::info("Élève trouvé: {$eleve->nom} {$eleve->prenom}");

            // Récupérer tous les bulletins et filtrer par eleve_id
            $bulletins = Bulletin::with(['anneeScolaire'])
                                ->where('eleve_id', $eleveId)
                                ->orderBy('annee_scolaire_id', 'desc')
                                ->orderBy('semestre', 'desc')
                                ->get();

            \Log::info("Bulletins trouvés: " . $bulletins->count());

            // Pour chaque bulletin, récupérer les notes associées
            foreach ($bulletins as $bulletin) {
                \Log::info("Traitement du bulletin {$bulletin->id}");
                
                // Récupérer les notes de l'élève pour l'année scolaire et le semestre du bulletin
                $notes = \App\Models\Note::with(['cours', 'matiere'])
                    ->where('eleve_id', $bulletin->eleve_id)
                    ->where('annee_scolaire_id', $bulletin->annee_scolaire_id)
                    ->where('semestre', $bulletin->semestre)
                    ->get();

                \Log::info("Notes trouvées pour le bulletin {$bulletin->id}: " . $notes->count());

                // Calculer la moyenne pondérée à partir des notes
                $total = 0;
                $totalCoef = 0;
                foreach ($notes as $note) {
                    $total += $note->note * $note->coefficient;
                    $totalCoef += $note->coefficient;
                }
                $moyenneCalculee = $totalCoef > 0 ? round($total / $totalCoef, 2) : null;

                // Ajouter les notes et la moyenne calculée au bulletin
                $bulletin->notes = $notes;
                $bulletin->moyenne_calculee = $moyenneCalculee;
            }

            \Log::info("Préparation de la réponse JSON");

            return response()->json([
                'success' => true,
                'message' => 'Bulletins de l\'élève',
                'data' => $bulletins
            ]);
        } catch (\Exception $e) {
            \Log::error("Erreur dans getBulletinsEleve: " . $e->getMessage());
            \Log::error("Stack trace: " . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir directement les notes d'un élève (sans bulletins)
     */
    public function getNotesEleve(int $eleveId): JsonResponse
    {
        try {
            // Vérifier que l'utilisateur existe et est un élève
            $user = \App\Models\User::find($eleveId);
            if (!$user || $user->role !== 'eleve') {
                return response()->json([
                    'success' => false,
                    'message' => 'Élève non trouvé'
                ], 404);
            }

            // Récupérer les notes sans relations d'abord
            $notes = \App\Models\Note::where('eleve_id', $eleveId)
                ->orderBy('annee_scolaire_id', 'desc')
                ->orderBy('semestre', 'desc')
                ->orderBy('matiere_id', 'asc')
                ->get();

            // Récupérer les matières séparément
            $matieres = \App\Models\Matiere::all()->keyBy('id');
            $cours = \App\Models\Cours::all()->keyBy('id');
            $anneesScolaires = \App\Models\AnneeScolaire::all()->keyBy('id');

            // Convertir en array simple
            $notesArray = $notes->map(function($note) use ($matieres, $cours, $anneesScolaires) {
                $matiere = $matieres->get($note->matiere_id);
                $coursItem = $cours->get($note->cours_id);
                $anneeScolaire = $anneesScolaires->get($note->annee_scolaire_id);
                
                return [
                    'id' => $note->id,
                    'eleve_id' => $note->eleve_id,
                    'cours_id' => $note->cours_id,
                    'matiere_id' => $note->matiere_id,
                    'annee_scolaire_id' => $note->annee_scolaire_id,
                    'semestre' => $note->semestre,
                    'type_evaluation' => $note->type_evaluation,
                    'note' => $note->note,
                    'coefficient' => $note->coefficient,
                    'appreciation' => $note->appreciation,
                    'date_evaluation' => $note->date_evaluation,
                    'commentaire' => $note->commentaire,
                    'matiere' => $matiere ? [
                        'id' => $matiere->id,
                        'nom' => $matiere->nom,
                        'code' => $matiere->code
                    ] : null,
                    'cours' => $coursItem ? [
                        'id' => $coursItem->id,
                        'titre' => $coursItem->titre,
                        'matiere_id' => $coursItem->matiere_id
                    ] : null,
                    'annee_scolaire' => $anneeScolaire ? [
                        'id' => $anneeScolaire->id,
                        'nom' => $anneeScolaire->nom,
                        'statut' => $anneeScolaire->statut
                    ] : null
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'message' => 'Notes de l\'élève',
                'data' => $notesArray
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération des notes: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des notes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les bulletins d'un élève (méthode alternative)
     */
    public function getBulletinsEleveAlternative(int $eleveId): JsonResponse
    {
        // Récupérer tous les bulletins
        $tousLesBulletins = Bulletin::with(['anneeScolaire'])->get();
        
        // Récupérer tous les utilisateurs avec le rôle 'eleve'
        $eleves = \App\Models\User::where('role', 'eleve')->get();
        $elevesIds = $eleves->pluck('id')->toArray();
        
        // Filtrer les bulletins pour ne garder que ceux de l'élève spécifié
        $bulletinsEleve = $tousLesBulletins->filter(function($bulletin) use ($eleveId, $elevesIds) {
            return $bulletin->eleve_id == $eleveId && in_array($bulletin->eleve_id, $elevesIds);
        });
        
        // Trier par année scolaire et semestre
        $bulletinsTries = $bulletinsEleve->sortByDesc('annee_scolaire_id')
                                        ->sortByDesc('semestre')
                                        ->values();
        
        // Pour chaque bulletin, récupérer les notes associées
        foreach ($bulletinsTries as $bulletin) {
            // Récupérer les notes de l'élève pour l'année scolaire et le semestre du bulletin
            $notes = \App\Models\Note::with(['cours', 'matiere'])
                ->where('eleve_id', $bulletin->eleve_id)
                ->where('annee_scolaire_id', $bulletin->annee_scolaire_id)
                ->where('semestre', $bulletin->semestre)
                ->get();

            // Calculer la moyenne pondérée à partir des notes
            $total = 0;
            $totalCoef = 0;
            foreach ($notes as $note) {
                $total += $note->note * $note->coefficient;
                $totalCoef += $note->coefficient;
            }
            $moyenneCalculee = $totalCoef > 0 ? round($total / $totalCoef, 2) : null;

            // Ajouter les notes et la moyenne calculée au bulletin
            $bulletin->notes = $notes;
            $bulletin->moyenne_calculee = $moyenneCalculee;
        }
        
        // Log pour debug
        \Log::info("Méthode alternative - Bulletins trouvés pour l'élève {$eleveId}: " . $bulletinsTries->count());
        foreach ($bulletinsTries as $bulletin) {
            \Log::info("Bulletin ID: {$bulletin->id}, Eleve ID: {$bulletin->eleve_id}, Annee: {$bulletin->annee_scolaire_id}, Semestre: {$bulletin->semestre}, Notes: " . $bulletin->notes->count());
        }

        return response()->json([
            'success' => true,
            'message' => 'Bulletins de l\'élève (méthode alternative)',
            'data' => $bulletinsTries
        ]);
    }

    /**
     * Obtenir les statistiques des bulletins
     */
    public function statistiques(Request $request): JsonResponse
    {
        $query = Bulletin::query();

        // Filtrage par année scolaire
        if ($request->has('annee_scolaire_id')) {
            $query->where('annee_scolaire_id', $request->annee_scolaire_id);
        }

        // Filtrage par semestre
        if ($request->has('semestre')) {
            $query->where('semestre', $request->semestre);
        }

        $stats = [
            'total_bulletins' => $query->count(),
            'moyenne_generale' => round($query->avg('moyenne'), 2),
            'reussis' => $query->where('moyenne', '>=', 10)->count(),
            'echoues' => $query->where('moyenne', '<', 10)->count(),
            'taux_reussite' => $query->count() > 0 ? round(($query->where('moyenne', '>=', 10)->count() / $query->count()) * 100, 2) : 0,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Statistiques des bulletins',
            'data' => $stats
        ]);
    }
} 