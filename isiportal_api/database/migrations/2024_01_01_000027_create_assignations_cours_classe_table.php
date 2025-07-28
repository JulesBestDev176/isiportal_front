<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignations_cours_classe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->constrained('annees_scolaires')->onDelete('cascade');
            $table->integer('heures_par_semaine')->default(0);
            $table->enum('statut', ['active', 'inactive'])->default('active');
            $table->text('remarques')->nullable();
            $table->timestamps();

            // Index
            $table->index(['cours_id', 'classe_id']);
            $table->index(['annee_scolaire_id', 'statut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignations_cours_classe');
    }
}; 