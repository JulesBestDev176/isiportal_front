<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bulletin extends Model
{
    use HasFactory;

    protected $fillable = [
        'eleve_id',
        'annee_scolaire',
        'semestre',
        'moyenne',
        'matieres',
        'appreciation',
        'date_creation',
        'date_modification'
    ];

    protected $casts = [
        'moyenne' => 'decimal:2',
        'matieres' => 'array',
        'date_creation' => 'datetime',
        'date_modification' => 'datetime'
    ];

    /**
     * Relation avec l'élève
     */
    public function eleve(): BelongsTo
    {
        return $this->belongsTo(User::class, 'eleve_id');
    }

    /**
     * Obtenir la mention
     */
    public function getMentionAttribute(): string
    {
        if ($this->moyenne >= 16) {
            return 'Très Bien';
        } elseif ($this->moyenne >= 14) {
            return 'Bien';
        } elseif ($this->moyenne >= 12) {
            return 'Assez Bien';
        } elseif ($this->moyenne >= 10) {
            return 'Passable';
        } else {
            return 'Insuffisant';
        }
    }

    /**
     * Obtenir la couleur de la mention
     */
    public function getMentionCouleurAttribute(): string
    {
        if ($this->moyenne >= 16) {
            return 'success';
        } elseif ($this->moyenne >= 14) {
            return 'info';
        } elseif ($this->moyenne >= 12) {
            return 'warning';
        } elseif ($this->moyenne >= 10) {
            return 'secondary';
        } else {
            return 'danger';
        }
    }

    /**
     * Obtenir le statut de réussite
     */
    public function getReussiAttribute(): bool
    {
        return $this->moyenne >= 10;
    }

    /**
     * Calculer la moyenne
     */
    public function calculerMoyenne(): float
    {
        if (empty($this->matieres)) {
            return 0;
        }

        $totalPoints = 0;
        $totalCoefficients = 0;

        foreach ($this->matieres as $matiere) {
            if (isset($matiere['moyenne']) && isset($matiere['coefficient'])) {
                $totalPoints += $matiere['moyenne'] * $matiere['coefficient'];
                $totalCoefficients += $matiere['coefficient'];
            }
        }

        return $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 2) : 0;
    }

    /**
     * Scope pour filtrer par élève
     */
    public function scopeParEleve($query, $eleveId)
    {
        return $query->where('eleve_id', $eleveId);
    }

    /**
     * Scope pour filtrer par année scolaire
     */
    public function scopeParAnneeScolaire($query, $anneeScolaire)
    {
        return $query->where('annee_scolaire', $anneeScolaire);
    }

    /**
     * Scope pour filtrer par semestre
     */
    public function scopeParSemestre($query, $semestre)
    {
        return $query->where('semestre', $semestre);
    }

    /**
     * Scope pour les bulletins réussis
     */
    public function scopeReussis($query)
    {
        return $query->where('moyenne', '>=', 10);
    }

    /**
     * Scope pour les bulletins échoués
     */
    public function scopeEchoues($query)
    {
        return $query->where('moyenne', '<', 10);
    }

    /**
     * Boot method pour calculer automatiquement la moyenne
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($bulletin) {
            $bulletin->moyenne = $bulletin->calculerMoyenne();
            $bulletin->date_modification = now();
        });
    }
} 