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
        Schema::create('eleve_classe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->constrained('annees_scolaires')->onDelete('cascade');
            $table->decimal('moyenne_annuelle', 4, 2)->default(0);
            $table->enum('statut', ['inscrit', 'transfere', 'desinscrit', 'termine'])->default('inscrit');
            $table->timestamp('date_inscription');
            $table->timestamp('date_sortie')->nullable();
            $table->timestamps();

            // Index
            $table->index(['eleve_id', 'classe_id']);
            $table->index(['classe_id', 'annee_scolaire_id']);
            $table->index('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eleve_classe');
    }
}; 