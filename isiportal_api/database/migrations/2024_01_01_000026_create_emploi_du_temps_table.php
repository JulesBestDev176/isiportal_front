<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emploi_du_temps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->constrained('annees_scolaires')->onDelete('cascade');
            $table->string('jour');
            $table->string('periode');
            $table->foreignId('salle_id')->nullable()->constrained('salles')->onDelete('set null');
            $table->foreignId('professeur_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('statut', ['active', 'inactive'])->default('active');
            $table->text('remarques')->nullable();
            $table->timestamps();

            // Index
            $table->index(['classe_id', 'jour']);
            $table->index(['cours_id', 'annee_scolaire_id']);
            $table->index('statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emploi_du_temps');
    }
}; 