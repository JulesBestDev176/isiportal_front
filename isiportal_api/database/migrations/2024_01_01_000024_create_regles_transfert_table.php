<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regles_transfert', function (Blueprint $table) {
            $table->id();
            $table->string('niveau_source');
            $table->string('niveau_destination');
            $table->decimal('moyenne_minimale', 4, 2)->default(8.00);
            $table->json('conditions_speciales')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regles_transfert');
    }
}; 