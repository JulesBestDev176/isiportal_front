<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmploiDuTemps extends Model
{
    use HasFactory;

    protected $table = 'emploi_du_temps';

    protected $fillable = [
        'classe_id',
        'cours_id',
        'annee_scolaire_id',
        'jour',
        'periode',
        'salle_id',
        'professeur_id',
        'statut',
        'remarques',
    ];

    protected $casts = [
        'jour' => 'string',
        'periode' => 'string',
    ];

    /**
     * Relation avec la classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Relation avec le cours
     */
    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class);
    }

    /**
     * Relation avec l'année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    /**
     * Relation avec la salle
     */
    public function salle(): BelongsTo
    {
        return $this->belongsTo(Salle::class);
    }

    /**
     * Relation avec le professeur
     */
    public function professeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professeur_id');
    }

    /**
     * Scope pour les emplois du temps actifs
     */
    public function scopeActifs($query)
    {
        return $query->where('statut', 'active');
    }

    /**
     * Scope pour un jour spécifique
     */
    public function scopePourJour($query, $jour)
    {
        return $query->where('jour', $jour);
    }
} 