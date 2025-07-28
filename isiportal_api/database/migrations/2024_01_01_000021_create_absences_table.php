<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->constrained('annees_scolaires')->onDelete('cascade');
            $table->date('date_absence');
            $table->enum('periode', ['matin', 'apres_midi', 'journee']);
            $table->boolean('justifiee')->default(false);
            $table->text('motif')->nullable();
            $table->string('justificatif')->nullable();
            $table->text('commentaire')->nullable();
            $table->boolean('notifiee_parent')->default(false);
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index(['eleve_id', 'date_absence']);
            $table->index(['cours_id', 'date_absence']);
            $table->index(['annee_scolaire_id', 'justifiee']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
}; 