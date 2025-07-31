<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cours_professeurs', function (Blueprint $table) {
            $table->foreignId('classe_id')->nullable()->constrained('classes')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->nullable()->constrained('annees_scolaires')->onDelete('cascade');
            $table->enum('statut', ['active', 'inactive'])->default('active');
            
            // Supprimer l'ancienne contrainte unique
            $table->dropUnique(['cours_id', 'professeur_id']);
            
            // Ajouter nouvelle contrainte unique incluant la classe
            $table->unique(['cours_id', 'classe_id', 'professeur_id'], 'unique_cours_classe_prof');
        });
    }

    public function down(): void
    {
        Schema::table('cours_professeurs', function (Blueprint $table) {
            $table->dropForeign(['classe_id']);
            $table->dropForeign(['annee_scolaire_id']);
            $table->dropColumn(['classe_id', 'annee_scolaire_id', 'statut']);
            
            $table->dropUnique('unique_cours_classe_prof');
            $table->unique(['cours_id', 'professeur_id']);
        });
    }
};