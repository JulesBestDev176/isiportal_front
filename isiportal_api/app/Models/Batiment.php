<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Batiment extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'adresse',
        'statut',
        'date_creation'
    ];

    protected $casts = [
        'date_creation' => 'datetime'
    ];

    /**
     * Relation avec les salles
     */
    public function salles(): HasMany
    {
        return $this->hasMany(Salle::class);
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'actif' => 'Actif',
            'inactif' => 'Inactif',
            'renovation' => 'En rénovation',
            'maintenance' => 'En maintenance',
            default => $this->statut
        };
    }

    /**
     * Obtenir la couleur du statut
     */
    public function getStatutCouleurAttribute(): string
    {
        return match($this->statut) {
            'actif' => 'success',
            'inactif' => 'warning',
            'renovation' => 'info',
            'maintenance' => 'danger',
            default => 'secondary'
        };
    }

    /**
     * Obtenir le nombre de salles
     */
    public function getNombreSallesAttribute(): int
    {
        return $this->salles()->count();
    }

    /**
     * Obtenir le nombre de salles disponibles
     */
    public function getSallesDisponiblesAttribute(): int
    {
        return $this->salles()->where('statut', 'disponible')->count();
    }

    /**
     * Scope pour les bâtiments actifs
     */
    public function scopeActifs($query)
    {
        return $query->where('statut', 'actif');
    }

    /**
     * Scope pour les bâtiments en maintenance
     */
    public function scopeEnMaintenance($query)
    {
        return $query->whereIn('statut', ['maintenance', 'renovation']);
    }
} 