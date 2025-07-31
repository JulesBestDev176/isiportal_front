<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ParentEleveAuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Données invalides', 422, $validator->errors());
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->errorResponse('Identifiants incorrects', 401);
        }

        $user = Auth::user();
        
        if (!in_array($user->role, ['parent', 'eleve'])) {
            Auth::logout();
            return $this->errorResponse('Accès non autorisé', 403);
        }

        $token = $user->createToken('parent-eleve-auth')->plainTextToken;

        return $this->successResponse([
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
        ], 'Connexion réussie');
    }

    public function checkAuth()
    {
        $user = Auth::user();
        
        if (!$user || !in_array($user->role, ['parent', 'eleve'])) {
            return $this->errorResponse('Non authentifié', 401);
        }

        return $this->successResponse([
            'id' => $user->id,
            'nom' => $user->nom,
            'prenom' => $user->prenom,
            'email' => $user->email,
            'role' => $user->role,
        ], 'Utilisateur authentifié');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse(null, 'Déconnexion réussie');
    }
}