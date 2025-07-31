<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Classe;
use App\Models\Niveau;
use App\Models\AnneeScolaire;
use Illuminate\Http\JsonResponse;

class InitialDataController extends Controller
{
    /**
     * Récupérer toutes les données initiales en une seule requête
     */
    public function getInitialData(): JsonResponse
    {
        try {
            // Récupérer toutes les données en parallèle
            $classes = Classe::with(['niveau', 'professeurPrincipal'])->get();
            $niveaux = Niveau::all();
            $professeurs = User::where('role', 'professeur')->select('id', 'nom', 'prenom', 'email')->get();
            $anneesScolaires = AnneeScolaire::all();
            $eleves = User::where('role', 'eleve')->with('classe.niveau')->get();

            return response()->json([
                'success' => true,
                'message' => 'Données initiales récupérées avec succès',
                'data' => [
                    'classes' => $classes,
                    'niveaux' => $niveaux,
                    'professeurs' => $professeurs,
                    'annees_scolaires' => $anneesScolaires,
                    'eleves' => $eleves
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données initiales',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}