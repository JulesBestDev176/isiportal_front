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
            $eleves = User::where('role', 'eleve')
                ->where('classe_id', $classeId)
                ->select([
                    'id',
                    'nom', 
                    'prenom',
                    'email',
                    'classe_id',
                    'date_naissance'
                ])
                ->get()
                ->map(function ($eleve) {
                    return [
                        'id' => $eleve->id,
                        'nom' => $eleve->nom,
                        'prenom' => $eleve->prenom,
                        'email' => $eleve->email,
                        'classe_id' => $eleve->classe_id,
                        'classeId' => $eleve->classe_id, // Compatibilité frontend
                        'moyenne' => 12.5, // Valeur par défaut
                        'statut' => 'actif'
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