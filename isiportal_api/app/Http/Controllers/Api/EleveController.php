<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Classe;
use Illuminate\Support\Facades\DB;

class EleveController extends Controller
{
    /**
     * Récupérer les élèves d'une classe
     */
    public function getElevesByClasse($classeId)
    {
        try {
            // Récupérer les élèves de la classe via la table eleve_classe
            $eleves = DB::table('eleve_classe')
                ->join('users', 'eleve_classe.eleve_id', '=', 'users.id')
                ->where('eleve_classe.classe_id', $classeId)
                ->select([
                    'users.id',
                    'users.nom',
                    'users.prenom',
                    'eleve_classe.moyenne_annuelle',
                    'eleve_classe.statut'
                ])
                ->get()
                ->map(function ($eleve) {
                    return [
                        'id' => $eleve->id,
                        'nom' => $eleve->nom,
                        'prenom' => $eleve->prenom,
                        'moyenneAnnuelle' => (float) $eleve->moyenne_annuelle,
                        'statut' => $eleve->statut,
                        'dateInscription' => '2024-09-01'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $eleves
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des élèves: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer le niveau d'un élève
     */
    public function getNiveauEleve($eleveId)
    {
        try {
            $eleve = User::where('id', $eleveId)
                ->where('role', 'eleve')
                ->with('classe.niveau')
                ->first();

            if (!$eleve) {
                return response()->json([
                    'success' => false,
                    'message' => 'Élève non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $eleve->id,
                    'nom' => $eleve->nom,
                    'prenom' => $eleve->prenom,
                    'classe_id' => $eleve->classe_id,
                    'niveau_id' => $eleve->classe ? $eleve->classe->niveau_id : null,
                    'niveau_nom' => $eleve->classe && $eleve->classe->niveau ? $eleve->classe->niveau->nom : null
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du niveau: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer tous les élèves
     */
    public function index()
    {
        try {
            $eleves = User::where('role', 'eleve')
                ->with('classe')
                ->select([
                    'id',
                    'nom',
                    'prenom',
                    'email',
                    'classe_id',
                    'date_naissance'
                ])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $eleves
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des élèves: ' . $e->getMessage()
            ], 500);
        }
    }
} 