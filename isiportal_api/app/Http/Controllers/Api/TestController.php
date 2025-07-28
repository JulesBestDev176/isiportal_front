<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;

class TestController extends Controller
{
    use ApiResponse;

    /**
     * Test simple pour vérifier que l'API fonctionne
     */
    public function test()
    {
        return $this->successResponse([
            'message' => 'API fonctionne correctement',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0'
        ], 'Test réussi');
    }

    /**
     * Test pour vérifier l'authentification
     */
    public function testAuth()
    {
        return $this->successResponse([
            'user_id' => auth()->id(),
            'user_role' => auth()->user()->role ?? 'guest',
            'authenticated' => auth()->check()
        ], 'Authentification testée');
    }

    /**
     * Test pour récupérer tous les utilisateurs sans pagination
     */
    public function getAllUsers()
    {
        try {
            $users = \App\Models\User::all(['id', 'nom', 'prenom', 'email', 'role', 'actif']);
            
            $rolesCount = $users->groupBy('role')->map(function ($group) {
                return $group->count();
            });

            return $this->successResponse([
                'total_users' => $users->count(),
                'roles_count' => $rolesCount,
                'all_roles' => $users->pluck('role')->unique()->values(),
                'users' => $users
            ], 'Tous les utilisateurs récupérés');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur: ' . $e->getMessage());
        }
    }
} 