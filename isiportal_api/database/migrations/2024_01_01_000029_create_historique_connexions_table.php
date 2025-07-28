<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historique_connexions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('date_connexion');
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('plateforme')->default('web');
            $table->enum('statut', ['reussie', 'echouee'])->default('reussie');
            $table->text('remarques')->nullable();
            $table->timestamps();

            // Index
            $table->index(['user_id', 'date_connexion']);
            $table->index('statut');
            $table->index('date_connexion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historique_connexions');
    }
}; 