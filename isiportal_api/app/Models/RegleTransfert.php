<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegleTransfert extends Model
{
    use HasFactory;

    protected $table = 'regles_transfert';

    protected $fillable = [
        'niveau_source',
        'niveau_destination',
        'moyenne_minimale',
        'conditions_speciales',
        'actif',
    ];

    protected $casts = [
        'conditions_speciales' => 'array',
        'actif' => 'boolean',
        'moyenne_minimale' => 'decimal:2',
    ];

    /**
     * Scope pour les règles actives
     */
    public function scopeActives($query)
    {
        return $query->where('actif', true);
    }

    /**
     * Scope pour un niveau source spécifique
     */
    public function scopePourNiveauSource($query, $niveau)
    {
        return $query->where('niveau_source', $niveau);
    }

    /**
     * Vérifier si une moyenne respecte la règle
     */
    public function moyenneRespecteRegle($moyenne): bool
    {
        return $moyenne >= $this->moyenne_minimale;
    }

    /**
     * Vérifier si les conditions spéciales sont respectées
     */
    public function conditionsSpecialesRespectees($donnees): bool
    {
        if (empty($this->conditions_speciales)) {
            return true;
        }

        foreach ($this->conditions_speciales as $condition => $valeur) {
            if (!isset($donnees[$condition]) || $donnees[$condition] < $valeur) {
                return false;
            }
        }

        return true;
    }

    /**
     * Obtenir la description de la règle
     */
    public function getDescriptionAttribute(): string
    {
        return "Transfert de {$this->niveau_source} vers {$this->niveau_destination} - Moyenne minimale : {$this->moyenne_minimale}/20";
    }
} 