<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriqueConnexion extends Model
{
    use HasFactory;

    protected $table = 'historique_connexions';

    protected $fillable = [
        'user_id',
        'date_connexion',
        'ip_address',
        'user_agent',
        'plateforme',
        'statut',
        'remarques',
    ];

    protected $casts = [
        'date_connexion' => 'datetime',
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope pour les connexions réussies
     */
    public function scopeReussies($query)
    {
        return $query->where('statut', 'reussie');
    }

    /**
     * Scope pour les connexions échouées
     */
    public function scopeEchouees($query)
    {
        return $query->where('statut', 'echouee');
    }

    /**
     * Scope pour une période donnée
     */
    public function scopePourPeriode($query, $debut, $fin)
    {
        return $query->whereBetween('date_connexion', [$debut, $fin]);
    }
} 