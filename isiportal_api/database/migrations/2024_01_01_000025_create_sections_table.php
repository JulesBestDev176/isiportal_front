<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->json('niveaux')->nullable();
            $table->enum('statut', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // Index
            $table->index('statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
}; 