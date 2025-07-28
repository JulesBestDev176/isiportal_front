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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('contenu');
            $table->enum('type', ['info', 'warning', 'error', 'success', 'system'])->default('info');
            $table->enum('priorite', ['basse', 'normale', 'haute', 'urgente'])->default('normale');
            $table->foreignId('destinataire_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('expediteur_id')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('lue')->default(false);
            $table->timestamp('date_lecture')->nullable();
            $table->timestamp('date_envoi')->useCurrent();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamps();

            // Index
            $table->index(['destinataire_id', 'lue']);
            $table->index(['type', 'priorite']);
            $table->index('date_creation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
}; 