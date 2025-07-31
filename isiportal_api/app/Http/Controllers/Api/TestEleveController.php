<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestEleveController extends Controller
{
    public function getElevesByClasse($classeId)
    {
        try {
            // Test simple pour voir si la table existe
            $count = DB::table('eleve_classe')->where('classe_id', $classeId)->count();
            
            return response()->json([
                'success' => true,
                'message' => "Test réussi",
                'classe_id' => $classeId,
                'count' => $count,
                'data' => []
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
} 