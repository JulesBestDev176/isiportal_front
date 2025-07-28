<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ressource extends Model
{
    use HasFactory;

    protected $fillable = [
        'cours_id',
        'professeur_id',
        'annee_scolaire_id',
        'nom',
        'type',
        'url',
        'description',
        'statut',
        'date_creation',
    ];

    protected $casts = [
        'date_creation' => 'datetime',
    ];

    /**
     * Relation avec le cours
     */
    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class);
    }

    /**
     * Relation avec le professeur
     */
    public function professeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professeur_id');
    }

    /**
     * Relation avec l'année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    /**
     * Scope pour les ressources actives
     */
    public function scopeActives($query)
    {
        return $query->where('statut', 'active');
    }

    /**
     * Scope pour un type spécifique
     */
    public function scopePourType($query, $type)
    {
        return $query->where('type', $type);
    }
} 