<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'code',
        'description',
        'coefficient',
        'heures_par_semaine',
        'statut',
        'niveaux_ids',
        'date_creation'
    ];

    protected $casts = [
        'coefficient' => 'decimal:2',
        'heures_par_semaine' => 'integer',
        'niveaux_ids' => 'array',
        'date_creation' => 'datetime'
    ];

    /**
     * Relation avec les cours
     */
    public function cours(): HasMany
    {
        return $this->hasMany(Cours::class);
    }

    /**
     * Relation avec les notes
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    /**
     * Relation avec les professeurs
     */
    public function professeurs(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_matieres')
                    ->where('role', 'professeur');
    }

    /**
     * Relation avec les niveaux
     */
    public function niveaux(): BelongsToMany
    {
        return $this->belongsToMany(Niveau::class, 'matiere_niveaux');
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'maintenance' => 'Maintenance',
            default => $this->statut
        };
    }

    /**
     * Obtenir la couleur du statut
     */
    public function getStatutCouleurAttribute(): string
    {
        return match($this->statut) {
            'active' => 'success',
            'inactive' => 'warning',
            'maintenance' => 'info',
            default => 'secondary'
        };
    }

    /**
     * Obtenir la couleur de la matière
     */
    public function getCouleurAttribute(): string
    {
        return match($this->code) {
            'MATH' => 'blue',
            'FRAN' => 'green',
            'HIST' => 'purple',
            'ANGL' => 'red',
            'ESP' => 'orange',
            'ALLE' => 'yellow',
            'PHYS' => 'indigo',
            'SVT' => 'pink',
            'EPS' => 'teal',
            'ARTS' => 'amber',
            'MUS' => 'lime',
            'TECH' => 'cyan',
            'PHIL' => 'emerald',
            default => 'gray'
        };
    }

    /**
     * Scope pour les matières actives
     */
    public function scopeActives($query)
    {
        return $query->where('statut', 'active');
    }

    /**
     * Scope pour filtrer par niveau
     */
    public function scopeParNiveau($query, $niveauId)
    {
        return $query->whereJsonContains('niveaux_ids', $niveauId);
    }

    /**
     * Scope pour rechercher par nom
     */
    public function scopeRecherche($query, $search)
    {
        return $query->where('nom', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
    }
} 