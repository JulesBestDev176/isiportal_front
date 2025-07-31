<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Note;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\AnneeScolaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function testCoursProfesseurs()
    {
        // Vérifier les cours avec leurs professeurs
        $cours = Cours::with(['professeurs', 'matiere', 'niveau'])->get();
        
        // Vérifier la table de liaison cours_professeurs
        $liaisons = \DB::table('cours_professeurs')
            ->join('cours', 'cours_professeurs.cours_id', '=', 'cours.id')
            ->join('users', 'cours_professeurs.professeur_id', '=', 'users.id')
            ->select(
                'cours_professeurs.*',
                'cours.titre as cours_titre',
                'users.nom as prof_nom',
                'users.prenom as prof_prenom'
            )
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => [
                'cours_count' => $cours->count(),
                'cours_avec_professeurs' => $cours->filter(fn($c) => $c->professeurs->count() > 0)->count(),
                'liaisons_count' => $liaisons->count(),
                'cours_details' => $cours->map(fn($c) => [
                    'id' => $c->id,
                    'titre' => $c->titre,
                    'matiere' => $c->matiere?->nom,
                    'niveau' => $c->niveau?->nom,
                    'professeurs_count' => $c->professeurs->count(),
                    'professeurs' => $c->professeurs->map(fn($p) => [
                        'id' => $p->id,
                        'nom' => $p->nom,
                        'prenom' => $p->prenom
                    ])
                ]),
                'liaisons_details' => $liaisons
            ]
        ]);
    }
}