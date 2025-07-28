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
        Schema::create('historique_eleves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->string('classe_nom');
            $table->string('annee_scolaire');
            $table->string('niveau_nom');
            $table->decimal('moyenne_annuelle', 4, 2)->default(0);
            $table->enum('statut', ['reussi', 'redouble', 'transfert', 'abandon'])->default('reussi');
            $table->timestamp('date_inscription');
            $table->timestamp('date_sortie')->nullable();
            $table->text('remarques')->nullable();
            $table->timestamps();

            // Index
            $table->index(['eleve_id', 'annee_scolaire']);
            $table->index(['classe_id', 'annee_scolaire']);
            $table->index('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_eleves');
    }
}; 