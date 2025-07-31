<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Note;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\AnneeScolaire;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function test()
    {
        return response()->json([
            'success' => true,
            'message' => 'API fonctionne correctement',
            'timestamp' => now(),
            'data' => [
                'users_count' => User::count(),
                'notes_count' => Note::count(),
                'cours_count' => Cours::count(),
                'matieres_count' => Matiere::count(),
                'annees_count' => AnneeScolaire::count()
            ]
        ]);
    }

    public function testAuth()
    {
        return response()->json([
            'success' => true,
            'message' => 'Authentification fonctionne',
            'user' => auth()->user()
        ]);
    }

    public function getAllUsers()
    {
        $users = User::select('id', 'nom', 'prenom', 'role', 'classe_id')->get();
        
        return response()->json([
            'success' => true,
            'data' => $users,
            'count' => $users->count()
        ]);
    }
}