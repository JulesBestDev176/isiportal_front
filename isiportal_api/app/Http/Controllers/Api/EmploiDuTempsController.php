<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;

class EmploiDuTempsController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->successResponse([], 'Emplois du temps récupérés');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->successResponse([], 'Emploi du temps créé');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->successResponse([], 'Emploi du temps récupéré');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return $this->successResponse([], 'Emploi du temps mis à jour');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->successResponse([], 'Emploi du temps supprimé');
    }

    /**
     * Get emploi du temps by classe
     */
    public function getEmploiByClasse(string $classeId)
    {
        return $this->successResponse([], 'Emploi du temps de la classe récupéré');
    }

    /**
     * Get emploi du temps by professeur
     */
    public function getEmploiByProfesseur(string $professeurId)
    {
        return $this->successResponse([], 'Emploi du temps du professeur récupéré');
    }

    /**
     * Get emploi du temps by salle
     */
    public function getEmploiBySalle(string $salleId)
    {
        return $this->successResponse([], 'Emploi du temps de la salle récupéré');
    }
} 