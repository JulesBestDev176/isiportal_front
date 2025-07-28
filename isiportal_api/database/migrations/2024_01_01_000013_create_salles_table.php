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
        Schema::create('salles', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('numero')->nullable();
            $table->integer('capacite')->default(30);
            $table->enum('type', [
                'salle_cours', 'laboratoire', 'salle_info', 'salle_arts', 
                'salle_musique', 'salle_sport', 'amphitheatre', 'salle_reunion'
            ])->default('salle_cours');
            $table->json('equipements')->nullable();
            $table->enum('statut', ['disponible', 'occupee', 'reservee', 'maintenance'])->default('disponible');
            $table->foreignId('batiment_id')->constrained('batiments')->onDelete('cascade');
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamps();

            // Index
            $table->index(['batiment_id', 'statut']);
            $table->index('type');
            $table->index('capacite');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salles');
    }
}; 