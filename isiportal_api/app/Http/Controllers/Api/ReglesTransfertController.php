<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReglesTransfert;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReglesTransfertController extends Controller
{
    use ApiResponse;

    /**
     * Récupérer la règle de transfert globale
     */
    public function index()
    {
        try {
            $regle = ReglesTransfert::getRegleGlobale();
            return $this->successResponse($regle->toApiFormat(), 'Règle de transfert récupérée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de la règle: ' . $e->getMessage());
        }
    }

    /**
     * Mettre à jour la règle de transfert globale
     */
    public function update(Request $request)
    {
        $request->validate([
            'moyenne_minimale' => 'required|numeric|min:0|max:20',
            'statut_requis' => 'required|in:inscrit,desinscrit,transfere,termine',
            'transfert_direct' => 'required|boolean',
            'desactiver_annee_apres_transfert' => 'required|boolean',
            'actif' => 'boolean'
        ]);

        $data = ReglesTransfert::convertApiData($request->all());
        $regle = ReglesTransfert::setRegleGlobale($data);
        
        return $this->successResponse($regle->toApiFormat(), 'Règle de transfert mise à jour avec succès');
    }

    /**
     * Récupérer toutes les règles (pour l'historique)
     */
    public function getAll()
    {
        try {
            $regles = ReglesTransfert::getAllRegles();
            $reglesFormatted = $regles->map(function($regle) {
                return $regle->toApiFormat();
            });
            return $this->successResponse($reglesFormatted, 'Toutes les règles de transfert récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des règles: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer la règle pour un niveau spécifique (utilise la règle globale)
     */
    public function show($niveauSource)
    {
        try {
            $regle = ReglesTransfert::getRegleGlobale();
            return $this->successResponse($regle->toApiFormat(), 'Règle de transfert récupérée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de la règle: ' . $e->getMessage());
        }
    }
}
