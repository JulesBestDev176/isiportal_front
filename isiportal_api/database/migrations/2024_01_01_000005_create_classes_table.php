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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('niveau_id')->constrained('niveaux')->onDelete('cascade');
            $table->integer('effectif_max')->default(30);
            $table->text('description')->nullable();
            $table->foreignId('professeur_principal_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('statut', ['active', 'inactive', 'archivee'])->default('active');
            $table->foreignId('annee_scolaire_id')->constrained('annees_scolaires')->onDelete('cascade');
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamps();

            // Index
            $table->index(['niveau_id', 'statut']);
            $table->index(['annee_scolaire_id', 'statut']);
            $table->index('professeur_principal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
}; 