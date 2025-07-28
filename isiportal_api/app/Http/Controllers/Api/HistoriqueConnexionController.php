<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;

class HistoriqueConnexionController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->successResponse([], 'Historique des connexions récupéré');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->successResponse([], 'Historique de connexion récupéré');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->successResponse([], 'Historique de connexion supprimé');
    }

    /**
     * Get historique by user
     */
    public function getHistoriqueByUser(string $userId)
    {
        return $this->successResponse([], 'Historique de connexion de l\'utilisateur récupéré');
    }

    /**
     * Get statistiques
     */
    public function getStatistiques()
    {
        return $this->successResponse([], 'Statistiques des connexions récupérées');
    }
} 