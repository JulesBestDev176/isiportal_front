<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'niveaux',
        'statut',
    ];

    protected $casts = [
        'niveaux' => 'array',
    ];

    /**
     * Relation avec les classes
     */
    public function classes(): HasMany
    {
        return $this->hasMany(Classe::class);
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            default => $this->statut
        };
    }

    /**
     * Scope pour les sections actives
     */
    public function scopeActives($query)
    {
        return $query->where('statut', 'active');
    }
} 