<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriqueEleve extends Model
{
    use HasFactory;

    protected $table = 'historique_eleves';

    protected $fillable = [
        'eleve_id',
        'classe_id',
        'classe_nom',
        'annee_scolaire',
        'niveau_nom',
        'moyenne_annuelle',
        'statut',
        'date_inscription',
        'date_sortie',
        'remarques'
    ];

    protected $casts = [
        'moyenne_annuelle' => 'decimal:2',
        'date_inscription' => 'datetime',
        'date_sortie' => 'datetime'
    ];

    /**
     * Relation avec l'élève
     */
    public function eleve(): BelongsTo
    {
        return $this->belongsTo(User::class, 'eleve_id');
    }

    /**
     * Relation avec la classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'reussi' => 'Réussi',
            'redouble' => 'Redoublement',
            'transfert' => 'Transfert',
            'abandon' => 'Abandon',
            default => $this->statut
        };
    }

    /**
     * Obtenir la couleur du statut
     */
    public function getStatutCouleurAttribute(): string
    {
        return match($this->statut) {
            'reussi' => 'success',
            'redouble' => 'warning',
            'transfert' => 'info',
            'abandon' => 'danger',
            default => 'secondary'
        };
    }

    /**
     * Obtenir la durée de présence
     */
    public function getDureePresenceAttribute(): string
    {
        $debut = $this->date_inscription;
        $fin = $this->date_sortie ?? now();

        $diff = $debut->diff($fin);
        
        if ($diff->y > 0) {
            return $diff->y . ' an' . ($diff->y > 1 ? 's' : '');
        } elseif ($diff->m > 0) {
            return $diff->m . ' mois';
        } else {
            return $diff->d . ' jour' . ($diff->d > 1 ? 's' : '');
        }
    }

    /**
     * Vérifier si l'historique est actuel
     */
    public function getEstActuelAttribute(): bool
    {
        return $this->date_sortie === null;
    }

    /**
     * Scope pour filtrer par élève
     */
    public function scopeParEleve($query, $eleveId)
    {
        return $query->where('eleve_id', $eleveId);
    }

    /**
     * Scope pour filtrer par classe
     */
    public function scopeParClasse($query, $classeId)
    {
        return $query->where('classe_id', $classeId);
    }

    /**
     * Scope pour filtrer par année scolaire
     */
    public function scopeParAnnee($query, $annee)
    {
        return $query->where('annee_scolaire', $annee);
    }

    /**
     * Scope pour filtrer par statut
     */
    public function scopeParStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }

    /**
     * Scope pour les historiques actuels
     */
    public function scopeActuels($query)
    {
        return $query->whereNull('date_sortie');
    }

    /**
     * Scope pour les historiques terminés
     */
    public function scopeTermines($query)
    {
        return $query->whereNotNull('date_sortie');
    }

    /**
     * Scope pour les réussites
     */
    public function scopeReussis($query)
    {
        return $query->where('statut', 'reussi');
    }

    /**
     * Scope pour les redoublements
     */
    public function scopeRedoublements($query)
    {
        return $query->where('statut', 'redouble');
    }

    /**
     * Scope pour les transferts
     */
    public function scopeTransferts($query)
    {
        return $query->where('statut', 'transfert');
    }
} 