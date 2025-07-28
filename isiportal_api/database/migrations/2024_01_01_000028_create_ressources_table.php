<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ressources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('professeur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->constrained('annees_scolaires')->onDelete('cascade');
            $table->string('nom');
            $table->enum('type', ['document', 'video', 'lien', 'image', 'presentation']);
            $table->string('url');
            $table->text('description')->nullable();
            $table->enum('statut', ['active', 'inactive'])->default('active');
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamps();

            // Index
            $table->index(['cours_id', 'type']);
            $table->index(['professeur_id', 'statut']);
            $table->index('statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ressources');
    }
}; 