<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;

class CreneauController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->successResponse([], 'Créneaux récupérés');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->successResponse([], 'Créneau créé');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->successResponse([], 'Créneau récupéré');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return $this->successResponse([], 'Créneau mis à jour');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->successResponse([], 'Créneau supprimé');
    }
} 