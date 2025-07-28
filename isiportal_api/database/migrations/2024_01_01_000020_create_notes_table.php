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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained('matieres')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->constrained('annees_scolaires')->onDelete('cascade');
            $table->integer('semestre')->comment('1 ou 2');
            $table->enum('type_evaluation', ['devoir1', 'devoir2', 'composition', 'examen']);
            $table->decimal('note', 4, 2)->comment('Note sur 20');
            $table->decimal('coefficient', 3, 2)->default(1.00);
            $table->text('appreciation')->nullable();
            $table->date('date_evaluation');
            $table->text('commentaire')->nullable();
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index(['eleve_id', 'annee_scolaire_id', 'semestre']);
            $table->index(['cours_id', 'date_evaluation']);
            $table->index(['matiere_id', 'type_evaluation']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
}; 