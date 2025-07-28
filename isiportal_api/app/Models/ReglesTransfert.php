<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReglesTransfert extends Model
{
    use HasFactory;

    protected $table = 'regles_transfert';

    protected $fillable = [
        'moyenne_minimale',
        'actif',
        'niveau_source',
        'niveau_destination'
    ];

    protected $casts = [
        'moyenne_minimale' => 'decimal:2',
        'actif' => 'boolean'
    ];

    /**
     * Récupérer la règle de transfert globale (la première active)
     */
    public static function getRegleGlobale()
    {
        return self::where('actif', true)->first() ?? self::create([
            'niveau_source' => 'global',
            'niveau_destination' => 'global',
            'moyenne_minimale' => 10.00,
            'conditions_speciales' => [
                'absences_max' => 20,
                'francais_min' => 10,
                'mathematiques_min' => 10
            ],
            'actif' => true
        ]);
    }

    /**
     * Mettre à jour la règle de transfert globale
     */
    public static function updateRegleGlobale($data)
    {
        $regle = self::getRegleGlobale();
        $regle->update($data);
        return $regle;
    }

    /**
     * Désactiver toutes les autres règles et activer une nouvelle
     */
    public static function setRegleGlobale($data)
    {
        // Désactiver toutes les règles existantes
        self::where('actif', true)->update(['actif' => false]);
        
        // Créer ou activer la nouvelle règle
        $regle = self::where('niveau_source', 'global')->first();
        
        if ($regle) {
            $regle->update(array_merge($data, [
                'niveau_source' => 'global',
                'niveau_destination' => 'global',
                'actif' => true
            ]));
        } else {
            $regle = self::create(array_merge($data, [
                'niveau_source' => 'global',
                'niveau_destination' => 'global',
                'actif' => true
            ]));
        }
        
        return $regle;
    }

    /**
     * Récupérer toutes les règles (pour l'historique)
     */
    public static function getAllRegles()
    {
        return self::orderBy('created_at', 'desc')->get();
    }

    /**
     * Convertir les données de l'API vers le format de la base
     */
    public static function convertApiData($data)
    {
        return [
            'moyenne_minimale' => $data['moyenne_minimale'] ?? 10.00,
            'actif' => $data['actif'] ?? true,
            'niveau_source' => 'global',
            'niveau_destination' => 'global'
        ];
    }

    /**
     * Convertir les données de la base vers le format de l'API
     */
    public function toApiFormat()
    {
        return [
            'id' => $this->id,
            'moyenne_minimale' => $this->moyenne_minimale,
            'statut_requis' => 'inscrit',
            'transfert_direct' => true,
            'desactiver_annee_apres_transfert' => false,
            'conditions_supplementaires' => [],
            'actif' => $this->actif,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
