<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Creneau extends Model
{
    use HasFactory;

    protected $table = 'creneaux';

    protected $fillable = [
        'jour',
        'heure_debut',
        'heure_fin',
        'salle_id',
        'classe_id',
        'professeur_id',
        'cours_id',
        'statut',
        'date_creation'
    ];

    protected $casts = [
        'date_creation' => 'datetime'
    ];

    /**
     * Relation avec la salle
     */
    public function salle(): BelongsTo
    {
        return $this->belongsTo(Salle::class);
    }

    /**
     * Relation avec la classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Relation avec le professeur
     */
    public function professeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professeur_id');
    }

    /**
     * Relation avec le cours
     */
    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class);
    }

    /**
     * Relation avec les salles (many-to-many)
     */
    public function salles(): BelongsToMany
    {
        return $this->belongsToMany(Salle::class, 'creneau_salles');
    }

    /**
     * Obtenir le jour formaté
     */
    public function getJourLibelleAttribute(): string
    {
        return match($this->jour) {
            'lundi' => 'Lundi',
            'mardi' => 'Mardi',
            'mercredi' => 'Mercredi',
            'jeudi' => 'Jeudi',
            'vendredi' => 'Vendredi',
            'samedi' => 'Samedi',
            default => $this->jour
        };
    }

    /**
     * Obtenir la durée du créneau
     */
    public function getDureeAttribute(): string
    {
        $debut = \Carbon\Carbon::parse($this->heure_debut);
        $fin = \Carbon\Carbon::parse($this->heure_fin);
        
        $diff = $debut->diff($fin);
        
        if ($diff->h > 0) {
            return $diff->h . 'h' . ($diff->i > 0 ? $diff->i . 'min' : '');
        } else {
            return $diff->i . 'min';
        }
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'annule' => 'Annulé',
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
            'annule' => 'danger',
            default => 'info'
        };
    }

    /**
     * Vérifier si le créneau est en conflit
     */
    public function estEnConflit(): bool
    {
        return $this->statut === 'annule';
    }

    /**
     * Scope pour un jour spécifique
     */
    public function scopeParJour($query, $jour)
    {
        return $query->where('jour', $jour);
    }

    /**
     * Scope pour une salle spécifique
     */
    public function scopeParSalle($query, $salleId)
    {
        return $query->where('salle_id', $salleId);
    }

    /**
     * Scope pour une classe spécifique
     */
    public function scopeParClasse($query, $classeId)
    {
        return $query->where('classe_id', $classeId);
    }

    /**
     * Scope pour un professeur spécifique
     */
    public function scopeParProfesseur($query, $professeurId)
    {
        return $query->where('professeur_id', $professeurId);
    }

    /**
     * Scope pour un cours spécifique
     */
    public function scopeParCours($query, $coursId)
    {
        return $query->where('cours_id', $coursId);
    }

    /**
     * Scope pour les créneaux actifs
     */
    public function scopeActifs($query)
    {
        return $query->where('statut', 'active');
    }

    /**
     * Scope pour les créneaux annulés
     */
    public function scopeAnnules($query)
    {
        return $query->where('statut', 'annule');
    }
} 