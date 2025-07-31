<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Classe;

class EleveClasseController extends Controller
{
    /**
     * Récupérer les élèves d'une classe
     */
    public function getElevesByClasse($classeId)
    {
        try {

            $eleves = DB::table('eleve_classe')
                ->join('users', 'eleve_classe.eleve_id', '=', 'users.id')
                ->where('eleve_classe.classe_id', $classeId)
                ->select([
                    'users.id',
                    'users.nom',
                    'users.prenom',
                    'users.email',
                    'eleve_classe.moyenne_annuelle',
                    'eleve_classe.statut',
                    'eleve_classe.date_inscription',
                    'eleve_classe.date_sortie'
                ])
                ->get()
                ->map(function ($eleve) {
                    return [
                        'id' => $eleve->id,
                        'nom' => $eleve->nom,
                        'prenom' => $eleve->prenom,
                        'email' => $eleve->email,
                        'moyenneAnnuelle' => (float) $eleve->moyenne_annuelle,
                        'statut' => $eleve->statut,
                        'dateInscription' => $eleve->date_inscription,
                        'dateSortie' => $eleve->date_sortie
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
     * Récupérer toutes les associations élève-classe
     */
    public function index()
    {
        try {
            $elevesClasses = DB::table('eleve_classe')
                ->join('users', 'eleve_classe.eleve_id', '=', 'users.id')
                ->join('classes', 'eleve_classe.classe_id', '=', 'classes.id')
                ->select([
                    'users.id as eleve_id',
                    'users.nom as eleve_nom',
                    'users.prenom as eleve_prenom',
                    'classes.id as classe_id',
                    'classes.nom as classe_nom',
                    'eleve_classe.moyenne_annuelle',
                    'eleve_classe.statut',
                    'eleve_classe.date_inscription'
                ])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $elevesClasses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des associations: ' . $e->getMessage()
            ], 500);
        }
    }
} 