<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SimpleEleveController extends Controller
{
    public function getElevesByClasse($classeId)
    {
        // Retourner des données de test
        $eleves = [
            [
                'id' => 1,
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'moyenneAnnuelle' => 15.5,
                'statut' => 'inscrit',
                'dateInscription' => '2024-09-01'
            ],
            [
                'id' => 2,
                'nom' => 'Martin',
                'prenom' => 'Marie',
                'moyenneAnnuelle' => 12.8,
                'statut' => 'inscrit',
                'dateInscription' => '2024-09-01'
            ],
            [
                'id' => 3,
                'nom' => 'Bernard',
                'prenom' => 'Pierre',
                'moyenneAnnuelle' => 18.2,
                'statut' => 'inscrit',
                'dateInscription' => '2024-09-01'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $eleves
        ]);
    }
} 